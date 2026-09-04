import type { ReactNode } from "react";
import { createElement } from "react";

/** WhatsApp inline markup → React nodes (no innerHTML): *bold* _italic_ ~strike~ ```mono``` */
export function renderMarkup(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /```([\s\S]+?)```|\*([^*\n]+)\*|_([^_\n]+)_|~([^~\n]+)~/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] != null) out.push(createElement("code", { key: k++, className: "rounded bg-black/30 px-1 font-mono text-[0.9em]" }, m[1]));
    else if (m[2] != null) out.push(createElement("strong", { key: k++ }, m[2]));
    else if (m[3] != null) out.push(createElement("em", { key: k++ }, m[3]));
    else if (m[4] != null) out.push(createElement("s", { key: k++ }, m[4]));
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export function timeHM(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** "Today" / "Yesterday" / weekday / date — for day separators. */
export function dayLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diffDays = Math.round((startOf(now) - startOf(d)) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return d.toLocaleDateString("en-GB", { weekday: "long" });
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function relativeShort(iso: string | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** Inbox preview tokens → friendly label. */
export function previewLabel(preview: string | null): string {
  if (!preview) return "";
  const map: Record<string, string> = {
    "[image]": "📷 Photo",
    "[video]": "🎥 Video",
    "[audio]": "🎵 Audio",
    "[voice message]": "🎤 Voice message",
    "[sticker]": "🩹 Sticker",
    "[location]": "📍 Location",
    "[contact card]": "👤 Contact",
    "[unsupported]": "Unsupported message",
  };
  if (map[preview]) return map[preview];
  const doc = preview.match(/^\[document: (.+)\]$/);
  if (doc) return `📄 ${doc[1]}`;
  return preview;
}

export function formatBytes(n: number | null): string {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function initials(name: string): string {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "?";
}

export function avatarHue(seed: string): number {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}
