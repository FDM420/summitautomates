"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatInbox, type InboxFilter } from "./ChatInbox";
import { ChatThread } from "./ChatThread";
import type { WaThread } from "./types";

const LIST_POLL_MS = 10000;

/** Split-pane WhatsApp inbox: thread list + conversation. Read-only in Phase A. */
export function InboxApp({ initialContactId }: { initialContactId?: string }) {
  const [threads, setThreads] = useState<WaThread[]>([]);
  const [filter, setFilter] = useState<InboxFilter>("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(initialContactId ?? null);
  const [mobileShowThread, setMobileShowThread] = useState(Boolean(initialContactId));
  // Bumped on every optimistic local mutation (toggle). A poll that started
  // before a mutation is dropped so it can't revert the optimistic state.
  const mutationSeq = useRef(0);

  const loadThreads = useCallback(async () => {
    const q = new URLSearchParams({ filter });
    if (search.trim()) q.set("search", search.trim());
    const seq = mutationSeq.current;
    try {
      const r = await fetch(`/api/admin/whatsapp/threads?${q}`);
      const j = (await r.json()) as { threads: WaThread[] };
      if (j.threads && seq === mutationSeq.current) setThreads(j.threads);
    } catch { /* ignore */ }
  }, [filter, search]);

  // Load on filter/search change (debounced), then poll.
  useEffect(() => {
    const t = setTimeout(loadThreads, 250);
    return () => clearTimeout(t);
  }, [loadThreads]);
  useEffect(() => {
    const i = setInterval(() => { if (!document.hidden) void loadThreads(); }, LIST_POLL_MS);
    const onFocus = () => void loadThreads();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(i); window.removeEventListener("focus", onFocus); };
  }, [loadThreads]);

  const select = useCallback(async (id: string) => {
    setActiveId(id);
    setMobileShowThread(true);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, waUnreadCount: 0 } : t)));
    const url = new URL(window.location.href);
    url.searchParams.set("c", id);
    window.history.replaceState(null, "", url.toString());
    fetch(`/api/admin/whatsapp/contacts/${id}/read`, { method: "POST" }).catch(() => {});
  }, []);

  const active = useMemo(() => threads.find((t) => t.id === activeId) ?? null, [threads, activeId]);
  const windowOpen = active?.waWindowExpiresAt ? new Date(active.waWindowExpiresAt).getTime() > Date.now() : false;

  const toggleAutopilot = useCallback(async () => {
    if (!activeId || !active) return;
    const next = !active.waAutopilot;
    // Optimistic + invalidate any in-flight poll so it can't clobber this.
    mutationSeq.current += 1;
    setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, waAutopilot: next } : t)));
    try {
      await fetch(`/api/admin/whatsapp/contacts/${activeId}/autopilot`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled: next }),
      });
      // Server is now authoritative and matches — let polls flow again.
      void loadThreads();
    } catch {
      mutationSeq.current += 1;
      setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, waAutopilot: !next } : t)));
    }
  }, [activeId, active, loadThreads]);

  return (
    <div className="grid h-full overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] lg:grid-cols-[320px_1fr]">
      {/* List */}
      <aside className={`${mobileShowThread ? "hidden lg:flex" : "flex"} h-full min-h-0 min-w-0 flex-col border-r border-white/8`}>
        <ChatInbox
          activeId={activeId}
          filter={filter}
          onFilter={setFilter}
          onSearch={setSearch}
          onSelect={select}
          search={search}
          threads={threads}
        />
      </aside>

      {/* Thread */}
      <section className={`${mobileShowThread ? "flex" : "hidden lg:flex"} h-full min-h-0 min-w-0 flex-col`}>
        {activeId ? (
          <>
            <header className="flex items-center gap-3 border-b border-white/8 px-4 py-3">
              <button className="text-slate-400 lg:hidden" onClick={() => setMobileShowThread(false)} type="button">←</button>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{active?.waProfileName || active?.displayName || "Conversation"}</p>
                <p className="truncate text-[11px] text-slate-500">{active?.phone ?? ""}</p>
              </div>
              <button
                className={`rounded-full px-2.5 py-0.5 text-[11px] transition ${
                  active?.waAutopilot
                    ? "bg-sky-500/15 text-sky-300 hover:bg-sky-500/25"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
                onClick={toggleAutopilot}
                title={
                  active?.waAutopilot
                    ? "AI is auto-replying to this contact. Click to take over manually."
                    : "AI is paused for this contact. Click to let it auto-reply again."
                }
                type="button"
              >
                {active?.waAutopilot ? "🤖 Bot on" : "Bot off"}
              </button>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  windowOpen ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-slate-500"
                }`}
              >
                {windowOpen ? "24h window open" : "Window closed"}
              </span>
            </header>
            <div className="flex min-h-0 flex-1 flex-col">
              <ChatThread
                contactId={activeId}
                contactName={active?.waProfileName || active?.displayName || undefined}
                onRead={() =>
                  setThreads((prev) => prev.map((t) => (t.id === activeId ? { ...t, waUnreadCount: 0 } : t)))
                }
                windowOpen={windowOpen}
              />
            </div>
          </>
        ) : (
          <div className="grid flex-1 place-items-center p-8 text-center text-sm text-slate-500">
            Select a conversation to read it.
          </div>
        )}
      </section>
    </div>
  );
}
