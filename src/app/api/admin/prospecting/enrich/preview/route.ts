import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { previewEnrich } from "@/lib/prospecting/enrich";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const filtersSchema = z.object({
  q: z.string().max(200).optional(),
  countryCode: z.string().max(8).optional(),
  niche: z.string().max(200).optional(),
  city: z.string().max(200).optional(),
  minRating: z.number().min(0).max(5).optional(),
  minReviews: z.number().int().min(0).optional(),
  enrichment: z.enum(["all", "enriched", "not_enriched"]).optional(),
  sort: z.enum(["recent", "score", "rating"]).optional(),
});

const schema = z.object({
  filters: filtersSchema.optional(),
  limit: z.number().int().positive().optional(),
});

/**
 * Dry-run of a filter-based enrichment: how many un-enriched prospects match,
 * remaining quota, and how many would actually be enriched now. Works without
 * a provider key (no metered calls are made).
 */
export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const preview = await previewEnrich(parsed.data.filters ?? {}, parsed.data.limit);
  return NextResponse.json(preview);
}
