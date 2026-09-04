import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { activities, contacts, whatsappMessages } from "@/lib/db/schema";
import { clip } from "./decode";
import { sendText } from "./graph";

/**
 * Human (agent) text send: insert a queued row keyed by the client's
 * idempotency key, call the Graph API, then stamp sent/failed. A replayed
 * request (double-click, retry) returns the existing row untouched. The wamid
 * is written synchronously so status callbacks can always find the row.
 */

const FIELDS = {
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

type MessageRow = {
  id: string;
  status: string;
  [k: string]: unknown;
};

export type SendOutcome =
  | { ok: true; message: MessageRow }
  | { ok: false; status: number; error: string };

export async function sendHumanText(input: {
  contactId: string;
  userId: string;
  body: string;
  replyToProviderId?: string | null;
  idempotencyKey: string;
}): Promise<SendOutcome> {
  const [contact] = await db
    .select({
      waId: contacts.waId,
      windowExpiresAt: contacts.waWindowExpiresAt,
      blockedAt: contacts.waBlockedAt,
    })
    .from(contacts)
    .where(eq(contacts.id, input.contactId))
    .limit(1);

  if (!contact) return { ok: false, status: 404, error: "Contact not found" };
  if (!contact.waId) return { ok: false, status: 400, error: "Contact has no WhatsApp thread" };
  if (contact.blockedAt) return { ok: false, status: 400, error: "Contact is blocked" };
  const windowOpen = contact.windowExpiresAt && contact.windowExpiresAt.getTime() > Date.now();
  if (!windowOpen) {
    return {
      ok: false,
      status: 400,
      error:
        "The 24-hour window is closed — WhatsApp only allows free-form replies within 24h of the customer's last message. It reopens when they message you.",
    };
  }

  const now = new Date();
  const inserted = await db
    .insert(whatsappMessages)
    .values({
      contactId: input.contactId,
      direction: "outbound",
      type: "text",
      status: "queued",
      body: input.body,
      payload: { text: { body: input.body } },
      replyToProviderId: input.replyToProviderId ?? null,
      idempotencyKey: input.idempotencyKey,
      sentByUserId: input.userId,
      occurredAt: now,
    })
    .onConflictDoNothing({ target: whatsappMessages.idempotencyKey })
    .returning(FIELDS);

  let row = inserted[0] as MessageRow | undefined;
  if (!row) {
    // Idempotent replay — hand back whatever the first attempt produced.
    const [existing] = await db
      .select(FIELDS)
      .from(whatsappMessages)
      .where(eq(whatsappMessages.idempotencyKey, input.idempotencyKey))
      .limit(1);
    return existing
      ? { ok: true, message: existing as MessageRow }
      : { ok: false, status: 500, error: "Duplicate request" };
  }

  const sent = await sendText(contact.waId, input.body, {
    replyToProviderId: input.replyToProviderId ?? undefined,
  });

  if ("id" in sent) {
    const [updated] = await db
      .update(whatsappMessages)
      .set({ status: "sent", providerMessageId: sent.id, sentAt: new Date(), updatedAt: new Date() })
      .where(eq(whatsappMessages.id, row.id))
      .returning(FIELDS);
    row = (updated as MessageRow | undefined) ?? row;

    await db.insert(activities).values({
      contactId: input.contactId,
      type: "whatsapp_outbound",
      direction: "outbound",
      channel: "whatsapp",
      body: input.body,
      actorType: "user",
      actorId: input.userId,
      meta: { messageId: row.id },
      occurredAt: now,
    });

    // Human send: bump preview, clear awaiting-reply. Never touches unread.
    await db
      .update(contacts)
      .set({
        waLastMessageAt: now,
        waLastMessagePreview: clip(`You: ${input.body}`),
        waLastOutboundAt: now,
        waAwaitingReply: false,
        lastActivityAt: now,
        updatedAt: now,
      })
      .where(eq(contacts.id, input.contactId));

    return { ok: true, message: row };
  }

  const [failed] = await db
    .update(whatsappMessages)
    .set({
      status: "failed",
      failedAt: new Date(),
      errorCode: sent.error.code != null ? String(sent.error.code) : null,
      errorTitle: sent.error.title ?? sent.error.message ?? "Send failed",
      errorDetails: sent.error as object,
      updatedAt: new Date(),
    })
    .where(eq(whatsappMessages.id, row.id))
    .returning(FIELDS);
  return { ok: true, message: ((failed as MessageRow | undefined) ?? row) };
}
