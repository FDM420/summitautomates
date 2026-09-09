import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { whatsappCalls } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Offer + status for the CallDock to set up its RTCPeerConnection. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [call] = await db
    .select({
      id: whatsappCalls.id,
      status: whatsappCalls.status,
      direction: whatsappCalls.direction,
      contactId: whatsappCalls.contactId,
      sdpOffer: whatsappCalls.sdpOffer,
    })
    .from(whatsappCalls)
    .where(eq(whatsappCalls.id, id))
    .limit(1);
  if (!call) return NextResponse.json({ error: "Call not found" }, { status: 404 });
  return NextResponse.json({ call });
}
