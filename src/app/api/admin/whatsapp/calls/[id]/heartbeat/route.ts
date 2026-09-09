import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { heartbeat } from "@/lib/whatsapp/calls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Liveness ping (~15s) while a call is connected; scoped to the answerer. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await heartbeat(id, user.id);
  return NextResponse.json({ ok: true });
}
