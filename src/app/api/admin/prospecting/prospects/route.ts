import { count, desc, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { prospects } from "@/lib/db/schema";
import { prospectWhere, type ProspectFilters } from "@/lib/prospecting/enrich";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ENRICHMENT_VALUES = new Set(["all", "enriched", "not_enriched"]);
const SORT_VALUES = new Set(["recent", "score", "rating"]);

/** Numeric query param — undefined when absent, empty, or not a number. */
function numParam(url: URL, key: string): number | undefined {
  const raw = url.searchParams.get(key);
  if (raw === null || raw.trim() === "") return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function strParam(url: URL, key: string): string | undefined {
  const raw = url.searchParams.get(key)?.trim();
  return raw ? raw : undefined;
}

function orderFor(sort: ProspectFilters["sort"]) {
  switch (sort) {
    // Final id tiebreak everywhere: rows from one sweep share createdAt (one
    // multi-row INSERT), so without it pages can duplicate/drop prospects.
    case "score":
      return [desc(prospects.score), desc(prospects.createdAt), desc(prospects.id)];
    case "rating":
      // NULLS LAST so un-rated rows don't float to the top of a desc sort.
      return [sql`${prospects.rating} desc nulls last`, desc(prospects.createdAt), desc(prospects.id)];
    default:
      return [desc(prospects.createdAt), desc(prospects.id)];
  }
}

/**
 * Paged prospect list. Query params: the ProspectFilters fields (q,
 * countryCode, niche, city, minRating, minReviews, enrichment, sort) plus
 * `page` (1-based) and `pageSize` (default 50, max 200).
 */
export async function GET(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);

  const enrichmentRaw = strParam(url, "enrichment");
  const sortRaw = strParam(url, "sort");
  const filters: ProspectFilters = {
    q: strParam(url, "q"),
    countryCode: strParam(url, "countryCode"),
    niche: strParam(url, "niche"),
    city: strParam(url, "city"),
    minRating: numParam(url, "minRating"),
    minReviews: numParam(url, "minReviews"),
    enrichment:
      enrichmentRaw && ENRICHMENT_VALUES.has(enrichmentRaw)
        ? (enrichmentRaw as ProspectFilters["enrichment"])
        : undefined,
    sort:
      sortRaw && SORT_VALUES.has(sortRaw)
        ? (sortRaw as ProspectFilters["sort"])
        : undefined,
  };

  const page = Math.max(1, Math.trunc(numParam(url, "page") ?? 1));
  const pageSize = Math.max(1, Math.min(Math.trunc(numParam(url, "pageSize") ?? 50), 200));

  const where = prospectWhere(filters);
  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(prospects)
      .where(where)
      .orderBy(...orderFor(filters.sort))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ total: count() }).from(prospects).where(where),
  ]);

  return NextResponse.json({ items, total, page, pageSize });
}
