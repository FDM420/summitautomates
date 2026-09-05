"use client";

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

/**
 * Dense prospects table. Horizontal overflow scrolls inside this container so
 * the page itself never scrolls sideways on mobile.
 */
export function ProspectsTable({
  items,
  onSelect,
}: {
  items: ProspectDTO[];
  onSelect: (p: ProspectDTO) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-white/8 bg-white/[0.02]">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-white/8 text-[11px] uppercase tracking-wide text-slate-500">
            <th className="px-3 py-2 font-medium">Name</th>
            <th className="px-3 py-2 font-medium">Country</th>
            <th className="px-3 py-2 font-medium">Niche</th>
            <th className="px-3 py-2 font-medium">Rating</th>
            <th className="px-3 py-2 font-medium">Phone</th>
            <th className="px-3 py-2 text-right font-medium">Score</th>
            <th className="px-3 py-2 font-medium">Status</th>
            <th className="px-3 py-2 text-right font-medium">Sent</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr
              key={p.id}
              className="cursor-pointer border-b border-white/5 transition last:border-b-0 hover:bg-white/[0.04]"
              onClick={() => onSelect(p)}
            >
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
