import { and, desc, eq, inArray, ne, sql } from "drizzle-orm";
import type { ChatMessage } from "@/lib/assistant/reply";
import { normalizePhone } from "@/lib/crm/phone";
import { db } from "@/lib/db";
import {
  activities,
  contacts,
  identities,
  leads,
  whatsappMessages,
} from "@/lib/db/schema";
import { clip, type DecodedInbound } from "./decode";
import { bareMime } from "./media";

const WINDOW_MS = 24 * 60 * 60 * 1000;

/** Thrown for infrastructure failures BEFORE the message row exists, so the
 * webhook can answer non-200 and let Meta retry (dedupe makes that safe). */
export class RetryableInboundError extends Error {
  retryable = true as const;
  constructor(cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause));
    this.name = "RetryableInboundError";
  }
}

/**
 * Find or create the contact for a WhatsApp sender.
 * Serialized per wa_id with a transaction-scoped advisory lock so concurrent
 * first messages across Cloud Run instances queue instead of colliding on the
 * unique indexes; the inserts are conflict-safe as belt-and-braces.
 */
export async function getOrCreateWaContact(
  waId: string,
  profileName: string | null,
  opts?: {
    /**
     * false for business-initiated (outreach) resolution: the name is only a
     * creation fallback — an existing contact's WhatsApp profile name is never
     * overwritten, and no inbound timestamp is faked.
     */
    inbound?: boolean;
    /** Contact `source` when this call creates the contact (default whatsapp). */
    source?: string;
  },
): Promise<{ id: string; blocked: boolean; autopilot: boolean }> {
  const phone = normalizePhone(waId) ?? `+${waId}`;
  const inbound = opts?.inbound !== false;

  try {
    return await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${`wa:${waId}`}))`);

      let contactId: string | undefined;

      const viaIdentity = await tx
        .select({ contactId: identities.contactId })
        .from(identities)
        .where(and(eq(identities.channel, "whatsapp"), eq(identities.value, phone)))
        .limit(1);
      contactId = viaIdentity[0]?.contactId;

      if (!contactId) {
        const viaWaId = await tx
          .select({ id: contacts.id })
          .from(contacts)
          .where(eq(contacts.waId, waId))
          .limit(1);
        contactId = viaWaId[0]?.id;
      }

      if (!contactId) {
        const [created] = await tx
          .insert(contacts)
          .values({
            displayName: profileName ?? phone,
            phone,
            waId,
            waProfileName: inbound ? profileName : null,
            source: opts?.source ?? "whatsapp",
            lastInboundAt: inbound ? new Date() : null,
            lastActivityAt: new Date(),
          })
          .onConflictDoNothing({ target: contacts.waId })
          .returning({ id: contacts.id });

        if (created) {
          contactId = created.id;
          await tx
            .insert(identities)
            .values({ channel: "whatsapp", value: phone, contactId })
            .onConflictDoNothing();
        } else {
          const [winner] = await tx
            .select({ id: contacts.id })
            .from(contacts)
            .where(eq(contacts.waId, waId))
            .limit(1);
          contactId = winner!.id;
        }
      }

      // Keep wa_id / profile name fresh (wa_id may be null for pre-chat contacts).
      const [row] = await tx
        .update(contacts)
        .set({
          waId: sql`coalesce(${contacts.waId}, ${waId})`,
          ...(profileName && inbound ? { waProfileName: profileName } : {}),
          updatedAt: new Date(),
        })
        .where(eq(contacts.id, contactId))
        .returning({ blockedAt: contacts.waBlockedAt, autopilot: contacts.waAutopilot });

      return {
        id: contactId,
        blocked: Boolean(row?.blockedAt),
        autopilot: row?.autopilot ?? true,
      };
    });
  } catch (error) {
    throw new RetryableInboundError(error);
  }
}

/**
 * The last `limit` conversation turns for a contact as assistant ChatMessages
 * (inbound → user, outbound → assistant), oldest-first. Only text turns with a
 * body are included, so the model sees a clean transcript. Powers the bot's
 * memory.
 */
export async function getRecentHistory(
  contactId: string,
  limit = 14,
): Promise<ChatMessage[]> {
  const rows = await db
    .select({
      direction: whatsappMessages.direction,
      body: whatsappMessages.body,
      occurredAt: whatsappMessages.occurredAt,
    })
    .from(whatsappMessages)
    .where(
      and(
        eq(whatsappMessages.contactId, contactId),
        inArray(whatsappMessages.type, ["text", "template"]),
        // A failed send never reached the customer — don't feed it back to the
        // model as if it were part of the conversation.
        ne(whatsappMessages.status, "failed"),
      ),
    )
    // occurredAt is second-granular for inbound (Meta) vs ms for outbound;
    // createdAt (monotonic server insert time) breaks ties so the transcript
    // keeps true send order and the last turn stays the customer's.
    .orderBy(desc(whatsappMessages.occurredAt), desc(whatsappMessages.createdAt))
    .limit(limit);

  return rows
    .reverse()
    .filter((r) => r.body?.trim())
    .map((r) => ({
      role: r.direction === "inbound" ? ("user" as const) : ("assistant" as const),
      content: r.body as string,
    }));
}

/** Cheap current read of a thread's autopilot flag (re-checked before a send). */
export async function isAutopilotOn(contactId: string): Promise<boolean> {
  const [row] = await db
    .select({ autopilot: contacts.waAutopilot })
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);
  return row?.autopilot ?? false;
}

/** Turn the AI auto-reply on/off for one thread. Returns the new state. */
export async function setAutopilot(contactId: string, enabled: boolean): Promise<boolean> {
  await db
    .update(contacts)
    .set({ waAutopilot: enabled, updatedAt: new Date() })
    .where(eq(contacts.id, contactId));
  return enabled;
}

/**
 * Persist an inbound message atomically. INSERT-FIRST with ON CONFLICT on the
 * wamid so Meta's at-least-once retries are exact no-ops: counters, timeline,
 * and leads only change when the row was actually inserted, and all of it
 * commits or rolls back together. Returns null when already seen.
 */
export async function recordInboundMessage(
  contactId: string,
  d: DecodedInbound,
): Promise<{ messageId: string } | null> {
  let result: { messageId: string } | null;
  try {
    result = await db.transaction(async (tx) => {
      const inserted = await tx
        .insert(whatsappMessages)
        .values({
          contactId,
          direction: "inbound",
          type: d.type,
          status: "received",
          body: d.body,
          payload: d.payload as object,
          mediaKey: d.mediaId ? `meta:${d.mediaId}` : null,
          mediaMime: d.mediaMime ? bareMime(d.mediaMime) : null,
          mediaFilename: d.mediaFilename,
          mediaSha256: d.mediaSha256,
          replyToProviderId: d.replyToProviderId,
          reactionToProviderId: d.reactionToProviderId,
          isForwarded: d.isForwarded,
          providerMessageId: d.providerMessageId,
          occurredAt: d.occurredAt,
        })
        .onConflictDoNothing({ target: whatsappMessages.providerMessageId })
        .returning({ id: whatsappMessages.id });

      const messageId = inserted[0]?.id;
      if (!messageId) return null;

      // Timeline row so the existing contact page keeps working.
      await tx.insert(activities).values({
        contactId,
        type: "whatsapp_inbound",
        direction: "inbound",
        channel: "whatsapp",
        body: d.body ?? d.preview,
        actorType: "contact",
        meta: { messageId, type: d.type },
        occurredAt: d.occurredAt,
      });

      if (d.countsAsMessage) {
        await tx
          .update(contacts)
          .set({
            waLastMessageAt: d.occurredAt,
            waLastMessagePreview: d.preview,
            waUnreadCount: sql`${contacts.waUnreadCount} + 1`,
            waAwaitingReply: true,
            waWindowExpiresAt: new Date(d.occurredAt.getTime() + WINDOW_MS),
            lastInboundAt: d.occurredAt,
            lastActivityAt: d.occurredAt,
            updatedAt: new Date(),
          })
          .where(eq(contacts.id, contactId));

        // Open a lead unless one is already open — enforced by the partial
        // unique index leads_open_contact_unique, so no check-then-insert race.
        await tx
          .insert(leads)
          .values({
            contactId,
            channel: "whatsapp",
            status: "new",
            rawPayload: d.referral ? ({ referral: d.referral } as object) : null,
          })
          .onConflictDoNothing();
      }

      return { messageId };
    });
  } catch (error) {
    throw new RetryableInboundError(error);
  }
  return result;
}

/** Persist a message we sent (bot reply or, later, a human agent). */
export async function recordOutboundMessage(input: {
  contactId: string;
  type?: "text";
  body: string;
  providerMessageId: string | null;
  sentByUserId?: string | null;
  replyToProviderId?: string | null;
  status?: "sent" | "failed";
  error?: { code?: number; title?: string; details?: unknown };
}): Promise<string> {
  const now = new Date();
  const failed = input.status === "failed";
  return db.transaction(async (tx) => {
    const [row] = await tx
      .insert(whatsappMessages)
      .values({
        contactId: input.contactId,
        direction: "outbound",
        type: input.type ?? "text",
        status: failed ? "failed" : "sent",
        body: input.body,
        payload: { text: { body: input.body } },
        replyToProviderId: input.replyToProviderId ?? null,
        providerMessageId: input.providerMessageId,
        sentByUserId: input.sentByUserId ?? null,
        errorCode: input.error?.code != null ? String(input.error.code) : null,
        errorTitle: input.error?.title ?? null,
        errorDetails: (input.error?.details as object) ?? null,
        sentAt: failed ? null : now,
        failedAt: failed ? now : null,
        occurredAt: now,
      })
      .returning({ id: whatsappMessages.id });

    await tx.insert(activities).values({
      contactId: input.contactId,
      type: "whatsapp_outbound",
      direction: "outbound",
      channel: "whatsapp",
      body: input.body,
      actorType: input.sentByUserId ? "user" : "system",
      actorId: input.sentByUserId ?? null,
      meta: { messageId: row.id },
      occurredAt: now,
    });

    // Outbound never touches unread. Only a HUMAN send clears awaiting-reply.
    await tx
      .update(contacts)
      .set({
        waLastMessageAt: now,
        waLastMessagePreview: clip(`You: ${input.body}`),
        lastActivityAt: now,
        ...(input.sentByUserId ? { waLastOutboundAt: now, waAwaitingReply: false } : {}),
        updatedAt: now,
      })
      .where(eq(contacts.id, input.contactId));

    return row.id;
  });
}

const RANK: Record<string, number> = { sent: 2, delivered: 3, read: 4 };

/**
 * Apply a Meta status callback (sent/delivered/read/failed) to an outbound
 * message in ONE atomic UPDATE: the rank guard lives inside the statement so
 * concurrent callbacks can't regress `read` → `delivered`. `failed` is
 * terminal. Timestamps are always stamped. Unknown wamids are dropped.
 */
export async function applyStatusUpdate(st: {
  id?: string;
  status?: string;
  timestamp?: string | number;
  errors?: { code?: number; title?: string; message?: string; error_data?: unknown }[];
}): Promise<void> {
  if (!st.id || !st.status) return;
  const tsNum = Number(st.timestamp);
  const at = Number.isFinite(tsNum) && tsNum > 0 ? new Date(tsNum * 1000) : new Date();
  const incoming = st.status;
  const where = eq(whatsappMessages.providerMessageId, st.id);

  if (incoming === "failed") {
    const e = st.errors?.[0];
    await db
      .update(whatsappMessages)
      .set({
        status: "failed",
        failedAt: at,
        errorCode: e?.code != null ? String(e.code) : null,
        errorTitle: e?.title ?? e?.message ?? null,
        errorDetails: (e as object) ?? null,
        updatedAt: new Date(),
      })
      .where(where);
    return;
  }

  const rank = RANK[incoming];
  if (!rank) return; // unknown status value

  const currentRank = sql`case ${whatsappMessages.status}
    when 'queued' then 0 when 'sending' then 1 when 'sent' then 2
    when 'delivered' then 3 when 'read' then 4 else 99 end`;

  await db
    .update(whatsappMessages)
    .set({
      ...(incoming === "sent" ? { sentAt: at } : {}),
      ...(incoming === "delivered" ? { deliveredAt: at } : {}),
      ...(incoming === "read" ? { readAt: at } : {}),
      status: sql`case when (${currentRank}) < ${rank}
        then ${incoming}::wa_message_status else ${whatsappMessages.status} end`,
      updatedAt: new Date(),
    })
    .where(where);
}
