import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { ingestInboundEvent } from "@/lib/crm/intake";
import { normalizePhone } from "@/lib/crm/phone";

// Facebook Lead Ads webhook.
//   GET  → Meta's verification handshake (Page/leadgen subscription).
//   POST → `leadgen` events. We fetch the full lead via the Graph API and store
//          it in the CRM as a contact + lead (source: facebook).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRAPH_VERSION = "v21.0";

// The app secret is shared across the whole Meta app (WhatsApp + Page webhooks).
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;
const VERIFY_TOKEN =
  process.env.FACEBOOK_VERIFY_TOKEN ?? process.env.WHATSAPP_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const mode = params.get("hub.mode");
  const token = params.get("hub.verify_token");
  const challenge = params.get("hub.challenge");

  if (mode === "subscribe" && VERIFY_TOKEN && token === VERIFY_TOKEN) {
    return new Response(challenge ?? "", {
      status: 200,
      headers: { "content-type": "text/plain" },
    });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const raw = await request.text();

  if (!isValidSignature(raw, request.headers.get("x-hub-signature-256"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: FacebookWebhookBody;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true });
  }

  try {
    await handleEvents(payload);
  } catch (error) {
    console.error("[facebook] handler error:", error);
  }
  return NextResponse.json({ ok: true });
}

async function handleEvents(payload: FacebookWebhookBody) {
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "leadgen" || !change.value?.leadgen_id) continue;
      await handleLead(change.value.leadgen_id);
    }
  }
}

async function handleLead(leadgenId: string) {
  const lead = await fetchLead(leadgenId);
  if (!lead) return;

  const fields = new Map<string, string>();
  for (const f of lead.field_data ?? []) {
    if (f.name && f.values?.[0]) fields.set(f.name.toLowerCase(), f.values[0]);
  }

  const email = fields.get("email") ?? null;
  const rawPhone =
    fields.get("phone_number") ?? fields.get("phone") ?? fields.get("mobile");
  const phone = normalizePhone(rawPhone);
  const joinedName = [fields.get("first_name"), fields.get("last_name")]
    .filter(Boolean)
    .join(" ");
  const name =
    fields.get("full_name") ||
    joinedName ||
    email ||
    phone ||
    "Facebook lead";

  // Prefer phone as the dedup identity, fall back to email.
  const identity = phone
    ? { channel: "phone" as const, value: phone }
    : email
      ? { channel: "email" as const, value: email.toLowerCase() }
      : null;
  if (!identity) return; // nothing to key on

  const summary = [...fields.entries()]
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");

  await ingestInboundEvent({
    eventId: `fb:${leadgenId}`,
    channel: "facebook",
    identityChannel: identity.channel,
    identityValue: identity.value,
    displayName: name,
    message: `New Facebook lead:\n${summary}`,
    summary: `Facebook ad lead${email ? ` · ${email}` : ""}`,
    rawPayload: lead,
    activityType: "facebook_lead",
  });
}

async function fetchLead(leadgenId: string): Promise<GraphLead | null> {
  if (!PAGE_ACCESS_TOKEN) {
    console.warn("[facebook] missing FACEBOOK_PAGE_ACCESS_TOKEN; cannot fetch lead");
    return null;
  }
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${leadgenId}?fields=id,created_time,field_data&access_token=${PAGE_ACCESS_TOKEN}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("[facebook] lead fetch failed:", res.status, await res.text());
      return null;
    }
    return (await res.json()) as GraphLead;
  } catch (error) {
    console.error("[facebook] lead fetch error:", error);
    return null;
  }
}

function isValidSignature(raw: string, header: string | null): boolean {
  if (!APP_SECRET) return true;
  if (!header?.startsWith("sha256=")) return false;
  const expected = crypto
    .createHmac("sha256", APP_SECRET)
    .update(raw, "utf8")
    .digest("hex");
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(header.slice("sha256=".length), "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// --- Types ---
type FacebookWebhookBody = {
  entry?: {
    changes?: {
      field?: string;
      value?: { leadgen_id?: string; page_id?: string; form_id?: string };
    }[];
  }[];
};

type GraphLead = {
  id: string;
  created_time?: string;
  field_data?: { name?: string; values?: string[] }[];
};
