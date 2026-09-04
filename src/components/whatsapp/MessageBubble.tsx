"use client";

import { useState } from "react";
import { AudioPlayer } from "./AudioPlayer";
import { formatBytes, renderMarkup, timeHM } from "./format";
import type { WaMessage } from "./types";

type Props = {
  m: WaMessage;
  mine: boolean;
  quoted?: WaMessage | null;
  reactions?: string[];
  /** When provided, a hover "reply" affordance appears on the bubble. */
  onReply?: () => void;
};

export function MessageBubble({ m, mine, quoted, reactions, onReply }: Props) {
  const mediaSrc = `/api/admin/whatsapp/media/${m.id}`;
  return (
    <div className={`group flex items-center gap-1.5 ${mine ? "justify-end" : "justify-start"}`}>
      {mine && onReply ? <ReplyButton onReply={onReply} /> : null}
      <div
        className={`relative max-w-[78%] rounded-2xl px-3 py-2 text-[14px] leading-6 shadow-sm ${
          mine
            ? "rounded-br-md bg-amber-300/15 text-amber-50"
            : "rounded-bl-md bg-white/[0.06] text-slate-100"
        }`}
      >
        {m.isForwarded ? (
          <p className="mb-1 text-[11px] italic text-slate-400">↪ Forwarded</p>
        ) : null}
        {quoted ? <Quoted q={quoted} /> : null}
        <Content m={m} mediaSrc={mediaSrc} />
        <div className="mt-1 flex items-center justify-end gap-1.5 text-[10px] text-slate-400">
          <span>{timeHM(m.occurredAt)}</span>
          {mine ? <Ticks m={m} /> : null}
        </div>
        {reactions && reactions.length > 0 ? (
          <div className={`absolute -bottom-3 ${mine ? "right-2" : "left-2"} flex gap-0.5`}>
            {reactions.map((e, i) => (
              <span key={i} className="rounded-full border border-white/10 bg-[#0b0e17] px-1.5 text-[12px] shadow">
                {e}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {!mine && onReply ? <ReplyButton onReply={onReply} /> : null}
    </div>
  );
}

function ReplyButton({ onReply }: { onReply: () => void }) {
  return (
    <button
      aria-label="Reply to this message"
      className="shrink-0 rounded-full bg-white/5 px-2 py-1 text-[12px] text-slate-400 opacity-0 transition hover:text-white group-hover:opacity-100"
      onClick={onReply}
      title="Reply"
      type="button"
    >
      ↩
    </button>
  );
}

function Content({ m, mediaSrc }: { m: WaMessage; mediaSrc: string }) {
  const [broken, setBroken] = useState(false);
  const unavailable = (
    <p className="text-[12px] text-slate-400">Media unavailable — it may still be re-hosting. Reopen to retry.</p>
  );
  const caption = m.body ? <p className="mt-1 whitespace-pre-wrap">{renderMarkup(m.body)}</p> : null;
  const p = (m.payload ?? {}) as Record<string, unknown>;

  switch (m.type) {
    case "text":
    case "template":
      return <p className="whitespace-pre-wrap break-words">{renderMarkup(m.body ?? "")}</p>;
    case "image":
      return (
        <div>
          {broken ? unavailable : (
            <a href={mediaSrc} rel="noopener noreferrer" target="_blank">
              <img
                alt={m.body ?? "Photo"}
                className="max-h-80 rounded-xl object-cover"
                loading="lazy"
                onError={() => setBroken(true)}
                src={mediaSrc}
              />
            </a>
          )}
          {caption}
        </div>
      );
    case "sticker":
      return broken ? unavailable : (
        <img alt="Sticker" className="h-[120px] w-[120px] object-contain" onError={() => setBroken(true)} src={mediaSrc} />
      );
    case "video":
      return (
        <div>
          {broken ? unavailable : (
            <video className="max-h-80 max-w-full rounded-xl" controls onError={() => setBroken(true)} preload="metadata" src={mediaSrc} />
          )}
          {caption}
        </div>
      );
    case "audio": {
      const voice = Boolean((p.audio as { voice?: boolean } | undefined)?.voice);
      return (
        <div>
          <p className="mb-1 text-[11px] text-slate-400">{voice ? "🎤 Voice message" : "🎵 Audio"}</p>
          <AudioPlayer src={mediaSrc} transcript={m.body} />
        </div>
      );
    }
    case "document":
      return (
        <div>
          <a
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:border-amber-300/40"
            href={mediaSrc}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="text-2xl">📄</span>
            <span className="min-w-0">
              <span className="block truncate font-medium">{m.mediaFilename ?? "Document"}</span>
              <span className="block text-[11px] text-slate-400">
                {[m.mediaMime, formatBytes(m.mediaSizeBytes)].filter(Boolean).join(" · ")}
              </span>
            </span>
          </a>
          {caption}
        </div>
      );
    case "location": {
      const loc = (p.location ?? {}) as { latitude?: number; longitude?: number; name?: string; address?: string };
      const url = `https://www.google.com/maps?q=${loc.latitude},${loc.longitude}`;
      return (
        <a className="block rounded-xl border border-white/10 bg-black/20 px-3 py-2 hover:border-amber-300/40" href={url} rel="noopener noreferrer" target="_blank">
          <span className="block font-medium">📍 {loc.name ?? "Shared location"}</span>
          {loc.address ? <span className="block text-[12px] text-slate-400">{loc.address}</span> : null}
          <span className="block text-[11px] text-amber-200">Open in Google Maps</span>
        </a>
      );
    }
    case "contacts": {
      const list = (p.contacts ?? []) as { name?: { formatted_name?: string }; phones?: { phone?: string }[] }[];
      return (
        <div className="space-y-1">
          {list.map((c, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
              <span className="block font-medium">👤 {c.name?.formatted_name ?? "Contact"}</span>
              {c.phones?.map((ph, j) => (
                <span key={j} className="block text-[12px] text-slate-400">{ph.phone}</span>
              ))}
            </div>
          ))}
        </div>
      );
    }
    case "interactive":
      return <p className="text-slate-200">↳ {m.body ?? "Selection"}</p>;
    default:
      return <p className="text-[12px] italic text-slate-400">Unsupported message type</p>;
  }
}

function Quoted({ q }: { q: WaMessage }) {
  const label: Record<string, string> = {
    image: "📷 Photo", video: "🎥 Video", audio: "🎤 Voice message", document: `📄 ${q.mediaFilename ?? "Document"}`,
    sticker: "🩹 Sticker", location: "📍 Location", contacts: "👤 Contact",
  };
  const text = q.type === "text" || q.type === "template" || q.type === "interactive" ? (q.body ?? "") : (label[q.type] ?? "Message");
  return (
    <div className="mb-1.5 rounded-lg border-l-2 border-amber-300/70 bg-black/25 px-2 py-1 text-[12px] text-slate-300">
      <span className="block text-[10px] font-medium text-amber-200">{q.direction === "outbound" ? "You" : "Customer"}</span>
      <span className="line-clamp-2">{text}</span>
    </div>
  );
}

function Ticks({ m }: { m: WaMessage }) {
  switch (m.status) {
    case "queued":
    case "sending":
      return <span title="Sending">🕓</span>;
    case "sent":
      return <span className="text-slate-400" title="Sent">✓</span>;
    case "delivered":
      return <span className="text-slate-400" title="Delivered">✓✓</span>;
    case "read":
      return <span className="text-amber-300" title="Read">✓✓</span>;
    case "failed":
      return <span className="text-red-400" title={m.errorTitle ?? "Failed"}>✕ {m.errorTitle ? "failed" : ""}</span>;
    default:
      return null;
  }
}
