import { eq, sql } from "drizzle-orm";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { db } from "@/lib/db";
import { activities, contacts, prospects, whatsappMessages } from "@/lib/db/schema";
import { clip } from "./decode";
import { type MediaKind, sendMedia, sendTemplate, sendText, uploadMedia } from "./graph";
import { getOrCreateWaContact } from "./inbound";
import { bareMime, extForMime, saveOutboundMedia } from "./media";

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

// --- Media send ------------------------------------------------------------

/** Meta's per-kind size caps (bytes) and which of our types map to each kind. */
const MEDIA_LIMITS: Record<MediaKind, number> = {
  image: 5 * 1024 * 1024,
  video: 16 * 1024 * 1024,
  audio: 16 * 1024 * 1024,
  document: 100 * 1024 * 1024,
};

export function kindForMime(mime: string): MediaKind {
  const m = bareMime(mime);
  if (m.startsWith("image/")) return "image";
  if (m.startsWith("video/")) return "video";
  if (m.startsWith("audio/")) return "audio";
  return "document";
}

/**
 * Human (agent) media send: validate → save our own copy to GCS (so the inbox
 * can render + re-send it) → upload to Meta → send by id → persist as sent/failed.
 * Idempotency-keyed like text sends.
 */
export async function sendHumanMedia(input: {
  contactId: string;
  userId: string;
  bytes: Buffer;
  mime: string;
  filename: string;
  caption?: string;
  voice?: boolean;
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
    return { ok: false, status: 400, error: "The 24-hour window is closed — you can't send media until the customer messages again." };
  }

  const mime = bareMime(input.mime);
  const kind = kindForMime(mime);
  if (input.bytes.length > MEDIA_LIMITS[kind]) {
    return { ok: false, status: 400, error: `${kind} is too large (max ${Math.round(MEDIA_LIMITS[kind] / (1024 * 1024))} MB).` };
  }

  // Idempotent claim.
  const now = new Date();
  const type = kind; // wa_message_type has image/video/audio/document
  const inserted = await db
    .insert(whatsappMessages)
    .values({
      contactId: input.contactId,
      direction: "outbound",
      type,
      status: "queued",
      body: input.caption ?? null,
      payload: { [kind]: { voice: input.voice ?? false } },
      mediaMime: mime,
      mediaSizeBytes: input.bytes.length,
      mediaFilename: kind === "document" ? input.filename : null,
      idempotencyKey: input.idempotencyKey,
      sentByUserId: input.userId,
      occurredAt: now,
    })
    .onConflictDoNothing({ target: whatsappMessages.idempotencyKey })
    .returning(FIELDS);

  let row = inserted[0] as MessageRow | undefined;
  if (!row) {
    const [existing] = await db
      .select(FIELDS).from(whatsappMessages)
      .where(eq(whatsappMessages.idempotencyKey, input.idempotencyKey)).limit(1);
    return existing ? { ok: true, message: existing as MessageRow } : { ok: false, status: 500, error: "Duplicate request" };
  }

  // Save our own copy so the bubble can render it immediately.
  const key = await saveOutboundMedia(row.id, input.bytes, mime).catch(() => null);
  if (key) {
    await db.update(whatsappMessages)
      .set({ mediaKey: key, updatedAt: new Date() })
      .where(eq(whatsappMessages.id, row.id));
  }

  // Upload to Meta, then send by id.
  const up = await uploadMedia(input.bytes, mime, input.filename || `file.${extForMime(mime)}`);
  const sent = "id" in up
    ? await sendMedia(contact.waId, kind, up.id, {
        caption: input.caption,
        filename: kind === "document" ? input.filename : undefined,
        voice: input.voice,
      })
    : { error: up.error };

  if ("id" in sent) {
    const [updated] = await db
      .update(whatsappMessages)
      .set({
        status: "sent",
        providerMessageId: sent.id,
        sentAt: new Date(),
        ...(key ? { mediaKey: key } : {}),
        updatedAt: new Date(),
      })
      .where(eq(whatsappMessages.id, row.id))
      .returning(FIELDS);
    row = (updated as MessageRow | undefined) ?? row;

    const preview = kind === "document" ? `[document: ${input.filename}]` : `[${kind}]`;
    await db.insert(activities).values({
      contactId: input.contactId, type: "whatsapp_outbound", direction: "outbound",
      channel: "whatsapp", body: input.caption ?? preview, actorType: "user",
      actorId: input.userId, meta: { messageId: row.id }, occurredAt: now,
    });
    await db.update(contacts)
      .set({
        waLastMessageAt: now,
        waLastMessagePreview: clip(`You: ${input.caption || preview}`),
        waLastOutboundAt: now, waAwaitingReply: false, lastActivityAt: now, updatedAt: now,
      })
      .where(eq(contacts.id, input.contactId));
    return { ok: true, message: row };
  }

  const [failed] = await db
    .update(whatsappMessages)
    .set({
      status: "failed", failedAt: new Date(),
      errorCode: sent.error.code != null ? String(sent.error.code) : null,
      errorTitle: sent.error.title ?? sent.error.message ?? "Send failed",
      errorDetails: sent.error as object, updatedAt: new Date(),
    })
    .where(eq(whatsappMessages.id, row.id))
    .returning(FIELDS);
  return { ok: true, message: ((failed as MessageRow | undefined) ?? row) };
}

