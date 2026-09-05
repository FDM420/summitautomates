import { and, asc, count, eq, gte, ilike, inArray, or, sql, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { prospects } from "@/lib/db/schema";
import { getPlaceDetails } from "./places";
import { computeProspectScore } from "./score";
import { QuotaExhaustedError, recordOrThrow, remaining } from "./quota";

/**
 * Enrichment engine (ported from the Lead Finder sweeper).
 *
 * Enrichment = one metered Place Details lookup per prospect, filling in
 * phone/website/hours and recomputing the partner-fit score. Every lookup
 * routes through recordOrThrow("details") so we never exceed the free tier.
 */

type ProspectRow = typeof prospects.$inferSelect;

export type ProspectFilters = {
  q?: string;
  countryCode?: string;
  niche?: string;
  city?: string;
  minRating?: number;
  minReviews?: number;
  enrichment?: "all" | "enriched" | "not_enriched";
  sort?: "recent" | "score" | "rating";
};

export type EnrichPreview = {
  matching: number;
  quotaRemaining: number;
  planned: number;
  willStopEarly: boolean;
};

export type EnrichResult = {
  enriched: number;
  failed: number;
  quotaHit: boolean;
};

// Preview and run share this cap so the confirmation modal never understates
// the metered spend; 50 sequential Place Details calls also stay comfortably
// inside one request's time budget on Cloud Run.
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 50;

function clampLimit(limit?: number): number {
  return Math.min(Math.max(limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
}

/**
 * Shared filter → Drizzle where translation, reused by the list/facet routes.
 * `sort` is ignored here (ordering is the caller's concern). Returns undefined
 * when no filter applies.
 */
/** Escape LIKE metacharacters so user input matches literally. */
const escapeLike = (s: string) => s.replace(/[\\%_]/g, (c) => `\\${c}`);

export function prospectWhere(filters: ProspectFilters): SQL | undefined {
  const conds: (SQL | undefined)[] = [];

  if (filters.q?.trim()) {
    const like = `%${escapeLike(filters.q.trim())}%`;
    conds.push(
      or(
        ilike(prospects.name, like),
        ilike(prospects.city, like),
        ilike(prospects.niche, like),
      ),
    );
  }
  if (filters.countryCode?.trim()) {
    conds.push(eq(prospects.countryCode, filters.countryCode.trim().toUpperCase()));
  }
  // Escaped ilike without wildcards = case-insensitive equality (facet values).
  if (filters.niche?.trim()) conds.push(ilike(prospects.niche, escapeLike(filters.niche.trim())));
  if (filters.city?.trim()) conds.push(ilike(prospects.city, escapeLike(filters.city.trim())));
  if (typeof filters.minRating === "number") {
    conds.push(gte(prospects.rating, filters.minRating));
  }
  if (typeof filters.minReviews === "number") {
    conds.push(gte(prospects.reviews, filters.minReviews));
  }
  if (filters.enrichment === "enriched") conds.push(eq(prospects.enriched, true));
  if (filters.enrichment === "not_enriched") conds.push(eq(prospects.enriched, false));

  return and(...conds);
}

/**
 * Preview a filter-based enrichment: how many un-enriched prospects match,
 * how much free-tier quota remains, how many will actually be enriched now,
 * and whether we will stop early because the quota is smaller than the batch.
 */
export async function previewEnrich(
  filters: ProspectFilters,
  limit?: number,
): Promise<EnrichPreview> {
  const requested = clampLimit(limit);
  const notEnriched = and(prospectWhere(filters), eq(prospects.enriched, false));

  const [[{ matching }], quotaRemaining] = await Promise.all([
    db.select({ matching: count() }).from(prospects).where(notEnriched),
    remaining("details"),
  ]);

  // Candidate set is the matching prospects capped at the requested batch limit.
  const candidates = Math.min(matching, requested);
  const planned = Math.min(candidates, quotaRemaining);
  const willStopEarly = candidates > quotaRemaining;

  return { matching, quotaRemaining, planned, willStopEarly };
}

/**
 * Enrich a batch of prospects, resolved either by explicit ids or by
 * filters+limit (un-enriched only, oldest first). QuotaExhaustedError stops
 * the batch; other per-prospect errors mark that row failed and continue.
 */
export async function enrichBatch(args: {
  ids?: string[];
  filters?: ProspectFilters;
  limit?: number;
}): Promise<EnrichResult> {
  const result: EnrichResult = { enriched: 0, failed: 0, quotaHit: false };
  const fromIds = Boolean(args.ids && args.ids.length > 0);

  // Resolve the target prospects.
  let targets: ProspectRow[];
  if (args.ids && args.ids.length > 0) {
    targets = await db
      .select()
      .from(prospects)
      .where(inArray(prospects.id, args.ids.slice(0, MAX_LIMIT)));
  } else {
    targets = await db
      .select()
      .from(prospects)
      .where(and(prospectWhere(args.filters ?? {}), eq(prospects.enriched, false)))
      .orderBy(asc(prospects.createdAt))
      .limit(clampLimit(args.limit));
  }

  for (const prospect of targets) {
    try {
      if (!prospect.placeId) {
        // Cannot enrich without a provider place reference.
        await db
          .update(prospects)
          .set({ status: "failed", updatedAt: new Date() })
          .where(eq(prospects.id, prospect.id));
        result.failed += 1;
        continue;
      }

      // Claim the row BEFORE spending quota: compare-and-swap on updatedAt
      // (µs precision in PG vs ms in JS, hence the date_trunc) so overlapping
      // runs — a retried batch, two tabs — meter each row at most once.
      // Explicit-id runs may deliberately re-enrich, so only the filter path
      // additionally requires enriched=false.
      const claimed = await db
        .update(prospects)
        .set({ updatedAt: new Date() })
        .where(
          and(
            eq(prospects.id, prospect.id),
            // ISO + cast: raw sql`` params skip drizzle's column mapping, so a
            // bare Date would reach postgres.js unserialized and throw.
            sql`date_trunc('milliseconds', ${prospects.updatedAt}) = ${prospect.updatedAt.toISOString()}::timestamptz`,
            ...(fromIds ? [] : [eq(prospects.enriched, false)]),
          ),
        )
        .returning({ id: prospects.id });
      if (claimed.length === 0) continue; // another run owns it / already done

      // Meter BEFORE the provider call — throws if the cap is reached.
      await recordOrThrow("details");
      const details = await getPlaceDetails(prospect.placeId);

      const rating = details.rating ?? prospect.rating;
      const reviews = details.reviews ?? prospect.reviews;
      await db
        .update(prospects)
        .set({
          phone: details.phone,
          website: details.website,
          hours: details.hours,
          rating,
          reviews,
          status: "enriched",
          enriched: true,
          // Rescore on the now-complete field set (socials from earlier scrapes).
          score: computeProspectScore({
            rating,
            reviews,
            phone: details.phone,
            website: details.website,
            linkedin: prospect.linkedin,
            email: prospect.email,
            whatsapp: prospect.whatsapp,
            facebook: prospect.facebook,
            instagram: prospect.instagram,
          }),
          updatedAt: new Date(),
        })
        .where(eq(prospects.id, prospect.id));
      result.enriched += 1;
    } catch (err) {
      if (err instanceof QuotaExhaustedError) {
        result.quotaHit = true;
        break;
      }
      console.warn(`[prospecting] enrichment failed for prospect ${prospect.id}:`, err);
      // Conditional stamp: never downgrade a row another run already enriched.
      await db
        .update(prospects)
        .set({ status: "failed", updatedAt: new Date() })
        .where(and(eq(prospects.id, prospect.id), eq(prospects.enriched, false)));
      result.failed += 1;
    }
  }

  return result;
}
