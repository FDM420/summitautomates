"use client";

import { Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { bodyOf, placeholdersOf, sendableBy } from "@/components/whatsapp/TemplatePicker";
import type { WaTemplate } from "@/lib/whatsapp/graph";
import type { BulkSendResultDTO, ProspectFilters } from "./types";

const BUSINESS_TOKEN = "{{business}}";
const INPUT =
  "w-full rounded-lg border border-white/10 bg-[#0f1320] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-400/40 focus:outline-none";

type Counts = { matching: number; eligible: number; targeted: number; cap: number };

/**
 * Bulk outreach: send one approved template to every prospect matching the
 * current filters that has a number on file (24h-recent contacts are skipped
 * automatically; one confirmation covers at most 50 sends). {{n}} values are
 * fixed text, except any slot set to "business name" which fills per prospect.
 */
export function BulkTemplateModal({
  open,
  filters,
  ids,
  onClose,
  onDone,
}: {
  open: boolean;
  /** The table's current filters — the audience is exactly what the user sees. */
  filters: ProspectFilters;
  /** Hand-picked prospect ids (checkboxes / per-row send) — beats filters. */
  ids?: string[] | null;
  onClose: () => void;
  /** A batch finished (any outcome mix): refresh the list. */
  onDone: () => void;
}) {
  const [templates, setTemplates] = useState<WaTemplate[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<WaTemplate | null>(null);
  // Per-placeholder value; null means "use each prospect's business name".
  const [values, setValues] = useState<Record<number, string | null>>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<BulkSendResultDTO | null>(null);
  const batchKeyRef = useRef<string | null>(null);

  // Load approved templates + audience counts whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    setError(null);
    setSelected(null);
    setValues({});
    setResult(null);
    Promise.all([
      fetch("/api/admin/whatsapp/templates").then(async (r) => {
        const j = (await r.json().catch(() => ({}))) as { templates?: WaTemplate[]; error?: string };
        if (!r.ok || !j.templates) throw new Error(j.error ?? "Failed to load templates");
        return j.templates.filter((t) => t.status === "APPROVED" && sendableBy(t));
      }),
      fetch("/api/admin/prospecting/send-template-bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ preview: true, filters, ids: ids ?? undefined }),
      }).then(async (r) => {
        const j = (await r.json().catch(() => ({}))) as Counts & { error?: string };
        if (!r.ok) throw new Error(j.error ?? "Failed to count the audience");
        return j;
      }),
    ])
      .then(([tpls, c]) => {
        if (!alive) return;
        setTemplates(tpls);
        setCounts(c);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [open, filters, ids]);

  const body = selected ? bodyOf(selected) : "";
  const slots = useMemo(() => placeholdersOf(body), [body]);

  const pick = (t: WaTemplate) => {
    setSelected(t);
    // Sensible defaults for the house templates: {{1}} greeting, {{2}} business.
    const init: Record<number, string | null> = {};
    for (const n of placeholdersOf(bodyOf(t))) init[n] = n === 2 ? null : n === 1 ? "there" : "";
    setValues(init);
  };

  const allFilled = slots.every((n) => values[n] === null || (values[n] ?? "").trim() !== "");
  const previewText = useMemo(() => {
    let text = body;
    for (const n of slots) {
      // A null slot is auto-filled per prospect at send time — show a clearly
      // dynamic placeholder, NOT a fake company name (which reads as hardcoded).
      text = text.replaceAll(`{{${n}}}`, values[n] === null ? "[their business name]" : (values[n] ?? ""));
    }
    return text;
  }, [body, slots, values]);

  const run = async () => {
    if (!selected || !allFilled || sending || !counts || counts.targeted === 0) return;
    setSending(true);
    setError(null);
    batchKeyRef.current ??= crypto.randomUUID();
    let res: Response;
    try {
      res = await fetch("/api/admin/prospecting/send-template-bulk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          filters,
          ids: ids ?? undefined,
          templateName: selected.name,
          language: selected.language,
          templateBody: body,
          params: slots.map((n) => (values[n] === null ? BUSINESS_TOKEN : (values[n] ?? "").trim())),
          batchKey: batchKeyRef.current,
        }),
      });
    } catch (e) {
      // No response — some sends may have gone out. Same batchKey on retry
      // resumes instead of double-messaging.
      setSending(false);
      setError(e instanceof Error ? `${e.message} — retrying is safe (same batch resumes)` : "Network error");
      return;
    }
    batchKeyRef.current = null;
    try {
      const j = (await res.json().catch(() => ({}))) as BulkSendResultDTO & { error?: string };
      if (!res.ok) throw new Error(j.error || `Request failed (${res.status})`);
      setResult(j);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Bulk send failed");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60" onClick={sending ? undefined : onClose} />
      <div className="relative z-10 flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 bg-[#0f1320] sm:max-w-lg sm:rounded-2xl">
        <header className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <h2 className="text-sm font-semibold text-white">
            {ids && ids.length > 0
              ? `Send template to ${ids.length} selected prospect${ids.length === 1 ? "" : "s"}`
              : "Send template to filtered prospects"}
          </h2>
          <button className="text-slate-500 hover:text-slate-300" disabled={sending} onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {loading ? <p className="text-sm text-slate-500">Loading…</p> : null}
          {error ? <p className="mb-3 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2 text-xs text-rose-200">{error}</p> : null}

          {result ? (
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-200">
              <p className="font-medium text-white">Batch finished</p>
              <p className="mt-2">✅ Sent: {result.sent}</p>
              <p>❌ Rejected by Meta: {result.failed}</p>
              <p>⏭️ Skipped (no usable number / blocked): {result.skipped}</p>
              {result.failures.length > 0 ? (
                <ul className="mt-2 space-y-1 text-xs text-slate-400">
                  {result.failures.map((f, i) => (
                    <li key={i}>• {f.name}: {f.error}</li>
                  ))}
                </ul>
              ) : null}
              <button
                className="mt-4 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/5"
                onClick={onClose}
                type="button"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {counts ? (
                <p className="mb-3 text-xs text-slate-400">
                  {counts.matching.toLocaleString()}{" "}
                  {ids && ids.length > 0 ? "of your selection have" : "match your filters with"} a number on
                  file · {counts.eligible.toLocaleString()} not messaged in 24h ·{" "}
                  <span className="text-amber-200">this batch sends to {counts.targeted}</span>
                  {counts.eligible > counts.cap ? ` (cap ${counts.cap}/batch — run again for the rest)` : ""}
                </p>
              ) : null}

              {!loading && templates.length === 0 && !error ? (
                <p className="text-sm text-slate-400">
                  No approved templates yet — Meta is still reviewing yours. Check{" "}
                  <span className="text-amber-200">/admin/templates</span>.
                </p>
              ) : null}

              <div className="space-y-2">
                {templates.map((t) => (
                  <button
                    key={`${t.name}:${t.language}`}
                    className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                      selected?.name === t.name && selected.language === t.language
                        ? "border-amber-300/40 bg-amber-300/10"
                        : "border-white/8 bg-white/[0.02] hover:bg-white/[0.05]"
                    }`}
                    onClick={() => pick(t)}
                    type="button"
                  >
                    <span className="mono text-xs font-medium text-white">{t.name}</span>
                    <span className="ml-2 rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-400">{t.language}</span>
                    <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-xs text-slate-400">{bodyOf(t)}</p>
                  </button>
                ))}
              </div>

              {selected && slots.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {slots.map((n) => (
                    <div key={n}>
                      <div className="mb-1 flex items-center justify-between">
                        <label className="text-xs text-slate-400" htmlFor={`bulk-slot-${n}`}>{`{{${n}}}`}</label>
                        <button
                          className={`rounded-full px-2 py-0.5 text-[10px] transition ${
                            values[n] === null
                              ? "bg-amber-300/15 text-amber-200"
                              : "bg-white/5 text-slate-500 hover:text-slate-300"
                          }`}
                          onClick={() => setValues((v) => ({ ...v, [n]: v[n] === null ? "" : null }))}
                          type="button"
                        >
                          {values[n] === null ? "auto: business name ✓" : "use business name"}
                        </button>
                      </div>
                      {values[n] === null ? (
                        <p className="rounded-lg border border-dashed border-amber-300/20 bg-amber-300/[0.04] px-3 py-2 text-xs text-amber-200/80">
                          Filled with each prospect&rsquo;s business name automatically.
                        </p>
                      ) : (
                        <input
                          className={INPUT}
                          id={`bulk-slot-${n}`}
                          onChange={(e) => setValues((v) => ({ ...v, [n]: e.target.value }))}
                          placeholder={`Value for {{${n}}}`}
                          value={values[n] ?? ""}
                        />
                      )}
                    </div>
                  ))}

                  <div>
                    <p className="mb-1 text-xs text-slate-500">
                      Preview — <span className="text-amber-300/80">[their business name]</span> is filled with each prospect&rsquo;s real name on send
                    </p>
                    <p className="whitespace-pre-wrap rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2 text-sm text-slate-200">
                      {previewText}
                    </p>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        {!result ? (
          <footer className="border-t border-white/8 px-4 py-3">
            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-300/90 px-4 py-2 text-sm font-semibold text-[#0b0e17] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!selected || !allFilled || sending || !counts || counts.targeted === 0}
              onClick={() => void run()}
              type="button"
            >
              <Send className="h-4 w-4" />
              {sending
                ? "Sending…"
                : counts && counts.targeted > 0
                  ? `Send to ${counts.targeted} prospect${counts.targeted === 1 ? "" : "s"}`
                  : "Nothing to send"}
            </button>
          </footer>
        ) : null}
      </div>
    </div>
  );
}
