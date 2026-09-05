"use client";

import { ExternalLink, MessageSquare, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { TemplatePicker, type TemplateSelection } from "@/components/whatsapp/TemplatePicker";
import { formatWhen } from "@/lib/crm/format";
import { flagEmoji } from "@/lib/prospecting/countries";
import { scoreTier } from "@/lib/prospecting/score";
import type { ProspectDTO } from "./types";

const STATUS_STYLE: Record<ProspectDTO["status"], string> = {
  pending: "bg-white/5 text-slate-400",
  enriched: "bg-emerald-500/15 text-emerald-300",
  failed: "bg-rose-500/15 text-rose-300",
};

const TIER_STYLE: Record<ReturnType<typeof scoreTier>, string> = {
  high: "bg-emerald-500/15 text-emerald-300",
  medium: "bg-amber-400/15 text-amber-200",
  low: "bg-white/5 text-slate-400",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <span className="shrink-0 text-xs text-slate-500">{label}</span>
      <span className="min-w-0 text-right text-sm text-slate-200">{children}</span>
    </div>
  );
}

/**
 * Right-hand detail panel for one prospect (full-screen sheet on mobile).
 * Actions: enrich this one prospect, or send an approved WhatsApp template —
 * which links/creates a CRM contact server-side.
 */
