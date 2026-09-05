import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { prospects, prospectSweeps } from "@/lib/db/schema";
import { citiesFor } from "./cities";
import { countryName } from "./countries";
import { searchPlaces, type ProviderPlace } from "./places";
import { computeProspectScore } from "./score";
import { QuotaExhaustedError, recordOrThrow } from "./quota";

/**
 * Sweep engine (ported from the Lead Finder sweeper's runSweep).
 *
 * A sweep = one niche × one country, optionally tiled across major cities
 * (the provider caps a single text query at ~60 results, so city-scoped
 * queries reach deeper). Results upsert into `prospects` deduped by
 * `dedupe_key`; `found` counts only NEWLY inserted rows.
 */

export type SweepRow = typeof prospectSweeps.$inferSelect;

export type SweepArgs = {
  niche: string;
  countryCode: string;
  max?: number;
  city?: string;
  allCities?: boolean;
};

const MAX_RESULTS_CAP = 200;
const DEFAULT_MAX = 60;
// Rows per multi-row INSERT — keeps parameter counts well under Postgres limits.
const INSERT_CHUNK = 500;

const QUOTA_MESSAGE = "Free tier search quota reached for this month.";

/** placeId when present, else `name|countryCode` — provider-agnostic dedupe. */
function dedupeKeyFor(place: ProviderPlace, countryCode: string): string {
  return place.placeId || `${place.name.toLowerCase().trim()}|${countryCode}`;
}

/**
 * Inserts the sweep row (status "running") and returns it. The caller kicks
 * off `executeSweep` afterwards (the route uses `after()` so the response
 * returns immediately while the sweep runs).
 */
export async function createSweep(args: SweepArgs): Promise<SweepRow> {
  const countryCode = args.countryCode.trim().toUpperCase();
  const [row] = await db
    .insert(prospectSweeps)
    .values({
      niche: args.niche.trim(),
      countryCode,
      countryName: countryName(countryCode),
      city: args.city?.trim() || null,
      allCities: Boolean(args.allCities),
      status: "running",
      found: 0,
    })
    .returning();
  return row;
}

/**
 * Runs the sweep created by `createSweep`: search per target, upsert
 * prospects, then stamp the sweep row done/failed. Never throws — all
 * failure modes end up on the sweep row's `status`/`error`.
 */
export async function executeSweep(sweepId: string, args: SweepArgs): Promise<void> {
  const niche = args.niche.trim();
  const countryCode = args.countryCode.trim().toUpperCase();
  const resolvedCountryName = countryName(countryCode);
  const max = Math.min(Math.max(args.max ?? DEFAULT_MAX, 1), MAX_RESULTS_CAP);
  const city = args.city?.trim() || undefined;

  // Resolve which searches to run. The provider caps a single text query at
  // ~60 results, so to go wider we run one search per major city and merge.
  // - a specific city      -> just that city
  // - "all major cities"   -> every curated city for the country (else country-wide)
  // - otherwise            -> a single country-wide search
  let targets: (string | undefined)[];
  if (city) {
    targets = [city];
  } else if (args.allCities) {
    const cities = citiesFor(countryCode);
    targets = cities.length ? cities : [undefined];
  } else {
    targets = [undefined];
  }

  try {
    const collected: ProviderPlace[] = [];
    let quotaHit = false;

    for (let i = 0; i < targets.length; i++) {
      // Each city/query is metered as one search — throws when the cap is hit.
      try {
        await recordOrThrow("search");
      } catch (err) {
        if (err instanceof QuotaExhaustedError) {
          quotaHit = true;
          break;
        }
        throw err;
      }

      try {
        const target = targets[i];
        const places = await searchPlaces({
          niche,
          countryCode,
          countryName: resolvedCountryName,
          max,
          city: target,
        });
        // When we searched a specific city, trust that over the address-derived
        // city so the city facet/filter stays clean.
        for (const p of places) {
          collected.push(target ? { ...p, city: target } : p);
        }
      } catch (err) {
        // The first query surfaces hard errors (bad key, API disabled); later
        // city queries are best-effort so one bad city doesn't fail the run.
        if (i === 0) throw err;
        console.warn(`[prospecting] sweep city query failed (${targets[i]}); continuing:`, err);
      }
    }

    const finished = new Date();

    // Nothing collected purely because the quota ran out — surface that clearly.
    if (collected.length === 0 && quotaHit) {
      await db
        .update(prospectSweeps)
        .set({ status: "failed", finishedAt: finished, error: QUOTA_MESSAGE })
        .where(eq(prospectSweeps.id, sweepId));
      return;
    }

    // Dedupe within the batch (the same place shows up in adjacent city
    // queries), then upsert; the unique dedupe_key index skips known rows.
    const byKey = new Map<string, ProviderPlace>();
    for (const p of collected) {
      const key = dedupeKeyFor(p, countryCode);
      if (!byKey.has(key)) byKey.set(key, p);
    }

    const values = [...byKey.entries()].map(([dedupeKey, p]) => ({
      name: p.name,
      niche,
      countryCode,
      countryName: resolvedCountryName,
      city: p.city,
      address: p.address,
      rating: p.rating,
      reviews: p.reviews,
      // Score the sparse (pre-enrichment) fields — recomputed on enrich.
      score: computeProspectScore({
        rating: p.rating,
        reviews: p.reviews,
        phone: null,
        website: null,
        linkedin: null,
        email: null,
        whatsapp: null,
        facebook: null,
        instagram: null,
      }),
      placeId: p.placeId || null,
      lat: p.lat,
      lng: p.lng,
      dedupeKey,
    }));

    let inserted = 0;
    for (let i = 0; i < values.length; i += INSERT_CHUNK) {
      const chunk = values.slice(i, i + INSERT_CHUNK);
      const rows = await db
        .insert(prospects)
        .values(chunk)
        .onConflictDoNothing({ target: prospects.dedupeKey })
        .returning({ id: prospects.id });
      inserted += rows.length;
    }

    await db
      .update(prospectSweeps)
      .set({ status: "done", found: inserted, finishedAt: finished, error: null })
      .where(eq(prospectSweeps.id, sweepId));
  } catch (err) {
    const message =
      err instanceof QuotaExhaustedError
        ? QUOTA_MESSAGE
        : err instanceof Error
          ? err.message
          : "Sweep failed.";
    console.error(`[prospecting] sweep ${sweepId} failed:`, err);

    await db
      .update(prospectSweeps)
      .set({ status: "failed", finishedAt: new Date(), error: message })
      .where(eq(prospectSweeps.id, sweepId));
  }
}

/** Recent sweeps, newest first. */
export async function listSweeps(limit = 20): Promise<SweepRow[]> {
  return db
    .select()
    .from(prospectSweeps)
    .orderBy(desc(prospectSweeps.createdAt))
    .limit(limit);
}
