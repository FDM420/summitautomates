import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { whatsappMessages } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Messages for one contact, always returned ASCENDING by occurred_at.
 *   default          → newest `limit` messages
 *   ?before=<iso>    → older page (for scroll-up)
 *   ?after=<iso>     → tail fetch (for polling)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50) || 50, 200);
  const before = parseIso(url.searchParams.get("before"));
  const after = parseIso(url.searchParams.get("after"));

  const conds = [eq(whatsappMessages.contactId, id)];
  if (before) conds.push(lt(whatsappMessages.occurredAt, before));
  if (after) conds.push(gt(whatsappMessages.occurredAt, after));

  const fields = {
    id: whatsappMessages.id,
    direction: whatsappMessages.direction,
    type: whatsappMessages.type,
    status: whatsappMessages.status,
    body: whatsappMessages.body,
    payload: whatsappMessages.payload,
    mediaKey: whatsappMessages.mediaKey,
    mediaMime: whatsappMessages.mediaMime,
    mediaFilename: whatsappMessages.mediaFilename,
    mediaSizeBytes: whatsappMessages.mediaSizeBytes,
    replyToProviderId: whatsappMessages.replyToProviderId,
    reactionToProviderId: whatsappMessages.reactionToProviderId,
    isForwarded: whatsappMessages.isForwarded,
    providerMessageId: whatsappMessages.providerMessageId,
    errorTitle: whatsappMessages.errorTitle,
    sentAt: whatsappMessages.sentAt,
    deliveredAt: whatsappMessages.deliveredAt,
    readAt: whatsappMessages.readAt,
    occurredAt: whatsappMessages.occurredAt,
  };

  // `after` pages forward (ascending); everything else pages backward from the
  // newest and is reversed so the client always gets ascending order.
  const rows = after
    ? await db.select(fields).from(whatsappMessages).where(and(...conds))
        .orderBy(asc(whatsappMessages.occurredAt), asc(whatsappMessages.id)).limit(limit)
    : (
        await db.select(fields).from(whatsappMessages).where(and(...conds))
          .orderBy(desc(whatsappMessages.occurredAt), desc(whatsappMessages.id)).limit(limit)
      ).reverse();

  return NextResponse.json({ messages: rows, hasMore: !after && rows.length === limit });
}

function parseIso(v: string | null): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
