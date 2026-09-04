"use client";

import { avatarHue, initials, previewLabel, relativeShort } from "./format";
import type { WaThread } from "./types";

export type InboxFilter = "all" | "unread" | "awaiting";

type Props = {
  threads: WaThread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  filter: InboxFilter;
  onFilter: (f: InboxFilter) => void;
  search: string;
  onSearch: (s: string) => void;
};

export function ChatInbox({ threads, activeId, onSelect, filter, onFilter, search, onSearch }: Props) {
  const now = Date.now();
  return (
    <div className="flex h-full flex-col">
      <div className="space-y-2 border-b border-white/8 p-3">
        <input
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search name or number…"
          type="search"
          value={search}
        />
        <div className="flex gap-1.5">
          {(["all", "unread", "awaiting"] as InboxFilter[]).map((f) => (
            <button
              key={f}
              className={`rounded-full px-3 py-1 text-xs capitalize transition ${
                filter === f ? "bg-amber-300/15 text-amber-100" : "bg-white/5 text-slate-400 hover:text-white"
              }`}
              onClick={() => onFilter(f)}
              type="button"
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <li className="p-6 text-sm text-slate-500">No conversations yet.</li>
        ) : (
          threads.map((t) => {
            const active = t.id === activeId;
            const unread = t.waUnreadCount > 0;
            const windowOpen = t.waWindowExpiresAt ? new Date(t.waWindowExpiresAt).getTime() > now : false;
            const name = t.waProfileName || t.displayName;
            return (
              <li key={t.id}>
                <button
                  className={`flex w-full items-center gap-3 border-b border-white/5 px-3 py-3 text-left transition ${
                    active ? "bg-amber-300/10" : "hover:bg-white/[0.04]"
                  }`}
                  onClick={() => onSelect(t.id)}
                  type="button"
                >
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-white"
                    style={{ background: `hsl(${avatarHue(t.id)} 45% 35%)` }}
                  >
                    {initials(name)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={`truncate text-sm ${unread ? "font-semibold text-white" : "text-slate-200"}`}>
                        {name}
                      </span>
                      <span className="shrink-0 text-[11px] text-slate-500">{relativeShort(t.waLastMessageAt)}</span>
                    </span>
                    <span className="mt-0.5 flex items-center justify-between gap-2">
                      <span className={`truncate text-[12px] ${unread ? "text-slate-200" : "text-slate-500"}`}>
                        {previewLabel(t.waLastMessagePreview)}
                      </span>
                      <span className="flex shrink-0 items-center gap-1">
                        {t.waAwaitingReply ? (
                          <span className="rounded-full bg-emerald-500/15 px-1.5 text-[10px] text-emerald-300">Reply</span>
                        ) : null}
                        {unread ? (
                          <span className="rounded-full bg-amber-300 px-1.5 text-[10px] font-semibold text-slate-950">
                            {t.waUnreadCount}
                          </span>
                        ) : null}
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${windowOpen ? "bg-emerald-400" : "bg-slate-600"}`}
                          title={windowOpen ? "24h window open" : "24h window closed"}
                        />
                      </span>
                    </span>
                  </span>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
