/**
 * Thin WhatsApp Cloud API (Graph) client. Every Meta call in the app goes
 * through here so auth, versioning, timeouts, and error shapes live in one place.
 */
const GRAPH = "https://graph.facebook.com/v21.0";
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
// WABA id is an identifier, not a secret; fall back to the known account so
// template listing works even before the env var lands on a fresh deploy.
const WABA_ID = process.env.WHATSAPP_WABA_ID?.trim() || "2583097728809080";

export type GraphError = { code?: number; title?: string; message?: string };

function authHeaders(): Record<string, string> {
  return { authorization: `Bearer ${TOKEN}` };
}

async function withTimeout<T>(ms: number, fn: (signal: AbortSignal) => Promise<T>) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), ms);
  try {
    return await fn(ac.signal);
  } finally {
    clearTimeout(t);
  }
}

export function graphConfigured(): boolean {
  return Boolean(TOKEN && PHONE_NUMBER_ID);
}

/** Parse Meta's error envelope into a compact shape. */
export async function readGraphError(res: Response): Promise<GraphError> {
  try {
    const j = (await res.json()) as { error?: { code?: number; error_user_title?: string; message?: string } };
    return {
      code: j.error?.code,
      title: j.error?.error_user_title ?? j.error?.message,
      message: j.error?.message,
    };
  } catch {
    return { message: `HTTP ${res.status}` };
  }
}

/** GET /{media_id} → a short-lived CDN URL + metadata (URL expires ~5 min). */
export async function getMediaInfo(mediaId: string): Promise<{
  url: string;
  mime_type: string;
  sha256?: string;
  file_size?: number;
} | null> {
  if (!TOKEN) return null;
  return withTimeout(30_000, async (signal) => {
    const res = await fetch(`${GRAPH}/${mediaId}`, { headers: authHeaders(), signal });
    if (!res.ok) {
      console.error("[graph] getMediaInfo failed:", res.status, await res.text());
      return null;
    }
    return (await res.json()) as { url: string; mime_type: string; sha256?: string; file_size?: number };
  });
}

/** Download media bytes from the CDN URL — the SAME Bearer token is required. */
export async function downloadMedia(url: string): Promise<Buffer | null> {
  if (!TOKEN) return null;
  return withTimeout(60_000, async (signal) => {
    const res = await fetch(url, { headers: authHeaders(), signal });
    if (!res.ok) {
      console.error("[graph] downloadMedia failed:", res.status);
      return null;
    }
    return Buffer.from(await res.arrayBuffer());
  });
}

