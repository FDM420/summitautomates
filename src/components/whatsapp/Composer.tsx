"use client";

import { useEffect, useRef, useState } from "react";
import type { WaMessage } from "./types";

type Props = {
  windowOpen: boolean;
  replyTo: WaMessage | null;
  onCancelReply: () => void;
  onSend: (text: string) => void | Promise<void>;
};

/** WhatsApp-style composer: auto-grow, Enter sends, Shift+Enter newline. */
export function Composer({ windowOpen, replyTo, onCancelReply, onSend }: Props) {
  const [text, setText] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  // Auto-grow up to ~6 lines.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.min(el.scrollHeight, 144)}px`;
  }, [text]);

  const doSend = () => {
    const t = text.trim();
    if (!t) return;
    setText("");
    void onSend(t);
    ref.current?.focus();
  };

  if (!windowOpen) {
    return (
      <div className="border-t border-white/8 px-4 py-3">
        <div className="rounded-xl border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-[12px] text-amber-200/90">
          ⏳ The 24-hour reply window is closed — WhatsApp only allows free-form
          replies within 24h of the customer&rsquo;s last message. It reopens the
          moment they message you again. (Template messages arrive in a later phase.)
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-white/8 px-3 py-3">
      {replyTo ? (
        <div className="mb-2 flex items-start justify-between gap-2 rounded-lg border-l-2 border-amber-300/70 bg-white/[0.04] px-3 py-1.5">
          <div className="min-w-0 text-[12px] text-slate-300">
            <span className="block text-[10px] font-medium text-amber-200">
              Replying to {replyTo.direction === "outbound" ? "yourself" : "customer"}
            </span>
            <span className="line-clamp-1">
              {replyTo.body ?? `[${replyTo.type}]`}
            </span>
          </div>
          <button
            aria-label="Cancel reply"
            className="text-slate-500 hover:text-white"
            onClick={onCancelReply}
            type="button"
          >
            ✕
          </button>
        </div>
      ) : null}
      <div className="flex items-end gap-2">
        <textarea
          className="max-h-36 min-h-[42px] flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-300/40"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              doSend();
            }
          }}
          placeholder="Type a message… (Enter to send, Shift+Enter for a new line)"
          ref={ref}
          rows={1}
          value={text}
        />
        <button
          aria-label="Send"
          className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-amber-300 text-lg text-slate-950 transition hover:bg-amber-200 disabled:opacity-50"
          disabled={!text.trim()}
          onClick={doSend}
          type="button"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
