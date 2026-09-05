"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flagEmoji } from "@/lib/prospecting/countries";
import type { SweepDTO } from "./types";

const POLL_MS = 5000;

const STATUS_STYLE: Record<SweepDTO["status"], string> = {
  queued: "bg-white/5 text-slate-400",
  running: "bg-amber-400/15 text-amber-200 animate-pulse",
  done: "bg-emerald-500/15 text-emerald-300",
  failed: "bg-rose-500/15 text-rose-300",
};

/**
 * Horizontal strip of recent sweeps. Owns its own fetching: polls every 5s
 * while any sweep is queued/running, stops otherwise, and tells the parent
 * when a sweep finishes so the prospects list can refresh.
 */
export function SweepsStrip({
  refreshKey,
  onSweepDone,
}: {
  /** Bump to force an immediate reload (e.g. right after creating a sweep). */
  refreshKey: number;
  /** A sweep transitioned to "done" — refresh prospects/facets/quota. */
  onSweepDone: () => void;
}) {
  const [sweeps, setSweeps] = useState<SweepDTO[]>([]);
  const statusById = useRef<Map<string, SweepDTO["status"]>>(new Map());

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/prospecting/sweeps");
      const j = (await r.json()) as { sweeps?: SweepDTO[] };
      if (!j.sweeps) return;
      const finished = j.sweeps.some((s) => {
        const prev = statusById.current.get(s.id);
        return s.status === "done" && (prev === "queued" || prev === "running");
      });
      statusById.current = new Map(j.sweeps.map((s) => [s.id, s.status]));
      setSweeps(j.sweeps);
      if (finished) onSweepDone();
    } catch {
      /* ignore */
    }
  }, [onSweepDone]);

  // Load on mount / refreshKey, then poll only while something is in flight.
  useEffect(() => {
    void load();
  }, [load, refreshKey]);
  const anyActive = sweeps.some((s) => s.status === "queued" || s.status === "running");
  useEffect(() => {
    if (!anyActive) return;
    const i = setInterval(() => {
      if (!document.hidden) void load();
    }, POLL_MS);
    return () => clearInterval(i);
  }, [anyActive, load]);

  if (sweeps.length === 0) return null;

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1">
      {sweeps.map((s) => (
        <div
          key={s.id}
          className="flex shrink-0 items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-1.5"
          title={s.error ?? `${s.niche} · ${s.countryName}${s.city ? ` · ${s.city}` : s.allCities ? " · all cities" : ""}`}
        >
          <span className="max-w-[160px] truncate text-xs text-slate-200">{s.niche}</span>
          <span className="text-xs text-slate-500">{flagEmoji(s.countryCode)} {s.countryCode}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] ${STATUS_STYLE[s.status]}`}>{s.status}</span>
          {s.status === "done" ? (
            <span className="text-[11px] tabular-nums text-slate-400">+{s.found}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
