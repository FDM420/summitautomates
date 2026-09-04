import { and, desc, eq, isNotNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { contacts, whatsappMessages } from "@/lib/db/schema";
import { markRead } from "@/lib/whatsapp/graph";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Mark a thread read: zero our unread count, then blue-tick the newest inbound on Meta. */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  await db
    .update(contacts)
    .set({ waUnreadCount: 0, updatedAt: new Date() })
    .where(eq(contacts.id, id));

  const [newest] = await db
    .select({ wamid: whatsappMessages.providerMessageId })
    .from(whatsappMessages)
    .where(
      and(
        eq(whatsappMessages.contactId, id),
        eq(whatsappMessages.direction, "inbound"),
        isNotNull(whatsappMessages.providerMessageId),
      ),
    )
    .orderBy(desc(whatsappMessages.occurredAt))
    .limit(1);

  if (newest?.wamid) await markRead(newest.wamid); // fire-and-forget semantics
  return NextResponse.json({ ok: true });
}
