import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getActiveCalls } from "@/lib/whatsapp/calls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The CallDock's poll (~2.5s while mounted): sweeps stale calls, then returns
 * the row the dock is tracking (`?watch=`) in any status — how the dock learns
 * the caller hung up / the customer answered — plus the newest ringing inbound
 * call for a fresh ring card.
 */
export async function GET(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const watch = new URL(request.url).searchParams.get("watch");
  const result = await getActiveCalls(watch);
  return NextResponse.json(result);
}
