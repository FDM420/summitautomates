"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Composer } from "./Composer";
import { dayLabel } from "./format";
import { MessageBubble } from "./MessageBubble";
import type { WaMessage } from "./types";

const TAIL_MS_VISIBLE = 3000;
const TAIL_MS_HIDDEN = 15000;

/** Deterministic order: Meta time, then insert time, then id. */
function cmp(a: WaMessage, b: WaMessage): number {
  return (
    a.occurredAt.localeCompare(b.occurredAt) ||
    (a.createdAt ?? "").localeCompare(b.createdAt ?? "") ||
    a.id.localeCompare(b.id)
  );
}

function mergeById(prev: WaMessage[], incoming: WaMessage[]): WaMessage[] {
  const seen = new Map(prev.map((m) => [m.id, m]));
  for (const m of incoming) seen.set(m.id, m);
  return [...seen.values()].sort(cmp);
}

/**
 * Message list for one contact. Loads the newest page, pages older on
 * scroll-up (preserving scroll position), and tails new messages by polling —
 * polling, not sockets, because Cloud Run scales to zero.
 */
export function ChatThread({
  contactId,
  windowOpen,
  onRead,
}: {
  contactId: string;
  /** Is the 24h free-form reply window open for this contact? */
  windowOpen: boolean;
  /** Called when a new inbound message arrives while the thread is visible (we re-mark it read). */
  onRead?: () => void;
}) {
  const [messages, setMessages] = useState<WaMessage[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<WaMessage | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loadingOlder = useRef(false);
  const stickToBottom = useRef(true);
  const pendingAdjust = useRef<{ prevHeight: number } | null>(null);
  const knownIds = useRef<Set<string>>(new Set());

  const base = `/api/admin/whatsapp/contacts/${contactId}/messages`;
  const readUrl = `/api/admin/whatsapp/contacts/${contactId}/read`;

  // Initial load.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setMessages([]);
    knownIds.current = new Set();
    stickToBottom.current = true;
    fetch(base)
      .then((r) => r.json())
      .then((j: { messages: WaMessage[]; hasMore: boolean }) => {
        if (!alive) return;
        const list = (j.messages ?? []).sort(cmp);
        knownIds.current = new Set(list.map((m) => m.id));
        setMessages(list);
        setHasMore(Boolean(j.hasMore));
      })
      .catch(() => {})
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [base]);

  // Tail polling: re-fetch a recent window so new messages AND status ticks
  // update. Re-entry guarded so visibility toggles can't stack pollers.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let alive = true;
    let inFlight = false;
    const tick = async () => {
      if (!alive || inFlight) return;
      inFlight = true;
      try {
        const r = await fetch(`${base}?limit=30`);
        const j = (await r.json()) as { messages: WaMessage[] };
        if (alive && j.messages) {
          const fresh = j.messages.filter((m) => !knownIds.current.has(m.id));
          for (const m of fresh) knownIds.current.add(m.id);
          setMessages((prev) => mergeById(prev, j.messages));
          if (fresh.some((m) => m.direction === "inbound") && !document.hidden) {
            fetch(readUrl, { method: "POST" }).catch(() => {});
            onRead?.();
          }
        }
      } catch { /* ignore */ } finally {
        inFlight = false;
      }
      if (alive) timer = setTimeout(tick, document.hidden ? TAIL_MS_HIDDEN : TAIL_MS_VISIBLE);
    };
    timer = setTimeout(tick, TAIL_MS_VISIBLE);
    const onVis = () => { if (!document.hidden && !inFlight) { clearTimeout(timer); void tick(); } };
    document.addEventListener("visibilitychange", onVis);
    return () => { alive = false; clearTimeout(timer); document.removeEventListener("visibilitychange", onVis); };
  }, [base, readUrl, onRead]);

  // After a prepend, restore the scroll offset synchronously (before paint);
  // otherwise keep pinned to the bottom when the user was near it.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const p = pendingAdjust.current;
    if (p) {
      el.scrollTop = el.scrollHeight - p.prevHeight;
      pendingAdjust.current = null;
      return;
    }
    if (stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const loadOlder = useCallback(async () => {
    const el = scrollRef.current;
    if (!el || loadingOlder.current || !hasMore || messages.length === 0) return;
    loadingOlder.current = true;
    const oldest = messages[0]!;
    try {
      const q = new URLSearchParams({ before: oldest.occurredAt });
      if (oldest.createdAt) q.set("beforeCreated", oldest.createdAt);
      const r = await fetch(`${base}?${q}`);
      const j = (await r.json()) as { messages: WaMessage[]; hasMore: boolean };
      for (const m of j.messages ?? []) knownIds.current.add(m.id);
      pendingAdjust.current = { prevHeight: el.scrollHeight };
      setMessages((prev) => mergeById(j.messages ?? [], prev));
      setHasMore(Boolean(j.hasMore));
    } catch {
      pendingAdjust.current = null;
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

  /** Optimistic send: temp bubble now, replaced by the server row (or failed). */
  const sendMessage = useCallback(
    async (text: string) => {
      const key = crypto.randomUUID();
      const nowIso = new Date().toISOString();
      const quoted = replyTo;
      setReplyTo(null);
      const temp: WaMessage = {
        id: `temp-${key}`,
        direction: "outbound",
        type: "text",
        status: "queued",
        body: text,
        payload: null,
        mediaKey: null,
        mediaMime: null,
        mediaFilename: null,
        mediaSizeBytes: null,
        replyToProviderId: quoted?.providerMessageId ?? null,
        reactionToProviderId: null,
        isForwarded: false,
        providerMessageId: null,
        errorTitle: null,
        sentAt: null,
        deliveredAt: null,
        readAt: null,
        occurredAt: nowIso,
        createdAt: nowIso,
      };
      stickToBottom.current = true;
      setMessages((prev) => [...prev, temp]);

      try {
        const res = await fetch(`${base}/text`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            body: text,
            idempotencyKey: key,
            ...(quoted?.providerMessageId ? { replyToProviderId: quoted.providerMessageId } : {}),
          }),
        });
        const j = (await res.json().catch(() => ({}))) as { message?: WaMessage; error?: string };
        if (res.ok && j.message) {
          knownIds.current.add(j.message.id);
          setMessages((prev) => mergeById(prev.filter((m) => m.id !== temp.id), [j.message!]));
        } else {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === temp.id ? { ...m, status: "failed", errorTitle: j.error ?? "Send failed" } : m,
            ),
          );
        }
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === temp.id ? { ...m, status: "failed", errorTitle: "Network error" } : m,
          ),
        );
      }
    },
    [base, replyTo],
  );

  /** Optimistic media send: local-preview bubble now, replaced by the server row. */
  const sendMedia = useCallback(
    async (file: File, caption: string) => {
      const key = crypto.randomUUID();
      const nowIso = new Date().toISOString();
      const kind = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
          ? "video"
          : file.type.startsWith("audio/")
            ? "audio"
            : "document";
      const localUrl = URL.createObjectURL(file);
      const temp: WaMessage = {
        id: `temp-${key}`,
        direction: "outbound",
        type: kind as WaMessage["type"],
        status: "queued",
        body: caption || null,
        payload: null,
        mediaKey: "local",
        mediaMime: file.type,
        mediaFilename: kind === "document" ? file.name : null,
        mediaSizeBytes: file.size,
        replyToProviderId: null,
        reactionToProviderId: null,
        isForwarded: false,
        providerMessageId: null,
        errorTitle: null,
        sentAt: null,
        deliveredAt: null,
        readAt: null,
        occurredAt: nowIso,
        createdAt: nowIso,
        localUrl,
      };
      stickToBottom.current = true;
      setMessages((prev) => [...prev, temp]);

      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("idempotencyKey", key);
        if (caption) fd.append("caption", caption);
        const res = await fetch(`${base}/media`, { method: "POST", body: fd });
        const j = (await res.json().catch(() => ({}))) as { message?: WaMessage; error?: string };
        URL.revokeObjectURL(localUrl);
        if (res.ok && j.message) {
          knownIds.current.add(j.message.id);
          setMessages((prev) => mergeById(prev.filter((m) => m.id !== temp.id), [j.message!]));
        } else {
          setMessages((prev) =>
            prev.map((m) => (m.id === temp.id ? { ...m, status: "failed", localUrl: null, errorTitle: j.error ?? "Upload failed" } : m)),
          );
        }
      } catch {
        URL.revokeObjectURL(localUrl);
        setMessages((prev) =>
          prev.map((m) => (m.id === temp.id ? { ...m, status: "failed", localUrl: null, errorTitle: "Network error" } : m)),
        );
      }
    },
    [base],
  );

  // Derived: quoted lookup, reactions (last-wins per target+sender, empty =
  // removed), visible list without reaction rows.
  const { byProvider, reactionsFor, visible } = useMemo(() => {
    const byProvider = new Map<string, WaMessage>();
    for (const m of messages) if (m.providerMessageId) byProvider.set(m.providerMessageId, m);

    const latest = new Map<string, string>(); // `${target}|${direction}` → emoji
    for (const m of messages) {
      if (m.type === "reaction" && m.reactionToProviderId) {
        latest.set(`${m.reactionToProviderId}|${m.direction}`, m.body ?? "");
      }
    }
    const reactionsFor = new Map<string, string[]>();
    for (const [k, emoji] of latest) {
      if (!emoji) continue;
      const target = k.slice(0, k.lastIndexOf("|"));
      reactionsFor.set(target, [...(reactionsFor.get(target) ?? []), emoji]);
    }

    const visible = messages.filter((m) => m.type !== "reaction");
    return { byProvider, reactionsFor, visible };
  }, [messages]);

  let lastDay = "";
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4" onScroll={onScroll} ref={scrollRef}>
        {loading ? (
          <p className="p-2 text-sm text-slate-500">Loading conversation…</p>
        ) : visible.length === 0 ? (
          <p className="p-2 text-sm text-slate-500">No messages yet.</p>
        ) : (
          <>
            {hasMore ? (
              <p className="mb-3 text-center text-[11px] text-slate-500">Scroll up for older messages</p>
            ) : null}
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
                        onReply={
                          windowOpen && m.providerMessageId ? () => setReplyTo(m) : undefined
                        }
                        quoted={m.replyToProviderId ? byProvider.get(m.replyToProviderId) ?? null : null}
                        reactions={m.providerMessageId ? reactionsFor.get(m.providerMessageId) : undefined}
                      />
                    )}
                  </Fragment>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Composer
        onCancelReply={() => setReplyTo(null)}
        onSend={sendMessage}
        onSendMedia={sendMedia}
        replyTo={replyTo}
        windowOpen={windowOpen}
      />
    </div>
  );
}
