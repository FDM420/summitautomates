"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { flagEmoji } from "@/lib/prospecting/countries";
import type { SweepDTO } from "./types";

const POLL_MS = 5000;

const SELECT =
  "max-w-full rounded-lg border border-white/10 bg-[#0f1320] px-2 py-1.5 text-xs text-slate-200 focus:border-amber-400/40 focus:outline-none";

function sweepLabel(s: SweepDTO): string {
  const where = s.city ? ` · ${s.city}` : s.allCities ? " · all cities" : "";
  const status = s.status === "done" ? `+${s.found}` : s.status;
  return `${s.niche} · ${s.countryCode}${where} · ${status}`;
}

/**
 * Sweep history as a dropdown: pick a past sweep to load ALL of its data —
 * the parent applies the sweep's niche/country/city as table filters. Owns its
 * own fetching: polls every 5s while a sweep is queued/running (showing a live
 * progress chip), and tells the parent when one finishes so the list refreshes.
 */
export function SweepsStrip({
  refreshKey,
  onSweepDone,
  onSelectSweep,
}: {
  /** Bump to force an immediate reload (e.g. right after creating a sweep). */
  refreshKey: number;
  /** A sweep transitioned to "done" — refresh prospects/facets/quota. */
  onSweepDone: () => void;
  /** A sweep was picked (null = "all prospects"): filter the table to it. */
  onSelectSweep: (sweep: SweepDTO | null) => void;
}) {
  const [sweeps, setSweeps] = useState<SweepDTO[]>([]);
  const [selectedId, setSelectedId] = useState("");
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
  const active = sweeps.find((s) => s.status === "queued" || s.status === "running");
  useEffect(() => {
    if (!active) return;
    const i = setInterval(() => {
      if (!document.hidden) void load();
    }, POLL_MS);
    return () => clearInterval(i);
  }, [active, load]);

  if (sweeps.length === 0) return null;

  const selected = sweeps.find((s) => s.id === selectedId);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className="text-[11px] uppercase tracking-wide text-slate-500" htmlFor="sweep-picker">
        Sweep
      </label>
      <select
        className={SELECT}
        id="sweep-picker"
        onChange={(e) => {
          const id = e.target.value;
          setSelectedId(id);
          onSelectSweep(sweeps.find((s) => s.id === id) ?? null);
        }}
        value={selectedId}
      >
        <option value="">All prospects</option>
        {sweeps.map((s) => (
          <option key={s.id} value={s.id}>
            {sweepLabel(s)}
          </option>
        ))}
      </select>

      {selected ? (
        <span className="text-[11px] text-slate-500">
          {flagEmoji(selected.countryCode)} {selected.countryName}
          {selected.status === "failed" && selected.error ? ` — ${selected.error}` : ""}
        </span>
      ) : null}

      {active ? (
        <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1 text-[11px] text-amber-200">
          {active.niche} · {active.countryCode} running… +{active.found}
        </span>
      ) : null}
    </div>
  );
}
