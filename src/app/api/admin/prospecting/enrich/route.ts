import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { enrichBatch } from "@/lib/prospecting/enrich";
import { providerConfigured } from "@/lib/prospecting/places";

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
  ids: z.array(z.string().uuid()).min(1).max(100).optional(),
  filters: filtersSchema.optional(),
  limit: z.number().int().positive().optional(),
});

/**
 * Enrich prospects by explicit ids or by filters+limit. Each enrichment is
 * one metered Place Details call; the batch stops cleanly when the monthly
 * free-tier quota is hit (quotaHit: true in the result).
 */
export async function POST(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!providerConfigured()) {
    return NextResponse.json(
      { error: "Data provider key not configured — set the PROVIDER_API_KEY secret." },
      { status: 400 },
    );
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const result = await enrichBatch({
    ids: parsed.data.ids,
    filters: parsed.data.filters,
    limit: parsed.data.limit,
  });
  return NextResponse.json(result);
}
