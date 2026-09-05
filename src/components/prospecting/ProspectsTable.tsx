"use client";

import { Send } from "lucide-react";
import { flagEmoji } from "@/lib/prospecting/countries";
import { scoreTier } from "@/lib/prospecting/score";
import type { ProspectDTO } from "./types";

const STATUS_STYLE: Record<ProspectDTO["status"], string> = {
  pending: "bg-white/5 text-slate-400",
  enriched: "bg-emerald-500/15 text-emerald-300",
  failed: "bg-rose-500/15 text-rose-300",
};

const TIER_STYLE: Record<ReturnType<typeof scoreTier>, string> = {
  high: "text-emerald-300",
  medium: "text-amber-200",
  low: "text-slate-400",
};

const CHECKBOX =
  "h-4 w-4 cursor-pointer rounded border-white/20 bg-transparent accent-amber-300";

/**
 * Dense prospects table with per-row selection (checkboxes) and a per-row
 * "send template" quick action. Horizontal overflow scrolls inside this
 * container so the page itself never scrolls sideways on mobile.
 */
export function ProspectsTable({
  items,
  selected,
  onSelect,
  onToggle,
  onTogglePage,
  onSendOne,
}: {
  items: ProspectDTO[];
  /** Ids currently ticked (persists across pages). */
  selected: Set<string>;
  onSelect: (p: ProspectDTO) => void;
  onToggle: (id: string) => void;
  /** Tick/untick every row on this page. */
  onTogglePage: (ids: string[], on: boolean) => void;
  /** Per-row quick action: open the template sender for just this prospect. */
  onSendOne: (p: ProspectDTO) => void;
}) {
  const pageIds = items.map((p) => p.id);
  const allOn = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.02]">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/8 text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2">
              <input
                aria-label="Select all on this page"
                checked={allOn}
                className={CHECKBOX}
                onChange={() => onTogglePage(pageIds, !allOn)}
                type="checkbox"
              />
            </th>
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Country</th>
            <th className="px-3 py-2 font-medium">Niche</th>
            <th className="px-3 py-2 font-medium">Rating</th>
            <th className="px-3 py-2 font-medium">Phone</th>
            <th className="px-3 py-2 text-right font-medium">Score</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 text-right font-medium">Sent</th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {items.map((p) => {
            const contactable = Boolean(p.whatsapp || p.phone);
            return (
              <tr
                key={p.id}
                className="cursor-pointer border-b border-white/5 transition last:border-b-0 hover:bg-white/[0.04]"
                onClick={() => onSelect(p)}
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    aria-label={`Select ${p.name}`}
                    checked={selected.has(p.id)}
                    className={CHECKBOX}
                    onChange={() => onToggle(p.id)}
                    type="checkbox"
                  />
                </td>
                <td className="px-3 py-2">
                  <p className="max-w-[220px] truncate font-medium text-white">{p.name}</p>
                  {p.city ? <p className="text-xs text-slate-500">{p.city}</p> : null}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-300" title={p.countryName}>
                  {flagEmoji(p.countryCode)} {p.countryCode}
                </td>
                <td className="max-w-[160px] truncate px-3 py-2 text-slate-400">{p.niche}</td>
                <td className="whitespace-nowrap px-3 py-2 text-slate-300">
                  {p.rating != null ? (
                    <>
                      {p.rating.toFixed(1)} <span className="text-amber-300">★</span>
                      {p.reviews != null ? (
                        <span className="text-slate-500"> ({p.reviews.toLocaleString()})</span>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-2 text-xs text-slate-400">
                  {p.phone ?? <span className="text-slate-600">—</span>}
                </td>
                <td className={`px-3 py-2 text-right font-semibold tabular-nums ${TIER_STYLE[scoreTier(p.score)]}`}>
                  {p.score}
                </td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] ${STATUS_STYLE[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-400">
                  {p.templateSendCount > 0 ? p.templateSendCount : <span className="text-slate-600">—</span>}
                </td>
                <td className="px-3 py-2 text-right" onClick={(e) => e.stopPropagation()}>
                  <button
                    aria-label={`Send template to ${p.name}`}
                    className="rounded-lg p-1.5 text-emerald-300/80 transition hover:bg-emerald-500/10 hover:text-emerald-200 disabled:cursor-not-allowed disabled:text-slate-700"
                    disabled={!contactable}
                    onClick={() => onSendOne(p)}
                    title={contactable ? "Send template" : "No number on file — enrich first"}
                    type="button"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
