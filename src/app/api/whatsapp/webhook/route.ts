import crypto from "node:crypto";
import { NextResponse } from "next/server";

// WhatsApp Cloud API webhook.
//   GET  → Meta's subscription verification handshake.
//   POST → incoming messages + status callbacks.
// Runs on the Node runtime (needs `crypto`) and must never be statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GRAPH_VERSION = "v21.0";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

// Best-effort in-process dedupe. WhatsApp retries deliveries, and each instance
// keeps its own set — good enough to stop double-replies within one instance.
const seenMessageIds = new Set<string>();

/** Meta verification handshake: echo hub.challenge when the token matches. */
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

/** Incoming events. Always 200 fast so Meta does not retry-storm us. */
export async function POST(request: Request) {
  const raw = await request.text();

  if (!isValidSignature(raw, request.headers.get("x-hub-signature-256"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: WhatsAppWebhookBody;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: true }); // ack malformed bodies, do not retry
  }

  // Handle work before responding (Cloud Run keeps the instance alive during the
  // request). Never throw — always ack so Meta stops resending the event.
  try {
    await handleEvents(payload);
  } catch (error) {
    console.error("[whatsapp] handler error:", error);
  }
  return NextResponse.json({ ok: true });
}

async function handleEvents(payload: WhatsAppWebhookBody) {
  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const messages = change.value?.messages;
      if (!messages) continue; // status callbacks (delivered/read) have none

      for (const message of messages) {
        if (seenMessageIds.has(message.id)) continue;
        seenMessageIds.add(message.id);

        const from = message.from;
        if (!from) continue;

        const userText =
          message.type === "text"
            ? message.text?.body?.trim() ?? ""
            : "";

        const reply = await generateReply(userText, message.type);
        await sendWhatsAppText(from, reply);
      }
    }
  }
}

/**
 * Reply generation. Uses OpenAI when OPENAI_API_KEY is configured; otherwise
 * falls back to a fixed acknowledgement so the system works before the key is
 * added. Any AI failure also falls back to the template.
 */
async function generateReply(userText: string, type: string): Promise<string> {
  if (type !== "text" || !userText) {
    return "Thanks for messaging Summit! We received your message. A team member will get back to you shortly. You can also tell us your company name and the workflow you'd like to automate.";
  }

  if (!OPENAI_API_KEY) {
    return `Thanks for reaching out to Summit AI Automation! 👋\n\nWe build AI automation for WhatsApp, CRM/ERP, recruitment, documents, and operations. A team member will reply shortly.\n\nTo speed things up, tell us:\n1) Your company\n2) The workflow you want to automate\n\nOr book a free audit: ${siteUrlSafe()}/free-automation-audit`;
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${OPENAI_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        max_tokens: 300,
        temperature: 0.4,
        messages: [
          { role: "system", content: SUMMIT_SYSTEM_PROMPT },
          { role: "user", content: userText },
        ],
      }),
    });

    if (!res.ok) {
      console.error("[whatsapp] OpenAI error:", res.status, await res.text());
      return AI_FALLBACK;
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    return data.choices?.[0]?.message?.content?.trim() || AI_FALLBACK;
  } catch (error) {
    console.error("[whatsapp] OpenAI request failed:", error);
    return AI_FALLBACK;
  }
}

const SUMMIT_SYSTEM_PROMPT = `You are the WhatsApp assistant for Summit AI Automation Services (legal name: Summit Systems Pvt Ltd), based in Islamabad, Pakistan (summitautomates.com).

Summit builds practical AI automation and custom software: WhatsApp automation, CRM/ERP automation, recruitment & HR automation, document verification & security, workforce & operations tracking, AI voice agents, workflow automation, digital transformation, and custom software development.

Your job:
- Reply warmly, briefly, and in plain business language (2-5 short sentences).
- Answer the customer's question about what Summit can build.
- Qualify gently: ask for their company, the workflow they want to automate, and rough scale/urgency.
- For pricing: explain it depends on their tools and volume, and offer a free automation audit or a discovery call rather than quoting a number.
- If they want to talk to a person, reassure them a team member will follow up.
- Never invent specific prices, timelines, or guarantees. Keep it honest.
- Match the customer's language (English or Urdu) if obvious.`;

const AI_FALLBACK =
  "Thanks for your message! We build AI automation for WhatsApp, CRM, recruitment, documents, and operations. Could you share your company and the workflow you'd like to automate? A team member will follow up shortly.";

function siteUrlSafe() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://summitautomates.com";
}

/** Send a plain-text WhatsApp message via the Graph API. */
async function sendWhatsAppText(to: string, body: string) {
  if (!ACCESS_TOKEN || !PHONE_NUMBER_ID) {
    console.warn("[whatsapp] missing ACCESS_TOKEN or PHONE_NUMBER_ID; skipping send");
    return;
  }
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PHONE_NUMBER_ID}/messages`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${ACCESS_TOKEN}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { preview_url: false, body: body.slice(0, 4096) },
    }),
  });
  if (!res.ok) {
    console.error("[whatsapp] send failed:", res.status, await res.text());
  }
}

/** Verify Meta's X-Hub-Signature-256 (HMAC-SHA256 of the raw body, app secret). */
function isValidSignature(raw: string, header: string | null): boolean {
  // If no app secret is configured yet, allow through so verification/testing
  // works during setup. Set WHATSAPP_APP_SECRET in production to enforce this.
  if (!APP_SECRET) return true;
  if (!header?.startsWith("sha256=")) return false;

  const expected = crypto
    .createHmac("sha256", APP_SECRET)
    .update(raw, "utf8")
    .digest("hex");
  const received = header.slice("sha256=".length);

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(received, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// --- Minimal typing for the slice of the payload we use ---
type WhatsAppWebhookBody = {
  entry?: {
    changes?: {
      value?: {
        messages?: {
          id: string;
          from?: string;
          type: string;
          text?: { body?: string };
        }[];
      };
    }[];
  }[];
};
