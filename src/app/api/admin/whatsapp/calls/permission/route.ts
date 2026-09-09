import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { requestCallPermission } from "@/lib/whatsapp/calls";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const schema = z.object({ contactId: z.string().uuid() });

/** Send the customer Meta's call-permission opt-in (open 24h window required). */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const res = await requestCallPermission(parsed.data.contactId, user.id);
  if (!res.ok) return NextResponse.json({ error: res.error }, { status: res.status });
  return NextResponse.json({ ok: true });
}
