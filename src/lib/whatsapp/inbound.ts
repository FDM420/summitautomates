import { and, eq, sql } from "drizzle-orm";
import { normalizePhone } from "@/lib/crm/phone";
import { db } from "@/lib/db";
import {
  activities,
  contacts,
  identities,
  leads,
  whatsappMessages,
} from "@/lib/db/schema";
import type { DecodedInbound } from "./decode";
import { bareMime } from "./media";

const WINDOW_MS = 24 * 60 * 60 * 1000;
const PREVIEW_MAX = 140;

function clip(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > PREVIEW_MAX ? `${t.slice(0, PREVIEW_MAX - 1)}…` : t;
}

/**
 * Find or create the contact for a WhatsApp sender. Keyed on the `identities`
 * unique index (channel=whatsapp, E.164) so concurrent first messages across
 * Cloud Run instances can't create duplicates; also stamps `wa_id` and the
 * latest profile name on the contact.
 */
export async function getOrCreateWaContact(
  waId: string,
  profileName: string | null,
): Promise<{ id: string; blocked: boolean }> {
  const phone = normalizePhone(waId) ?? `+${waId}`;

  return db.transaction(async (tx) => {
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
          waProfileName: profileName,
          source: "whatsapp",
          lastInboundAt: new Date(),
          lastActivityAt: new Date(),
        })
        .returning({ id: contacts.id });

      const linked = await tx
        .insert(identities)
        .values({ channel: "whatsapp", value: phone, contactId: created.id })
        .onConflictDoNothing()
        .returning({ contactId: identities.contactId });

      if (linked[0]) {
        contactId = created.id;
      } else {
        // Lost the race: drop our orphan and reuse the winner.
        await tx.delete(contacts).where(eq(contacts.id, created.id));
        const again = await tx
          .select({ contactId: identities.contactId })
          .from(identities)
          .where(and(eq(identities.channel, "whatsapp"), eq(identities.value, phone)))
          .limit(1);
        contactId = again[0]!.contactId;
      }
    }

    // Keep wa_id / profile name fresh (wa_id may be null for pre-chat contacts).
    const [row] = await tx
      .update(contacts)
      .set({
        waId: sql`coalesce(${contacts.waId}, ${waId})`,
        ...(profileName ? { waProfileName: profileName } : {}),
        updatedAt: new Date(),
      })
      .where(eq(contacts.id, contactId))
      .returning({ blockedAt: contacts.waBlockedAt });

    return { id: contactId, blocked: Boolean(row?.blockedAt) };
  });
}

/**
 * Persist an inbound message. INSERT-FIRST with ON CONFLICT on the wamid so
 * Meta's at-least-once retries are exact no-ops: counters, timeline, and
 * leads are only touched when the row was actually inserted.
 * Returns null when the message was already seen.
 */
export async function recordInboundMessage(
  contactId: string,
  d: DecodedInbound,
): Promise<{ messageId: string } | null> {
  const inserted = await db
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
  await db.insert(activities).values({
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
    await db
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

    // Open a lead if none is open for this contact.
    const open = await db
      .select({ id: leads.id })
      .from(leads)
      .where(and(eq(leads.contactId, contactId), sql`${leads.status} in ('new','qualified')`))
      .limit(1);
    if (!open[0]) {
      await db.insert(leads).values({
        contactId,
        channel: "whatsapp",
        status: "new",
        rawPayload: d.referral ? ({ referral: d.referral } as object) : null,
      });
    }
  }

  return { messageId };
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
  const [row] = await db
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

  await db.insert(activities).values({
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
  await db
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
}

const RANK: Record<string, number> = { queued: 0, sending: 1, sent: 2, delivered: 3, read: 4 };

/**
 * Apply a Meta status callback (sent/delivered/read/failed) to an outbound
 * message. Guards against regressions (a late `delivered` must not undo `read`)
 * but always stamps the timestamp column. Unknown wamids are dropped.
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

  const [row] = await db
    .select({ id: whatsappMessages.id, status: whatsappMessages.status })
    .from(whatsappMessages)
    .where(eq(whatsappMessages.providerMessageId, st.id))
    .limit(1);
  if (!row) return;

  const patch: Partial<typeof whatsappMessages.$inferInsert> = { updatedAt: new Date() };
  const incoming = st.status;

  if (incoming === "failed") {
    const e = st.errors?.[0];
    patch.status = "failed";
    patch.failedAt = at;
    patch.errorCode = e?.code != null ? String(e.code) : null;
    patch.errorTitle = e?.title ?? e?.message ?? null;
    patch.errorDetails = (e as object) ?? null;
  } else if (incoming in RANK) {
    if (incoming === "sent") patch.sentAt = at;
    if (incoming === "delivered") patch.deliveredAt = at;
    if (incoming === "read") patch.readAt = at;
    // Only move the status forward; never regress, never leave `failed`.
    if (row.status !== "failed" && (RANK[incoming] ?? 0) > (RANK[row.status] ?? 0)) {
      patch.status = incoming as typeof row.status;
    }
  } else {
    return;
  }

  await db.update(whatsappMessages).set(patch).where(eq(whatsappMessages.id, row.id));
}
