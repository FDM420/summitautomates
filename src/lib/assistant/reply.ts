/**
 * Summit's shared conversational assistant — one brain for both the WhatsApp
 * bot and the website chat widget. It ALWAYS receives the running conversation
 * (so it has memory and never re-introduces itself), and on any provider
 * failure it returns { error } rather than a canned line, so each caller
 * decides what to do (WhatsApp stays quiet + flags a human; the web widget
 * shows a soft "trouble connecting" note). No more identical replies.
 *
 * Provider-agnostic: uses Anthropic (Claude) when ANTHROPIC_API_KEY is set,
 * otherwise OpenAI. Either way the contract here is identical.
 */

export type ChatMessage = { role: "user" | "assistant"; content: string };

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY?.trim();
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL?.trim() || "claude-haiku-4-5-20251001";
const OPENAI_KEY = process.env.OPENAI_API_KEY?.trim();
const OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";

const MAX_TOKENS = 320;
const TIMEOUT_MS = 12_000;
/** Keep the prompt bounded — the last N turns are plenty of context. */
const MAX_HISTORY = 14;

export const SUMMIT_SYSTEM_PROMPT = `You are the assistant for Summit Systems (Summit Systems Pvt Ltd), a technology and automation company in Islamabad, Pakistan — summitautomates.com. Motto: "Building smarter systems for modern businesses."

Summit designs intelligent software, AI-powered solutions, business automation, CRM & ERP systems, websites, mobile apps, integrations, and custom digital platforms. Specific offerings: WhatsApp automation, AI voice agents, recruitment & HR automation, document verification & security, workforce & operations tracking, workflow automation, digital transformation, and custom software.

HOW TO TALK — like a sharp, friendly human on the team, not a brochure:
- You have the whole conversation above. READ IT. Never repeat yourself, never re-introduce Summit if you already have, and always build on what the person just said.
- If they name something specific (e.g. "mobile app", "CRM", "WhatsApp bot"), engage with THAT directly — ask a useful follow-up or explain briefly how Summit would approach it. Do not fall back to a generic overview.
- Keep replies short: 1-3 sentences, plain business language, no jargon, no walls of text. One question at a time.
- Introduce Summit in ONE short line only on the very first reply of a conversation, then move on.
- Qualify gently over the conversation: their business, what they want to build/automate, rough scale or timeline — but ask ONE thing at a time, naturally.
- Pricing: it depends on scope — offer a free automation audit or a quick discovery call instead of quoting a number. Never invent prices, timelines, or guarantees.
- If they ask for a human / live agent / to speak to someone, warmly confirm you'll have a team member follow up here — do not keep interrogating them.
- LANGUAGE — this matters: ALWAYS reply in the SAME language the customer's latest message is written in. If they write in Arabic (العربية), reply ONLY in fluent, natural Arabic. If they write in Urdu, reply in Urdu. If they write in English, reply in English. Many of our customers are in the Gulf and write in Arabic — never reply to an Arabic message in Urdu or English. Match their language every time; do not mix languages or switch on them.
- Be honest. If you don't know something, say a team member will confirm.`;

/** True if some provider is configured (a valid key is checked at call time). */
export function assistantConfigured(): boolean {
  return Boolean(ANTHROPIC_KEY || OPENAI_KEY);
}

function trimHistory(history: ChatMessage[]): ChatMessage[] {
  const cleaned = history.filter((m) => m.content && m.content.trim());
  const windowed = cleaned.slice(-MAX_HISTORY);
  // The array handed to a provider MUST start with a user turn — Anthropic
  // rejects an assistant-first messages array (HTTP 400), and it's the natural
  // shape whenever an outbound outreach template opened the thread or the
  // 14-turn window happens to begin on an assistant reply. Drop leading
  // assistant turns (harmless to OpenAI). Also covers the web widget's greeting
  // seed surviving a localStorage restore.
  let start = 0;
  while (start < windowed.length && windowed[start].role !== "user") start++;
  return windowed.slice(start);
}

export type ReplyResult = { text: string } | { error: string };

/**
 * Generate the next assistant turn from the full conversation. `history` ends
 * with the latest user message. Returns { text } or { error } (never a canned
 * fallback string).
 */
export async function generateAssistantReply(history: ChatMessage[]): Promise<ReplyResult> {
  const messages = trimHistory(history);
  if (messages.length === 0) return { error: "empty conversation" };
  if (messages[messages.length - 1].role !== "user") {
    return { error: "last message is not from the user" };
  }
  if (!assistantConfigured()) return { error: "assistant not configured" };

  try {
    return ANTHROPIC_KEY ? await viaAnthropic(messages) : await viaOpenAI(messages);
  } catch (error) {
    // AbortSignal.timeout() rejects with a TimeoutError (not AbortError).
    const aborted =
      error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return { error: aborted ? "assistant timeout" : String(error) };
  }
}

async function viaAnthropic(messages: ChatMessage[]): Promise<ReplyResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      "x-api-key": ANTHROPIC_KEY as string,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.5,
      system: SUMMIT_SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  if (!res.ok) {
    console.error("[assistant] Anthropic error:", res.status, await res.text());
    return { error: `anthropic ${res.status}` };
  }
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  const text = data.content?.find((b) => b.type === "text")?.text?.trim();
  return text ? { text } : { error: "empty completion" };
}

async function viaOpenAI(messages: ChatMessage[]): Promise<ReplyResult> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: {
      authorization: `Bearer ${OPENAI_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      max_tokens: MAX_TOKENS,
      temperature: 0.5,
      messages: [{ role: "system", content: SUMMIT_SYSTEM_PROMPT }, ...messages],
    }),
  });
  if (!res.ok) {
    console.error("[assistant] OpenAI error:", res.status, await res.text());
    return { error: `openai ${res.status}` };
  }
  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content?.trim();
  return text ? { text } : { error: "empty completion" };
}
