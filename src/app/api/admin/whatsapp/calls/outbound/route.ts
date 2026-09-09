import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { initiateOutboundCall } from "@/lib/whatsapp/calls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({
  contactId: z.string().uuid(),
  sdpOffer: z.string().min(10).max(200_000),
});

/** Place a business-initiated WhatsApp call (browser supplies the SDP offer). */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const res = await initiateOutboundCall(parsed.data.contactId, parsed.data.sdpOffer, user.id);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: res.status });
  return NextResponse.json({ callId: res.callId });
}
