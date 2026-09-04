"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { dayLabel } from "./format";
import { MessageBubble } from "./MessageBubble";
import type { WaMessage } from "./types";

const TAIL_MS_VISIBLE = 3000;
const TAIL_MS_HIDDEN = 15000;

/**
 * Message list for one contact. Loads the newest page, pages older on
 * scroll-up (preserving scroll position), and tails new messages by polling
 * `?after=` — polling, not sockets, because Cloud Run scales to zero.
 */
export function ChatThread({ contactId }: { contactId: string }) {
  const [messages, setMessages] = useState<WaMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadingOlder = useRef(false);
  const stickToBottom = useRef(true);

  const base = `/api/admin/whatsapp/contacts/${contactId}/messages`;

  const mergeById = (prev: WaMessage[], incoming: WaMessage[]) => {
    const seen = new Map(prev.map((m) => [m.id, m]));
    for (const m of incoming) seen.set(m.id, m);
    return [...seen.values()].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  };

  // Initial load.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setMessages([]);
    stickToBottom.current = true;
    fetch(base)
      .then((r) => r.json())
      .then((j: { messages: WaMessage[]; hasMore: boolean }) => {
        if (!alive) return;
        setMessages(j.messages ?? []);
        setHasMore(Boolean(j.hasMore));
      })
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [base]);

  // Tail polling for new messages / status updates.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;
    const tick = async () => {
      if (!alive) return;
      try {
        // Re-fetch a small recent window so status ticks update too.
        const r = await fetch(`${base}?limit=30`);
        const j = (await r.json()) as { messages: WaMessage[] };
        if (alive && j.messages) setMessages((prev) => mergeById(prev, j.messages));
      } catch { /* ignore */ }
      timer = setTimeout(tick, document.hidden ? TAIL_MS_HIDDEN : TAIL_MS_VISIBLE);
    };
    timer = setTimeout(tick, TAIL_MS_VISIBLE);
    const onVis = () => { if (!document.hidden) { clearTimeout(timer); void tick(); } };
    document.addEventListener("visibilitychange", onVis);
    return () => { alive = false; clearTimeout(timer); document.removeEventListener("visibilitychange", onVis); };
  }, [base]);

  // Keep pinned to bottom when new messages arrive (if user was near bottom).
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !stickToBottom.current) return;
    el.scrollTop = el.scrollHeight;
  }, [messages]);

  const loadOlder = useCallback(async () => {
    const el = scrollRef.current;
    if (!el || loadingOlder.current || !hasMore || messages.length === 0) return;
    loadingOlder.current = true;
    const before = messages[0]!.occurredAt;
    const prevHeight = el.scrollHeight;
    try {
      const r = await fetch(`${base}?before=${encodeURIComponent(before)}`);
      const j = (await r.json()) as { messages: WaMessage[]; hasMore: boolean };
      setMessages((prev) => mergeById(j.messages ?? [], prev));
      setHasMore(Boolean(j.hasMore));
      requestAnimationFrame(() => { el.scrollTop = el.scrollHeight - prevHeight; });
    } finally {
      loadingOlder.current = false;
    }
  }, [base, hasMore, messages]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (el.scrollTop < 80) void loadOlder();
  };

  // Derived: quoted lookup, reactions grouped onto their target, visible list.
  const { byProvider, reactionsFor, visible } = useMemo(() => {
    const byProvider = new Map<string, WaMessage>();
    const reactionsFor = new Map<string, string[]>();
    for (const m of messages) if (m.providerMessageId) byProvider.set(m.providerMessageId, m);
    for (const m of messages) {
      if (m.type === "reaction" && m.reactionToProviderId && m.body) {
        const arr = reactionsFor.get(m.reactionToProviderId) ?? [];
        arr.push(m.body);
        reactionsFor.set(m.reactionToProviderId, arr);
      }
    }
    const visible = messages.filter((m) => m.type !== "reaction");
    return { byProvider, reactionsFor, visible };
  }, [messages]);

  if (loading) return <div className="p-6 text-sm text-slate-500">Loading conversation…</div>;
  if (visible.length === 0) return <div className="p-6 text-sm text-slate-500">No messages yet.</div>;

  let lastDay = "";
  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" onScroll={onScroll} ref={scrollRef}>
      {hasMore ? <p className="mb-3 text-center text-[11px] text-slate-500">Scroll up for older messages</p> : null}
      <div className="space-y-3">
        {visible.map((m) => {
          const day = dayLabel(m.occurredAt);
          const sep = day !== lastDay;
          lastDay = day;
          return (
            <Fragment key={m.id}>
              {sep ? (
                <div className="my-2 flex justify-center">
                  <span className="rounded-full bg-white/[0.06] px-3 py-0.5 text-[11px] text-slate-400">{day}</span>
                </div>
              ) : null}
              {m.type === "system" ? (
                <div className="flex justify-center">
                  <span className="rounded-full bg-white/[0.06] px-3 py-0.5 text-[11px] text-slate-400">{m.body}</span>
                </div>
              ) : (
                <MessageBubble
                  m={m}
                  mine={m.direction === "outbound"}
                  quoted={m.replyToProviderId ? byProvider.get(m.replyToProviderId) ?? null : null}
                  reactions={m.providerMessageId ? reactionsFor.get(m.providerMessageId) : undefined}
                />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