/** Send a plain-text message. Returns the wamid on success. */
export async function sendText(
  to: string,
  body: string,
  opts?: { replyToProviderId?: string },
): Promise<{ id: string } | { error: GraphError }> {
  if (!graphConfigured()) return { error: { message: "WhatsApp not configured" } };
  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: "text",
    text: { preview_url: false, body: body.slice(0, 4096) },
  };
  if (opts?.replyToProviderId) payload.context = { message_id: opts.replyToProviderId };

  // Total function: timeouts and network failures come back as { error } so
  // the caller always records an outbound row (never an unhandled rejection).
  try {
    return await withTimeout(30_000, async (signal) => {
      const res = await fetch(`${GRAPH}/${PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal,
      });
      if (!res.ok) return { error: await readGraphError(res) };
      const j = (await res.json()) as { messages?: { id: string }[] };
      const id = j.messages?.[0]?.id;
      return id ? { id } : { error: { message: "No message id in response" } };
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { error: { message: aborted ? "Graph timeout (30s)" : String(error) } };
  }
}

export type MediaKind = "image" | "video" | "audio" | "document";

/**
 * Upload bytes to Meta's /media endpoint → media id. Always send by id, never
 * by link (Meta's link fetches get rate-limited). Bare mime only.
 */
export async function uploadMedia(
  bytes: Buffer,
  mime: string,
  filename: string,
): Promise<{ id: string } | { error: GraphError }> {
  if (!graphConfigured()) return { error: { message: "WhatsApp not configured" } };
  try {
    return await withTimeout(60_000, async (signal) => {
      const form = new FormData();
      form.append("messaging_product", "whatsapp");
      form.append("type", mime);
      form.append("file", new Blob([new Uint8Array(bytes)], { type: mime }), filename);
      const res = await fetch(`${GRAPH}/${PHONE_NUMBER_ID}/media`, {
        method: "POST",
        headers: authHeaders(),
        body: form,
        signal,
      });
      if (!res.ok) return { error: await readGraphError(res) };
      const j = (await res.json()) as { id?: string };
      return j.id ? { id: j.id } : { error: { message: "No media id in response" } };
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { error: { message: aborted ? "Upload timeout (60s)" : String(error) } };
  }
}

/** Send a media message by Meta media id. Returns the wamid on success. */
export async function sendMedia(
  to: string,
  kind: MediaKind,
  mediaId: string,
  opts?: {
    caption?: string;
    filename?: string;
    voice?: boolean;
    replyToProviderId?: string;
  },
): Promise<{ id: string } | { error: GraphError }> {
  if (!graphConfigured()) return { error: { message: "WhatsApp not configured" } };
  const media: Record<string, unknown> = { id: mediaId };
  if (opts?.caption && kind !== "audio") media.caption = opts.caption;
  if (opts?.filename && kind === "document") media.filename = opts.filename;
  if (opts?.voice && kind === "audio") media.voice = true;

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to,
    type: kind,
    [kind]: media,
  };
  if (opts?.replyToProviderId) payload.context = { message_id: opts.replyToProviderId };

  try {
    return await withTimeout(30_000, async (signal) => {
      const res = await fetch(`${GRAPH}/${PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify(payload),
        signal,
      });
      if (!res.ok) return { error: await readGraphError(res) };
      const j = (await res.json()) as { messages?: { id: string }[] };
      const id = j.messages?.[0]?.id;
      return id ? { id } : { error: { message: "No message id in response" } };
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { error: { message: aborted ? "Graph timeout (30s)" : String(error) } };
  }
}

// --- Message templates -----------------------------------------------------

export type TemplateButton = { type: string; text?: string; url?: string; phone_number?: string };
export type TemplateComponent = {
  type: string; // HEADER | BODY | FOOTER | BUTTONS
  format?: string; // for HEADER: TEXT | IMAGE | VIDEO | DOCUMENT
  text?: string;
  buttons?: TemplateButton[];
};
export type WaTemplate = {
  id?: string;
  name: string;
  status: string; // APPROVED | PENDING | REJECTED | PAUSED | DISABLED | ...
  category: string; // MARKETING | UTILITY | AUTHENTICATION
  language: string;
  components?: TemplateComponent[];
  rejected_reason?: string;
  quality_score?: { score?: string };
};

/**
 * List every message template on the WABA with its live approval status.
 * Reads straight from Meta's Graph API — approval is a Meta concept, not ours.
 * Follows cursor paging (the `after` cursor only, never the token-bearing
 * `next` URL). Returns all templates or a compact error.
 */
export async function listMessageTemplates(): Promise<
  { templates: WaTemplate[] } | { error: GraphError }
> {
  if (!TOKEN) return { error: { message: "WhatsApp access token not configured" } };
  if (!WABA_ID) return { error: { message: "WHATSAPP_WABA_ID not set" } };
  const fields = "name,status,category,language,components,rejected_reason,quality_score";

  try {
    return await withTimeout(20_000, async (signal) => {
      const all: WaTemplate[] = [];
      let after: string | undefined;
      for (let guard = 0; guard < 20; guard++) {
        const url =
          `${GRAPH}/${WABA_ID}/message_templates?fields=${fields}&limit=200` +
          (after ? `&after=${encodeURIComponent(after)}` : "");
        const res = await fetch(url, { headers: authHeaders(), signal });
        if (!res.ok) return { error: await readGraphError(res) };
        const j = (await res.json()) as {
          data?: WaTemplate[];
          paging?: { next?: string; cursors?: { after?: string } };
        };
        if (j.data?.length) all.push(...j.data);
        if (!j.paging?.next || !j.paging.cursors?.after) break;
        after = j.paging.cursors.after;
      }
      return { templates: all };
    });
  } catch (error) {
    const aborted = error instanceof Error && error.name === "AbortError";
    return { error: { message: aborted ? "Graph timeout (20s)" : String(error) } };
  }
}

/** Mark the newest inbound message as read (blue ticks on the customer side). */
export async function markRead(wamid: string): Promise<void> {
  if (!graphConfigured()) return;
  try {
    await withTimeout(15_000, (signal) =>
      fetch(`${GRAPH}/${PHONE_NUMBER_ID}/messages`, {
        method: "POST",
        headers: { ...authHeaders(), "content-type": "application/json" },
        body: JSON.stringify({ messaging_product: "whatsapp", status: "read", message_id: wamid }),
        signal,
      }),
    );
  } catch (error) {
    console.warn("[graph] markRead failed:", error);
  }
}
