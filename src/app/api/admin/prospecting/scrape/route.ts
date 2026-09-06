import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import type { ProspectFilters } from "@/lib/prospecting/enrich";
import { previewScrape, scrapeBatch } from "@/lib/prospecting/scrape";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Up to 25 sites × ≤2 fetches × 8s timeout in one request.
export const maxDuration = 300;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Website contact scraping (wa.me numbers, emails, socials). `preview: true`
 * counts how many filtered prospects still need a scrape; otherwise runs a
 * batch. Free — no metered provider involved.
 */
export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = ((await request.json().catch(() => null)) ?? {}) as {
    preview?: boolean;
    ids?: unknown;
    filters?: ProspectFilters;
    limit?: number;
  };
  const filters = (body.filters ?? {}) as ProspectFilters;

  if (body.preview) {
    return NextResponse.json(await previewScrape(filters, body.limit));
  }

  const ids = Array.isArray(body.ids)
    ? body.ids.filter((v): v is string => typeof v === "string" && UUID.test(v)).slice(0, 25)
    : undefined;

  const result = await scrapeBatch({ ids, filters, limit: body.limit });
  return NextResponse.json(result);
}
