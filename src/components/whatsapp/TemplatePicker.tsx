"use client";

import { ChevronLeft, Send, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { WaTemplate } from "@/lib/whatsapp/graph";

export type TemplateSelection = {
  templateName: string;
  language: string;
  bodyParams: string[];
  bodyText: string;
};

/** Body text of a template (Meta's BODY component). */
function bodyOf(t: WaTemplate): string {
  return t.components?.find((c) => c.type === "BODY")?.text ?? "";
}

/** Unique {{n}} placeholder numbers in a body, ascending. */
function placeholdersOf(body: string): number[] {
  const ns = new Set<number>();
  for (const m of body.matchAll(/\{\{(\d+)\}\}/g)) ns.add(Number(m[1]));
  return [...ns].sort((a, b) => a - b);
}

/**
 * We only fill BODY {{n}} params. A template that ALSO needs header media/
 * variables, dynamic URL buttons, or named params would be accepted here but
 * rejected by Meta at send time — filter those out until the sender grows.
 */
function sendableBy(t: WaTemplate): boolean {
  const header = t.components?.find((c) => c.type === "HEADER");
  if (header && header.format && header.format !== "TEXT") return false; // media header needs a handle
  if (header?.text?.includes("{{")) return false;
  const buttons = t.components?.find((c) => c.type === "BUTTONS")?.buttons ?? [];
  if (buttons.some((b) => b.url?.includes("{{"))) return false;
  if (bodyOf(t).match(/\{\{\s*[a-zA-Z_]/)) return false; // named params
  return true;
}

/**
 * Pick an APPROVED template, fill its {{n}} placeholders, preview the result,
 * send. Templates are the only way to message outside the 24h window, so this
 * is the outreach entry point for both the inbox and the prospects drawer.
 * The caller owns closing on success (it knows whether the send landed).
 */
export function TemplatePicker({
  open,
  onClose,
  onSend,
  defaults,
}: {
  open: boolean;
  onClose: () => void;
  onSend: (sel: TemplateSelection) => Promise<void> | void;
  defaults?: { contactName?: string; businessName?: string };
}): React.ReactNode {
  const [templates, setTemplates] = useState<WaTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WaTemplate | null>(null);
  const [values, setValues] = useState<Record<number, string>>({});
  const [sending, setSending] = useState(false);

  // (Re)load on open — approval status is live Meta state, never cached here.
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    setError(null);
    setSelected(null);
    setValues({});
    fetch("/api/admin/whatsapp/templates")
      .then(async (r) => {
        const j = (await r.json().catch(() => ({}))) as { templates?: WaTemplate[]; error?: string };
        if (!alive) return;
        if (!r.ok || !j.templates) {
          setError(j.error ?? "Failed to load templates");
          return;
        }
        setTemplates(j.templates.filter((t) => t.status === "APPROVED" && sendableBy(t)));
      })
      .catch(() => { if (alive) setError("Network error"); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [open]);

  const body = selected ? bodyOf(selected) : "";
  const placeholders = useMemo(() => placeholdersOf(body), [body]);
  const allFilled = placeholders.every((n) => (values[n] ?? "").trim().length > 0);

  // Live preview: substitute filled params, keep {{n}} visible for empty ones.
  const preview = useMemo(
    () => body.replace(/\{\{(\d+)\}\}/g, (token, n) => values[Number(n)]?.trim() || token),
    [body, values],
  );

  const pick = (t: WaTemplate) => {
    const prefill: Record<number, string> = {};
    for (const n of placeholdersOf(bodyOf(t))) {
      if (n === 1) prefill[1] = defaults?.contactName ?? "";
      else if (n === 2) prefill[2] = defaults?.businessName ?? "";
      else prefill[n] = "";
    }
    setSelected(t);
    setValues(prefill);
  };

  const doSend = async () => {
    if (!selected || !allFilled || sending) return;
    setSending(true);
    try {
      await onSend({
        templateName: selected.name,
        language: selected.language,
        bodyParams: placeholders.map((n) => values[n]!.trim()),
        bodyText: body.replace(/\{\{(\d+)\}\}/g, (_, n: string) => values[Number(n)]!.trim()),
      });
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="flex h-full w-full flex-col border-white/10 bg-[#0b0e17] sm:h-auto sm:max-h-[85vh] sm:max-w-lg sm:rounded-2xl sm:border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
          {selected ? (
            <button
              aria-label="Back to templates"
              className="text-slate-400 hover:text-white"
              onClick={() => setSelected(null)}
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          ) : null}
          <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
            {selected ? selected.name : "Send a template message"}
          </p>
          <button aria-label="Close" className="text-slate-400 hover:text-white" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="p-2 text-sm text-slate-500">Loading templates…</p>
          ) : error ? (
            <p className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-[12px] text-red-300">{error}</p>
          ) : !selected ? (
            templates.length === 0 ? (
              <p className="p-2 text-sm text-slate-500">No approved templates yet — check /admin/templates.</p>
            ) : (
              <div className="space-y-2">
                {templates.map((t) => (
                  <button
                    key={`${t.name}:${t.language}`}
                    className="w-full rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-amber-300/30 hover:bg-white/[0.05]"
                    onClick={() => pick(t)}
                    type="button"
                  >
                    <span className="flex items-center gap-2">
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">{t.name}</span>
                      <span className="rounded-full bg-amber-300/10 px-2 py-0.5 text-[10px] text-amber-200">{t.language}</span>
                    </span>
                    <span className="mt-1 line-clamp-2 block text-[12px] text-slate-400">{bodyOf(t)}</span>
                  </button>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3">
              {placeholders.map((n) => (
                <label key={n} className="block">
                  <span className="mb-1 block text-[11px] font-medium text-slate-400">
                    Placeholder {`{{${n}}}`}
                  </span>
                  <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-300/40"
                    onChange={(e) => setValues((prev) => ({ ...prev, [n]: e.target.value }))}
                    placeholder={`Value for {{${n}}}`}
                    value={values[n] ?? ""}
                  />
                </label>
              ))}
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-amber-200">Preview</p>
                <p className="whitespace-pre-wrap text-sm text-slate-200">{preview}</p>
              </div>
            </div>
          )}
        </div>

        {selected ? (
          <div className="flex justify-end gap-2 border-t border-white/8 px-4 py-3">
            <button className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:text-white" onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:opacity-50"
              disabled={!allFilled || sending}
              onClick={doSend}
              type="button"
            >
              <Send className="h-4 w-4" /> {sending ? "Sending…" : "Send template"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
