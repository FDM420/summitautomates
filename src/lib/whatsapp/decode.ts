/**
 * Decode a raw Meta webhook message into a normalized inbound record.
 * Pure function — no I/O. Every known type maps to our `wa_message_type`
 * enum; anything else lands as `unsupported` with the whole message kept.
 */
export type WaType =
  | "text"
  | "image"
  | "video"
  | "audio"
  | "document"
  | "sticker"
  | "location"
  | "contacts"
  | "interactive"
  | "template"
  | "reaction"
  | "system"
  | "unsupported";

export type DecodedInbound = {
  providerMessageId: string;
  waId: string; // digits, no "+"
  profileName: string | null;
  occurredAt: Date;
  type: WaType;
  body: string | null;
  payload: unknown;
  mediaId: string | null;
  mediaMime: string | null;
  mediaFilename: string | null;
  mediaSha256: string | null;
  replyToProviderId: string | null;
  reactionToProviderId: string | null;
  isForwarded: boolean;
  /** 140-char preview or a type token, for the inbox list. */
  preview: string;
  /** Reactions and system notices don't bump unread / window / awaiting. */
  countsAsMessage: boolean;
  referral: unknown | null;
};

// Loose typing for the slice of Meta's payload we read.
export type RawMessage = {
  id: string;
  from?: string;
  timestamp?: string | number;
  type?: string;
  context?: {
    id?: string;
    forwarded?: boolean;
    frequently_forwarded?: boolean;
    referred_product?: unknown;
  };
  referral?: unknown;
  text?: { body?: string };
  image?: MediaObj & { caption?: string };
  video?: MediaObj & { caption?: string };
  audio?: MediaObj & { voice?: boolean };
  document?: MediaObj & { caption?: string; filename?: string };
  sticker?: MediaObj & { animated?: boolean };
  location?: { latitude?: number; longitude?: number; name?: string; address?: string; url?: string };
  contacts?: unknown[];
  interactive?: {
    type?: string;
    button_reply?: { id?: string; title?: string };
    list_reply?: { id?: string; title?: string; description?: string };
  };
  reaction?: { message_id?: string; emoji?: string };
  system?: { body?: string; type?: string; wa_id?: string; new_wa_id?: string };
  errors?: { code?: number; title?: string }[];
};

type MediaObj = { id?: string; mime_type?: string; sha256?: string };

const PREVIEW_MAX = 140;

/** Clip by code points so we never split a surrogate pair (emoji). */
export function clip(s: string): string {
  const t = s.replace(/\s+/g, " ").trim();
  const cps = [...t];
  return cps.length > PREVIEW_MAX ? `${cps.slice(0, PREVIEW_MAX - 1).join("")}…` : t;
}