// --- Template send ---------------------------------------------------------

/**
 * Human (agent) template send: approved templates are the one message Meta
 * allows OUTSIDE the 24h service window, so there is deliberately no window
 * check here. Targets either an existing contact or a prospect — the prospect
 * path finds/creates the CRM contact for its number and links it back.
 * Idempotency-keyed like text sends.
 */
export async function sendHumanTemplate(input: {
  contactId?: string;
  prospectId?: string;
  templateName: string;
  language: string;
  bodyParams?: string[];
  /** The fully substituted body text — stored/previewed, never sent to Meta. */
  bodyText: string;
  userId: string;
  idempotencyKey: string;
}): Promise<SendOutcome> {
  if (Boolean(input.contactId) === Boolean(input.prospectId)) {
    return { ok: false, status: 400, error: "Exactly one of contactId or prospectId is required" };
  }

  let contactId: string;
  let waId: string;
  let prospectId: string | null = null;

  if (input.prospectId) {
    const [prospect] = await db
      .select({
        id: prospects.id,
        name: prospects.name,
        phone: prospects.phone,
        whatsapp: prospects.whatsapp,
        countryCode: prospects.countryCode,
      })
      .from(prospects)
      .where(eq(prospects.id, input.prospectId))
      .limit(1);
    if (!prospect) return { ok: false, status: 404, error: "Prospect not found" };

    // Prefer the scraped WhatsApp number (already full international digits
    // from wa.me links); otherwise PARSE the listing phone against the
    // prospect's country. Raw digit-stripping is not enough: a national-format
    // number ("0310 0577770") would target a completely different wa_id.
    const scraped = (prospect.whatsapp ?? "").replace(/\D/g, "");
    let digits = scraped.length >= 8 ? scraped : null;
    if (!digits && prospect.phone) {
      const parsed = parsePhoneNumberFromString(
        prospect.phone,
        prospect.countryCode as CountryCode,
      );
      if (parsed?.isValid()) digits = parsed.number.slice(1); // E.164 minus "+"
    }
    if (!digits) {
      return { ok: false, status: 400, error: "Prospect has no usable phone number" };
    }
    const contact = await getOrCreateWaContact(digits, prospect.name, {
      inbound: false,
      source: "prospecting",
    });
    if (contact.blocked) return { ok: false, status: 400, error: "Contact is blocked" };
    contactId = contact.id;
    waId = digits;
    prospectId = prospect.id;

    // Link the thread immediately (not only on Meta success) so a failed
    // first touch is never orphaned from its prospect.
    await db
      .update(prospects)
      .set({ contactId, updatedAt: new Date() })
      .where(eq(prospects.id, prospect.id));
  } else {
    const [contact] = await db
      .select({ waId: contacts.waId, blockedAt: contacts.waBlockedAt })
      .from(contacts)
      .where(eq(contacts.id, input.contactId!))
      .limit(1);
    if (!contact) return { ok: false, status: 404, error: "Contact not found" };
    if (!contact.waId) return { ok: false, status: 400, error: "Contact has no WhatsApp thread" };
    if (contact.blockedAt) return { ok: false, status: 400, error: "Contact is blocked" };
    contactId = input.contactId!;
    waId = contact.waId;
  }

  const now = new Date();
  const inserted = await db
    .insert(whatsappMessages)
    .values({
      contactId,
      direction: "outbound",
      type: "template",
      status: "queued",
      body: input.bodyText,
      payload: {
        template: {
          name: input.templateName,
          language: input.language,
          bodyParams: input.bodyParams ?? [],
        },
      },
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

  const sent = await sendTemplate(waId, input.templateName, input.language, {
    bodyParams: input.bodyParams,
  });

  if ("id" in sent) {
    const [updated] = await db
      .update(whatsappMessages)
      .set({ status: "sent", providerMessageId: sent.id, sentAt: new Date(), updatedAt: new Date() })
      .where(eq(whatsappMessages.id, row.id))
      .returning(FIELDS);
    row = (updated as MessageRow | undefined) ?? row;

    await db.insert(activities).values({
      contactId,
      type: "whatsapp_outbound",
      direction: "outbound",
      channel: "whatsapp",
      body: input.bodyText,
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
        waLastMessagePreview: clip(`You: ${input.bodyText}`),
        waLastOutboundAt: now,
        waAwaitingReply: false,
        lastActivityAt: now,
        updatedAt: now,
      })
      .where(eq(contacts.id, contactId));

    // Prospect path: link the contact and track outreach volume.
    if (prospectId) {
      await db
        .update(prospects)
        .set({
          contactId,
          lastTemplateSentAt: now,
          templateSendCount: sql`${prospects.templateSendCount} + 1`,
          updatedAt: now,
        })
        .where(eq(prospects.id, prospectId));
    }

    return { ok: true, message: row };
  }

  const [failedTpl] = await db
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
  return { ok: true, message: ((failedTpl as MessageRow | undefined) ?? row) };
}
