import { and, asc, desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { whatsappMessages } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Messages for one contact, always returned ASCENDING.
 *   default                          → newest `limit` messages
 *   ?before=<iso>&beforeCreated=<iso> → older page (keyset on the pair)
 *   ?after=<iso>&afterCreated=<iso>   → tail fetch
 * Meta timestamps are whole seconds, so `occurred_at` alone can't order or
 * page reliably; `created_at` (webhook insert order) is the deterministic
 * tiebreak, with `id` as a final stable key.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const url = new URL(request.url);
  const limit = Math.max(1, Math.min(Math.trunc(Number(url.searchParams.get("limit"))) || 50, 200));
  const before = parseIso(url.searchParams.get("before"));
  const beforeCreated = parseIso(url.searchParams.get("beforeCreated"));
  const after = parseIso(url.searchParams.get("after"));
  const afterCreated = parseIso(url.searchParams.get("afterCreated"));

  const conds = [eq(whatsappMessages.contactId, id)];
  if (before) {
    conds.push(
      beforeCreated
        ? sql`(${whatsappMessages.occurredAt}, ${whatsappMessages.createdAt}) < (${before}::timestamptz, ${beforeCreated}::timestamptz)`
        : sql`${whatsappMessages.occurredAt} < ${before}::timestamptz`,
    );
  }
  if (after) {
    conds.push(
      afterCreated
        ? sql`(${whatsappMessages.occurredAt}, ${whatsappMessages.createdAt}) > (${after}::timestamptz, ${afterCreated}::timestamptz)`
        : sql`${whatsappMessages.occurredAt} > ${after}::timestamptz`,
    );
  }

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
    createdAt: whatsappMessages.createdAt,
  };

  const rows = after
    ? await db.select(fields).from(whatsappMessages).where(and(...conds))
        .orderBy(asc(whatsappMessages.occurredAt), asc(whatsappMessages.createdAt), asc(whatsappMessages.id))
        .limit(limit)
    : (
        await db.select(fields).from(whatsappMessages).where(and(...conds))
          .orderBy(desc(whatsappMessages.occurredAt), desc(whatsappMessages.createdAt), desc(whatsappMessages.id))
          .limit(limit)
      ).reverse();

  return NextResponse.json({ messages: rows, hasMore: !after && rows.length === limit });
}

function parseIso(v: string | null): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
