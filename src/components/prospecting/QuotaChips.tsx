"use client";

import type { QuotaDTO } from "./types";

/** Monthly free-tier usage chips ("Searches 12/1000") with a thin progress bar. */
export function QuotaChips({ quotas }: { quotas: QuotaDTO[] }) {
  if (quotas.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {quotas.map((q) => {
        const hot = q.percentage >= 80;
        return (
          <div
            key={q.method}
            className="min-w-[132px] rounded-xl border border-white/10 bg-white/[0.02] px-3 py-1.5"
            title={`Resets ${new Date(q.resetsAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`}
          >
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[11px] text-slate-400">{q.label}</span>
              <span className={`text-[11px] tabular-nums ${hot ? "text-amber-200" : "text-slate-300"}`}>
                {q.used.toLocaleString()}/{q.cap.toLocaleString()}
              </span>
            </div>
            <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full ${hot ? "bg-amber-300" : "bg-emerald-400/70"}`}
                style={{ width: `${Math.min(100, q.percentage)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
