import { after, NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { providerConfigured } from "@/lib/prospecting/places";
import { createSweep, executeSweep, listSweeps, type SweepArgs } from "@/lib/prospecting/sweep";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  niche: z.string().trim().min(1).max(200),
  countryCode: z.string().trim().min(1).max(8),
  max: z.number().int().min(1).max(200).optional(),
  city: z.string().trim().max(200).optional(),
  allCities: z.boolean().optional(),
});

/**
 * Kick off a sweep: insert the row, respond 202 immediately, and run the
 * actual provider searches via `after()` once the response is sent (same
 * pattern as the WhatsApp webhook's post-response work).
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

  const args: SweepArgs = {
    niche: parsed.data.niche,
    countryCode: parsed.data.countryCode,
    max: parsed.data.max,
    city: parsed.data.city || undefined,
    allCities: parsed.data.allCities,
  };

  const sweep = await createSweep(args);
  // executeSweep never throws — every failure lands on the sweep row.
  after(() => executeSweep(sweep.id, args));

  return NextResponse.json({ sweep }, { status: 202 });
}

/** Recent sweeps, newest first (polled by the SweepsStrip). */
export async function GET() {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ sweeps: await listSweeps(20) });
}