export function ProspectDrawer({
  prospect,
  onClose,
  onEnrichNow,
  onTemplateSent,
}: {
  prospect: ProspectDTO;
  onClose: () => void;
  /** Runs the single-prospect enrich; parent toasts + refreshes. */
  onEnrichNow: (id: string) => Promise<void>;
  /** A template was sent: parent bumps the sent count and refreshes the row. */
  onTemplateSent: (id: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [sentOk, setSentOk] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const waDigits = (prospect.whatsapp ?? prospect.phone ?? "").replace(/\D/g, "");
  const tier = scoreTier(prospect.score);

  const enrichNow = async () => {
    setEnriching(true);
    try {
      await onEnrichNow(prospect.id);
    } finally {
      setEnriching(false);
    }
  };

  const sendSelection = async (sel: TemplateSelection) => {
    setSendError(null);
    try {
      const res = await fetch(`/api/admin/prospecting/prospects/${prospect.id}/send-template`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...sel, idempotencyKey: crypto.randomUUID() }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(j.error || `Send failed (${res.status})`);
      setSentOk(true);
      onTemplateSent(prospect.id);
    } catch (e) {
      setSendError(e instanceof Error ? e.message : "Send failed");
    } finally {
      setPickerOpen(false);
    }
  };

  const linkCls = "inline-flex items-center gap-1 text-amber-200 hover:text-amber-100";

  return (
    <>
      {/* Backdrop (desktop only visual; click closes everywhere) */}
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <aside className="fixed inset-0 z-40 flex flex-col overflow-hidden bg-[#0f1320] sm:inset-y-0 sm:left-auto sm:right-0 sm:w-[420px] sm:border-l sm:border-white/10">
        <header className="flex items-start justify-between gap-3 border-b border-white/8 px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white">{prospect.name}</h2>
            <p className="truncate text-xs text-slate-500">
              {prospect.niche} · {flagEmoji(prospect.countryCode)} {prospect.countryName}
              {prospect.city ? ` · ${prospect.city}` : ""}
            </p>
          </div>
          <button className="mt-0.5 text-slate-500 hover:text-slate-300" onClick={onClose} type="button">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] ${STATUS_STYLE[prospect.status]}`}>
              {prospect.status}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[11px] ${TIER_STYLE[tier]}`}>
              score {prospect.score} · {tier}
            </span>
            {prospect.rating != null ? (
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-slate-300">
                {prospect.rating.toFixed(1)} ★{prospect.reviews != null ? ` (${prospect.reviews.toLocaleString()})` : ""}
              </span>
            ) : null}
          </div>

          {sentOk ? (
            <p className="mt-3 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-2 text-xs text-emerald-300">
              Sent ✓
            </p>
          ) : null}
          {sendError ? (
            <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2 text-xs text-rose-200">
              {sendError}
            </p>
          ) : null}

          {prospect.contactId ? (
            <Link
              className={`mt-3 inline-flex items-center gap-1.5 text-sm ${linkCls}`}
              href={`/admin/inbox?c=${prospect.contactId}`}
            >
              <MessageSquare className="h-3.5 w-3.5" /> Open conversation
            </Link>
          ) : null}

          {/* Contact channels */}
          <div className="mt-4 divide-y divide-white/5 rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-1">
            <Row label="Phone">
              {prospect.phone ? (
                <a className={linkCls} href={`tel:${prospect.phone}`}>{prospect.phone}</a>
              ) : (
                "—"
              )}
            </Row>
            <Row label="WhatsApp">
              {waDigits.length >= 8 ? (
                <a className={linkCls} href={`https://wa.me/${waDigits}`} rel="noreferrer" target="_blank">
                  wa.me/{waDigits} <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                "—"
              )}
            </Row>
            <Row label="Website">
              {prospect.website ? (
                <a className={`${linkCls} max-w-[220px] truncate`} href={prospect.website} rel="noreferrer" target="_blank">
                  {prospect.website.replace(/^https?:\/\//, "")} <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                "—"
              )}
            </Row>
            <Row label="Email">
              {prospect.email ? (
                <a className={linkCls} href={`mailto:${prospect.email}`}>{prospect.email}</a>
              ) : (
                "—"
              )}
            </Row>
            {prospect.linkedin || prospect.facebook || prospect.instagram ? (
              <Row label="Social">
                <span className="flex flex-wrap justify-end gap-2">
                  {prospect.linkedin ? (
                    <a className={linkCls} href={prospect.linkedin} rel="noreferrer" target="_blank">LinkedIn</a>
                  ) : null}
                  {prospect.facebook ? (
                    <a className={linkCls} href={prospect.facebook} rel="noreferrer" target="_blank">Facebook</a>
                  ) : null}
                  {prospect.instagram ? (
                    <a className={linkCls} href={prospect.instagram} rel="noreferrer" target="_blank">Instagram</a>
                  ) : null}
                </span>
              </Row>
            ) : null}
          </div>

          {/* Business details */}
          <div className="mt-3 divide-y divide-white/5 rounded-2xl border border-white/8 bg-white/[0.02] px-3 py-1">
            <Row label="Address">{prospect.address ?? "—"}</Row>
            <Row label="Hours">
              {prospect.hours ? (
                <span className="whitespace-pre-wrap text-xs">{prospect.hours}</span>
              ) : (
                "—"
              )}
            </Row>
            <Row label="Enriched">{prospect.enriched ? "Yes" : "No"}</Row>
            <Row label="Templates sent">
              {prospect.templateSendCount > 0
                ? `${prospect.templateSendCount} · last ${formatWhen(new Date(prospect.lastTemplateSentAt ?? prospect.updatedAt))}`
                : "—"}
            </Row>
            <Row label="Added">{formatWhen(new Date(prospect.createdAt))}</Row>
          </div>
        </div>

        {/* Actions */}
        <footer className="flex gap-2 border-t border-white/8 px-4 py-3">
          <button
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:bg-white/[0.05] disabled:opacity-50"
            disabled={enriching}
            onClick={() => void enrichNow()}
            type="button"
          >
            <Sparkles className="h-4 w-4 text-amber-300" /> {enriching ? "Enriching…" : "Enrich now"}
          </button>
          <button
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
            onClick={() => setPickerOpen(true)}
            type="button"
          >
            <MessageSquare className="h-4 w-4" /> Send template
          </button>
        </footer>
      </aside>

      <TemplatePicker
        defaults={{ contactName: "there", businessName: prospect.name }}
        onClose={() => setPickerOpen(false)}
        onSend={sendSelection}
        open={pickerOpen}
      />
    </>
  );
}
