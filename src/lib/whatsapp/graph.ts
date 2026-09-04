/**
 * Thin WhatsApp Cloud API (Graph) client. Every Meta call in the app goes
 * through here so auth, versioning, timeouts, and error shapes live in one place.
 */
const GRAPH = "https://graph.facebook.com/v21.0";
const TOKEN = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();

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

  return withTimeout(30_000, async (signal) => {
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
