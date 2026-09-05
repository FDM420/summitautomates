import { NextResponse } from "next/server";
import {
  assistantConfigured,
  type ChatMessage,
  generateAssistantReply,
} from "@/lib/assistant/reply";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public endpoint (the website chat widget). Guardrails: only user/assistant
// turns from the client (the system prompt is server-side), bounded size, and
// a soft per-IP rate limit. State lives in the browser — the client sends the
// running transcript each turn, so there's nothing to store here.

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000; // per minute per IP

const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    // Bound memory: drop the oldest bucket occasionally.
    const firstKey = hits.keys().next().value;
    if (firstKey && firstKey !== ip) hits.delete(firstKey);
  }
  return recent.length > RATE_LIMIT;
}

function clientIp(request: Request): string {
  // The LEFTMOST X-Forwarded-For entry is client-supplied and trivially spoofed
  // (a fresh fake IP per request defeats the limiter). The RIGHTMOST entry is
  // appended by the trusted Cloud Run / App Hosting front end, so key on that.
  const parts = (request.headers.get("x-forwarded-for") ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "unknown";
}

export async function POST(request: Request) {
  if (!assistantConfigured()) {
    return NextResponse.json(
      { error: "The assistant is not available right now. Please use WhatsApp or book a call." },
      { status: 503 },
    );
  }
  if (rateLimited(clientIp(request))) {
    return NextResponse.json({ error: "Too many messages — give it a moment." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { messages?: unknown } | null;
  if (!Array.isArray(body?.messages)) {
    return NextResponse.json({ error: "messages must be an array" }, { status: 400 });
  }

  const messages: ChatMessage[] = body.messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        (m as ChatMessage).role !== undefined &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string",
    )
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    return NextResponse.json({ error: "Send a message to start." }, { status: 400 });
  }

  const result = await generateAssistantReply(messages);
  if ("error" in result) {
    console.error("[chat] assistant error:", result.error);
    return NextResponse.json(
      { error: "I'm having trouble right now — please try again, or reach us on WhatsApp." },
      { status: 502 },
    );
  }
  return NextResponse.json({ reply: result.text });
}
