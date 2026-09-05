"use client";

import { useEffect, useRef, useState } from "react";
import { liveAgentNumber } from "@/lib/site-content";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "summit.assistant.chat";
const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! 👋 I'm Summit's assistant. Tell me a bit about your business and what you'd like to build or automate — I'll point you the right way.",
};
const WA_HANDOFF = `https://wa.me/${liveAgentNumber}?text=${encodeURIComponent(
  "Hi Summit, I'd like to talk to your team.",
)}`;

/**
 * Floating AI chat widget for the marketing site. Talks to /api/chat (the same
 * assistant brain as the WhatsApp bot), keeps the transcript in the browser,
 * and offers a one-tap handoff to a human on WhatsApp. Full-screen sheet on
 * mobile, docked panel on desktop.
 */
export function SiteAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore prior transcript once (per-browser convenience only).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Msg[];
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist + keep the view pinned to the latest message.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* ignore */
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setError(null);
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setSending(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Send only the real turns (drop the client-side greeting seed).
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING) }),
      });
      const j = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !j.reply) throw new Error(j.error || "Something went wrong.");
      setMessages((prev) => [...prev, { role: "assistant", content: j.reply as string }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setMessages([GREETING]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {/* Launcher */}
      {!open ? (
        <button
          aria-label="Chat with Summit's assistant"
          className="group fixed bottom-24 right-5 z-50 inline-flex items-center gap-2.5 rounded-full border border-gold-300/30 bg-gradient-to-br from-gold-400 to-gold-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(201,164,74,0.4)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:bottom-28 sm:right-6"
          onClick={() => setOpen(true)}
          type="button"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M8 10h.01M12 10h.01M16 10h.01" />
          </svg>
          <span className="whitespace-nowrap">Chat with us</span>
        </button>
      ) : null}

      {/* Panel */}
      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-end sm:inset-auto sm:bottom-6 sm:right-6">
          {/* Mobile backdrop */}
          <button aria-label="Close chat" className="absolute inset-0 bg-black/40 sm:hidden" onClick={() => setOpen(false)} type="button" />
          <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden border border-white/10 bg-[#0b0e17] shadow-2xl sm:h-[70vh] sm:max-h-[640px] sm:w-[380px] sm:rounded-2xl">
            {/* Header */}
            <header className="flex items-center justify-between gap-2 border-b border-white/10 bg-gradient-to-br from-gold-400/95 to-gold-600/95 px-4 py-3 text-slate-950">
              <div className="min-w-0">
                <p className="text-sm font-semibold">Summit Assistant</p>
                <p className="text-[11px] opacity-80">Typically replies instantly</p>
              </div>
              <div className="flex items-center gap-1">
                <button aria-label="Reset chat" className="rounded-lg px-2 py-1 text-[11px] font-medium hover:bg-black/10" onClick={reset} title="Start over" type="button">
                  Reset
                </button>
                <button aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-lg hover:bg-black/10" onClick={() => setOpen(false)} type="button">
                  <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </header>

            {/* Messages */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#0b0e17] px-4 py-4" ref={scrollRef}>
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-6 ${
                      m.role === "user"
                        ? "bg-gold-500/90 text-slate-950"
                        : "border border-white/10 bg-white/[0.04] text-slate-100"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {sending ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="flex gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    </span>
                  </div>
                </div>
              ) : null}
              {error ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/[0.08] px-3 py-2 text-xs text-rose-200">
                  {error}{" "}
                  <a className="underline" href={WA_HANDOFF} rel="noopener noreferrer" target="_blank">
                    Chat on WhatsApp
                  </a>
                </div>
              ) : null}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 bg-[#0b0e17] px-3 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  className="max-h-28 min-h-[42px] flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-gold-400/40 focus:outline-none"
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  placeholder="Type your message…"
                  rows={1}
                  value={input}
                />
                <button
                  aria-label="Send"
                  className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-slate-950 transition hover:brightness-105 disabled:opacity-40"
                  disabled={!input.trim() || sending}
                  onClick={() => void send()}
                  type="button"
                >
                  <svg aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="m22 2-7 20-4-9-9-4Z" />
                    <path d="M22 2 11 13" />
                  </svg>
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-600">
                Prefer a person?{" "}
                <a className="text-gold-400 hover:text-gold-300" href={WA_HANDOFF} rel="noopener noreferrer" target="_blank">
                  Talk to our team on WhatsApp
                </a>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
