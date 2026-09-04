"use client";

import { Image as ImageIcon, Mic, Paperclip, Send, Video, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatBytes } from "./format";
import type { WaMessage } from "./types";

type Props = {
  windowOpen: boolean;
  replyTo: WaMessage | null;
  onCancelReply: () => void;
  onSend: (text: string) => void | Promise<void>;
  onSendMedia: (file: File, caption: string) => void | Promise<void>;
};

const ACCEPT: Record<string, string> = {
  photo: "image/*",
  video: "video/*",
  audio: "audio/*",
  document: "*/*",
};

/** WhatsApp-style composer: text, attachments (photo/video/audio/document),
 *  drag-drop, and a preview+caption step before sending media. */
export function Composer({ windowOpen, replyTo, onCancelReply, onSend, onSendMedia }: Props) {
  const [text, setText] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [pending, setPending] = useState<{ file: File; url: string | null } | null>(null);
  const [caption, setCaption] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const acceptRef = useRef<string>("*/*");
  const dragDepth = useRef(0);

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

  const pickFile = (kind: keyof typeof ACCEPT) => {
    acceptRef.current = ACCEPT[kind];
    if (fileRef.current) {
      fileRef.current.accept = ACCEPT[kind];
      fileRef.current.value = "";
      fileRef.current.click();
    }
    setMenuOpen(false);
  };

  const stageFile = (file: File) => {
    const previewable = file.type.startsWith("image/") || file.type.startsWith("video/");
    setPending({ file, url: previewable ? URL.createObjectURL(file) : null });
    setCaption("");
  };

  const clearPending = () => {
    if (pending?.url) URL.revokeObjectURL(pending.url);
    setPending(null);
    setCaption("");
  };

  const confirmSend = () => {
    if (!pending) return;
    const { file } = pending;
    const cap = caption.trim();
    if (pending.url) URL.revokeObjectURL(pending.url);
    setPending(null);
    setCaption("");
    void onSendMedia(file, cap);
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
    <div
      className={`relative border-t border-white/8 px-2 py-2.5 sm:px-3 sm:py-3 ${dragOver ? "bg-amber-300/5" : ""}`}
      onDragEnter={(e) => { e.preventDefault(); dragDepth.current++; setDragOver(true); }}
      onDragLeave={() => { dragDepth.current--; if (dragDepth.current <= 0) { dragDepth.current = 0; setDragOver(false); } }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        dragDepth.current = 0;
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) stageFile(f);
      }}
    >
      {dragOver ? (
        <div className="pointer-events-none absolute inset-2 z-10 grid place-items-center rounded-xl border-2 border-dashed border-amber-300/50 bg-[#0b0e17]/80 text-sm text-amber-200">
          Drop to attach
        </div>
      ) : null}

      {replyTo ? (
        <div className="mb-2 flex items-start justify-between gap-2 rounded-lg border-l-2 border-amber-300/70 bg-white/[0.04] px-3 py-1.5">
          <div className="min-w-0 text-[12px] text-slate-300">
            <span className="block text-[10px] font-medium text-amber-200">
              Replying to {replyTo.direction === "outbound" ? "yourself" : "customer"}
            </span>
            <span className="line-clamp-1">{replyTo.body ?? `[${replyTo.type}]`}</span>
          </div>
          <button aria-label="Cancel reply" className="text-slate-500 hover:text-white" onClick={onCancelReply} type="button">✕</button>
        </div>
      ) : null}

      <div className="flex items-end gap-1.5 sm:gap-2">
        {/* Attach */}
        <div className="relative">
          <button
            aria-label="Attach"
            className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-white/5 hover:text-white"
            onClick={() => setMenuOpen((v) => !v)}
            type="button"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          {menuOpen ? (
            <>
              <button aria-hidden className="fixed inset-0 z-10 cursor-default" onClick={() => setMenuOpen(false)} tabIndex={-1} type="button" />
              <div className="absolute bottom-12 left-0 z-20 w-44 overflow-hidden rounded-xl border border-white/10 bg-[#0b0e17] shadow-xl">
                {([
                  ["photo", ImageIcon, "Photo"],
                  ["video", Video, "Video"],
                  ["audio", Mic, "Audio file"],
                  ["document", Paperclip, "Document"],
                ] as const).map(([kind, Icon, label]) => (
                  <button
                    key={kind}
                    className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-white/5"
                    onClick={() => pickFile(kind)}
                    type="button"
                  >
                    <Icon className="h-4 w-4 text-amber-300" /> {label}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>

        <input
          hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) stageFile(f); }}
          ref={fileRef}
          type="file"
        />

        <textarea
          className="max-h-36 min-h-[42px] flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-300/40"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); doSend(); } }}
          placeholder="Type a message…"
          ref={ref}
          rows={1}
          value={text}
        />
        <button
          aria-label="Send"
          className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full bg-amber-300 text-slate-950 transition hover:bg-amber-200 disabled:opacity-50"
          disabled={!text.trim()}
          onClick={doSend}
          type="button"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {/* Media preview + caption */}
      {pending ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={clearPending}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0b0e17] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-medium text-white">Send attachment</p>
              <button aria-label="Cancel" className="text-slate-400 hover:text-white" onClick={clearPending} type="button"><X className="h-5 w-5" /></button>
            </div>
            <div className="mb-3 grid max-h-72 place-items-center overflow-hidden rounded-xl bg-black/30 p-2">
              {pending.url && pending.file.type.startsWith("image/") ? (
                <img alt="preview" className="max-h-64 rounded-lg object-contain" src={pending.url} />
              ) : pending.url && pending.file.type.startsWith("video/") ? (
                <video className="max-h-64 rounded-lg" controls src={pending.url} />
              ) : (
                <div className="flex items-center gap-3 px-4 py-6 text-slate-300">
                  <Paperclip className="h-6 w-6 text-amber-300" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{pending.file.name}</span>
                    <span className="block text-[11px] text-slate-500">{pending.file.type || "file"} · {formatBytes(pending.file.size)}</span>
                  </span>
                </div>
              )}
            </div>
            {!pending.file.type.startsWith("audio/") ? (
              <input
                autoFocus
                className="mb-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-300/40"
                onChange={(e) => setCaption(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") confirmSend(); }}
                placeholder="Add a caption (optional)…"
                value={caption}
              />
            ) : null}
            <div className="flex justify-end gap-2">
              <button className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white" onClick={clearPending} type="button">Cancel</button>
              <button className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-200" onClick={confirmSend} type="button">
                <Send className="h-4 w-4" /> Send
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