export function decodeInbound(
  msg: RawMessage,
  nameByWaId: Map<string, string>,
): DecodedInbound | null {
  if (!msg?.id || !msg.from) return null;

  const waId = String(msg.from).replace(/\D/g, "");
  const tsNum = Number(msg.timestamp);
  const occurredAt = Number.isFinite(tsNum) && tsNum > 0 ? new Date(tsNum * 1000) : new Date();
  const ctx = msg.context ?? {};

  // Attribution (click-to-WhatsApp ads, referred products) rides along on
  // every type so it is never lost even when a lead is already open.
  const extra = {
    ...(msg.referral ? { referral: msg.referral } : {}),
    ...(msg.context ? { context: msg.context } : {}),
  };

  const base = {
    providerMessageId: msg.id,
    waId,
    profileName: nameByWaId.get(waId) ?? null,
    occurredAt,
    mediaId: null as string | null,
    mediaMime: null as string | null,
    mediaFilename: null as string | null,
    mediaSha256: null as string | null,
    replyToProviderId: ctx.id ?? null,
    reactionToProviderId: null as string | null,
    isForwarded: Boolean(ctx.forwarded || ctx.frequently_forwarded),
    countsAsMessage: true,
    referral: msg.referral ?? null,
  };

  const media = (obj: MediaObj | undefined) => ({
    mediaId: obj?.id ?? null,
    mediaMime: obj?.mime_type ?? null,
    mediaSha256: obj?.sha256 ?? null,
  });

  const decoded = ((): DecodedInbound => {
    switch (msg.type) {
      case "text": {
        const body = msg.text?.body ?? "";
        return { ...base, type: "text", body, payload: { text: msg.text }, preview: clip(body) };
      }
      case "image":
        return {
          ...base,
          ...media(msg.image),
          type: "image",
          body: msg.image?.caption ?? null,
          payload: { image: msg.image },
          preview: msg.image?.caption ? `📷 ${clip(msg.image.caption)}` : "[image]",
        };
      case "video":
        return {
          ...base,
          ...media(msg.video),
          type: "video",
          body: msg.video?.caption ?? null,
          payload: { video: msg.video },
          preview: msg.video?.caption ? `🎥 ${clip(msg.video.caption)}` : "[video]",
        };
      case "audio":
        return {
          ...base,
          ...media(msg.audio),
          type: "audio",
          body: null, // transcript may be filled in later
          payload: { audio: msg.audio },
          preview: msg.audio?.voice ? "[voice message]" : "[audio]",
        };
      case "document":
        return {
          ...base,
          ...media(msg.document),
          type: "document",
          body: msg.document?.caption ?? null,
          mediaFilename: msg.document?.filename ?? null,
          payload: { document: msg.document },
          preview: `[document: ${clip(msg.document?.filename ?? "file")}]`,
        };
      case "sticker":
        return {
          ...base,
          ...media(msg.sticker),
          type: "sticker",
          body: null,
          payload: { sticker: msg.sticker },
          preview: "[sticker]",
        };
      case "location":
        return {
          ...base,
          type: "location",
          body: msg.location?.name ?? msg.location?.address ?? null,
          payload: { location: msg.location },
          preview: "[location]",
        };
      case "contacts":
        return {
          ...base,
          type: "contacts",
          body: null,
          payload: { contacts: msg.contacts },
          preview: "[contact card]",
        };
      case "interactive": {
        const title =
          msg.interactive?.button_reply?.title ?? msg.interactive?.list_reply?.title ?? null;
        return {
          ...base,
          type: "interactive",
          body: title,
          payload: { interactive: msg.interactive },
          preview: title ? `↳ ${clip(title)}` : "[interactive]",
        };
      }
      case "reaction": {
        const emoji = msg.reaction?.emoji ?? "";
        return {
          ...base,
          type: "reaction",
          body: emoji,
          payload: { reaction: msg.reaction },
          reactionToProviderId: msg.reaction?.message_id ?? null,
          replyToProviderId: null,
          preview: emoji ? `[reaction ${emoji}]` : "[reaction removed]",
          countsAsMessage: false,
        };
      }
      case "system": {
        // e.g. "user changed number" notices — not a customer message.
        const body = msg.system?.body ?? null;
        return {
          ...base,
          type: "system",
          body,
          payload: { system: msg.system },
          replyToProviderId: null,
          preview: body ? clip(body) : "[system]",
          countsAsMessage: false,
        };
      }
      default:
        // button, order, unsupported (131051), and future types.
        return {
          ...base,
          type: "unsupported",
          body: null,
          payload: msg,
          preview: "[unsupported]",
        };
    }
  })();

  return { ...decoded, payload: { ...(decoded.payload as object), ...extra } };
}

/** Build wa_id → profile name from `value.contacts[]`. */
export function nameMapFrom(
  contacts: { wa_id?: string; profile?: { name?: string } }[] | undefined,
): Map<string, string> {
  const m = new Map<string, string>();
  for (const c of contacts ?? []) {
    if (c.wa_id && c.profile?.name) m.set(String(c.wa_id).replace(/\D/g, ""), c.profile.name);
  }
  return m;
}
