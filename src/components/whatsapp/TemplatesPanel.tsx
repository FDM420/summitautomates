"use client";

import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type TemplateButton = { type: string; text?: string; url?: string; phone_number?: string };
type TemplateComponent = { type: string; format?: string; text?: string; buttons?: TemplateButton[] };
type WaTemplate = {
  id?: string;
  name: string;
  status: string;
  category: string;
  language: string;
  components?: TemplateComponent[];
  rejected_reason?: string;
  quality_score?: { score?: string };
};

const STATUS_STYLE: Record<string, string> = {
  APPROVED: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  PENDING: "bg-amber-400/15 text-amber-200 border-amber-400/30",
  IN_APPEAL: "bg-amber-400/15 text-amber-200 border-amber-400/30",
  PENDING_DELETION: "bg-amber-400/15 text-amber-200 border-amber-400/30",
  REJECTED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  DISABLED: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  PAUSED: "bg-orange-500/15 text-orange-300 border-orange-500/30",
};
const statusStyle = (s: string) => STATUS_STYLE[s] ?? "bg-white/5 text-slate-300 border-white/10";

function component(t: WaTemplate, type: string) {
  return t.components?.find((c) => c.type?.toUpperCase() === type);
}
function bodyText(t: WaTemplate) {
  return component(t, "BODY")?.text ?? "";
}
function humanReason(reason?: string) {
  if (!reason || reason === "NONE") return null;
  return reason.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase());
}

export function TemplatesPanel() {
  const [templates, setTemplates] = useState<WaTemplate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/whatsapp/templates");
      const j = (await r.json()) as { templates?: WaTemplate[]; error?: string };
      if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
      setTemplates(j.templates ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const t of templates ?? []) m.set(t.status, (m.get(t.status) ?? 0) + 1);
    return m;
  }, [templates]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (templates ?? [])
      .filter((t) => statusFilter === "ALL" || t.status === statusFilter)
      .filter((t) => !q || t.name.toLowerCase().includes(q) || bodyText(t).toLowerCase().includes(q))
      .sort((a, b) => a.status.localeCompare(b.status) || a.name.localeCompare(b.name));
  }, [templates, statusFilter, search]);

  const total = templates?.length ?? 0;
  const statuses = ["ALL", ...Array.from(counts.keys()).sort()];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Templates</h1>
          <p className="mt-1 text-sm text-slate-400">
            Live approval status from Meta{typeof total === "number" ? ` · ${total} total` : ""}
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.06] disabled:opacity-50"
          disabled={loading}
          onClick={() => void load()}
          type="button"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {/* Status filter / summary chips */}
      {templates && total > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {statuses.map((s) => {
            const n = s === "ALL" ? total : counts.get(s) ?? 0;
            const on = statusFilter === s;
            return (
              <button
                key={s}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  on ? statusStyle(s === "ALL" ? "" : s) : "border-white/10 bg-white/[0.02] text-slate-400 hover:text-slate-200"
                }`}
                onClick={() => setStatusFilter(s)}
                type="button"
              >
                {s === "ALL" ? "All" : s.replace(/_/g, " ").toLowerCase()} · {n}
              </button>
            );
          })}
        </div>
      ) : null}

      {templates && total > 0 ? (
        <input
          className="mt-4 w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-400/40 focus:outline-none"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or message text…"
          value={search}
        />
      ) : null}

      {/* States */}
      {loading && !templates ? (
        <p className="mt-10 text-sm text-slate-500">Loading templates from Meta…</p>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-2xl border border-rose-500/30 bg-rose-500/[0.06] p-6">
          <p className="text-sm font-medium text-rose-200">Couldn’t load templates</p>
          <p className="mt-1 text-xs text-rose-300/80">{error}</p>
          <button
            className="mt-4 rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-100 hover:bg-rose-500/10"
            onClick={() => void load()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : null}

      {templates && total === 0 && !error ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-slate-300">No templates on this WhatsApp account yet.</p>
          <p className="mt-1 text-xs text-slate-500">Submitted templates appear here with their approval status.</p>
        </div>
      ) : null}

      {templates && total > 0 ? (
        <ul className="mt-6 space-y-3">
          {filtered.map((t) => {
            const reason = humanReason(t.rejected_reason);
            const header = component(t, "HEADER");
            const footer = component(t, "FOOTER");
            const buttons = component(t, "BUTTONS")?.buttons ?? [];
            return (
              <li
                key={`${t.name}:${t.language}`}
                className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="mono text-sm font-medium text-white">{t.name}</span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-400">
                      {t.category}
                    </span>
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
                      {t.language}
                    </span>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-[11px] ${statusStyle(t.status)}`}>
                    {t.status.replace(/_/g, " ").toLowerCase()}
                  </span>
                </div>

                {header?.format && header.format !== "TEXT" ? (
                  <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-500">
                    Header: {header.format.toLowerCase()}
                  </p>
                ) : header?.text ? (
                  <p className="mt-2 text-sm font-medium text-slate-200">{header.text}</p>
                ) : null}

                {bodyText(t) ? (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{bodyText(t)}</p>
                ) : null}

                {footer?.text ? <p className="mt-2 text-xs text-slate-500">{footer.text}</p> : null}

                {buttons.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {buttons.map((b, i) => (
                      <span
                        key={`${b.text}-${i}`}
                        className="rounded-lg border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs text-slate-300"
                      >
                        {b.text || b.type}
                      </span>
                    ))}
                  </div>
                ) : null}

                {reason ? (
                  <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2 text-xs text-rose-200">
                    Rejected: {reason}
                  </p>
                ) : null}
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-6 text-center text-sm text-slate-500">
              No templates match this filter.
            </li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
