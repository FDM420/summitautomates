import { and, desc, eq, inArray, lt } from "drizzle-orm";
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

/**
 * `place:<placeId>` when present, else `nc:<name>|<CC>` — MUST match the
 * sweeper/importer format exactly (see D:\sweeper repos + import-sweeper.mjs),
 * or re-swept businesses duplicate rows imported from the old system.
 */
function dedupeKeyFor(place: ProviderPlace, countryCode: string): string {
  if (place.placeId) return `place:${place.placeId}`;
  return `nc:${place.name.trim().toLowerCase()}|${countryCode.toUpperCase()}`;
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
    // Persist INCREMENTALLY, one target at a time: after() work is best-effort
    // on Cloud Run, so if the instance is recycled mid-sweep the cities already
    // searched (and their metered quota) are not lost, and `found` doubles as a
    // live progress counter for the UI.
    const seen = new Set<string>();
    let inserted = 0;
    let anyCollected = false;
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

      let places: ProviderPlace[];
      try {
        const target = targets[i];
        const found = await searchPlaces({
          niche,
          countryCode,
          countryName: resolvedCountryName,
          max,
          city: target,
        });
        // When we searched a specific city, trust that over the address-derived
        // city so the city facet/filter stays clean.
        places = found.map((p) => (target ? { ...p, city: target } : p));
      } catch (err) {
        // The first query surfaces hard errors (bad key, API disabled); later
        // city queries are best-effort so one bad city doesn't fail the run.
        if (i === 0) throw err;
        console.warn(`[prospecting] sweep city query failed (${targets[i]}); continuing:`, err);
        continue;
      }

      anyCollected ||= places.length > 0;

      // Dedupe within the sweep (the same place shows up in adjacent city
      // queries), then upsert; the unique dedupe_key index skips known rows.
      const values = places
        .filter((p) => {
          const key = dedupeKeyFor(p, countryCode);
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((p) => ({
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
          dedupeKey: dedupeKeyFor(p, countryCode),
        }));

      for (let j = 0; j < values.length; j += INSERT_CHUNK) {
        const chunk = values.slice(j, j + INSERT_CHUNK);
        const rows = await db
          .insert(prospects)
          .values(chunk)
          .onConflictDoNothing({ target: prospects.dedupeKey })
          .returning({ id: prospects.id });
        inserted += rows.length;
      }

      // Live progress for the sweeps strip (still "running").
      await db
        .update(prospectSweeps)
        .set({ found: inserted })
        .where(eq(prospectSweeps.id, sweepId));
    }

    const finished = new Date();

    // Nothing collected purely because the quota ran out — surface that clearly.
    if (!anyCollected && quotaHit) {
      await db
        .update(prospectSweeps)
        .set({ status: "failed", finishedAt: finished, error: QUOTA_MESSAGE })
        .where(eq(prospectSweeps.id, sweepId));
      return;
    }

    await db
      .update(prospectSweeps)
      .set({
        status: "done",
        found: inserted,
        finishedAt: finished,
        // A quota stop mid-run still finishes, but says so instead of a clean done.
        error: quotaHit ? "Stopped early: free-tier search quota reached — results are partial." : null,
      })
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

// A sweep older than this still marked running was killed mid-flight (Cloud
// Run recycled the instance during after()) — nothing will ever finish it.
const STALE_RUNNING_MS = 15 * 60 * 1000;

/**
 * Recent sweeps, newest first. Self-heals first: stale queued/running rows are
 * stamped failed so the UI never polls a dead sweep forever. Any results the
 * sweep persisted before dying are kept (inserts are incremental).
 */
export async function listSweeps(limit = 20): Promise<SweepRow[]> {
  await db
    .update(prospectSweeps)
    .set({
      status: "failed",
      finishedAt: new Date(),
      error: "Sweep interrupted before finishing (server instance recycled) — re-run it.",
    })
    .where(
      and(
        inArray(prospectSweeps.status, ["queued", "running"]),
        lt(prospectSweeps.createdAt, new Date(Date.now() - STALE_RUNNING_MS)),
      ),
    );

  return db
    .select()
    .from(prospectSweeps)
    .orderBy(desc(prospectSweeps.createdAt))
    .limit(limit);
}
