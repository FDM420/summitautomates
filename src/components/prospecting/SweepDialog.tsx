"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { COUNTRY_OPTIONS } from "@/lib/prospecting/countries";

const MAX_RESULTS_CAP = 200;

/**
 * "New sweep" modal: niche + country (+ optional city / all-major-cities) →
 * POST /api/admin/prospecting/sweeps. The sweep itself runs server-side after
 * the 202; the SweepsStrip polls its progress.
 */
export function SweepDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  /** Called after a 202 so the parent can refresh the sweeps strip. */
  onCreated: () => void;
}) {
  const [niche, setNiche] = useState("");
  const [countryCode, setCountryCode] = useState("AE");
  const [city, setCity] = useState("");
  const [allCities, setAllCities] = useState(false);
  const [max, setMax] = useState(60);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const submit = async () => {
    if (!niche.trim() || !countryCode) {
      setError("Niche and country are required.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/prospecting/sweeps", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          niche: niche.trim(),
          countryCode,
          max: Math.min(MAX_RESULTS_CAP, Math.max(1, Math.round(max) || 60)),
          ...(city.trim() ? { city: city.trim() } : {}),
          ...(allCities && !city.trim() ? { allCities: true } : {}),
        }),
      });
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(j.error || `Request failed (${res.status})`);
      setNiche("");
      setCity("");
      setAllCities(false);
      setMax(60);
      onCreated();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start sweep");
    } finally {
      setSubmitting(false);
    }
  };

  const field =
    "w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-400/40 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1320] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">New sweep</h2>
          <button className="text-slate-500 hover:text-slate-300" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Searches the data provider for businesses in a niche and saves them as prospects.
        </p>

        <div className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wide text-slate-500">Niche</label>
            <input
              autoFocus
              className={field}
              onChange={(e) => setNiche(e.target.value)}
              placeholder="e.g. real estate agency"
              value={niche}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] uppercase tracking-wide text-slate-500">Country</label>
            <select
              className={`${field} bg-[#0f1320]`}
              onChange={(e) => setCountryCode(e.target.value)}
              value={countryCode}
            >
              {COUNTRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wide text-slate-500">
                City <span className="normal-case text-slate-600">(optional)</span>
              </label>
              <input
                className={field}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Dubai"
                value={city}
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] uppercase tracking-wide text-slate-500">Max results</label>
              <input
                className={field}
                max={MAX_RESULTS_CAP}
                min={1}
                onChange={(e) => setMax(Number(e.target.value))}
                type="number"
                value={max}
              />
            </div>
          </div>
          <label
            className={`flex items-center gap-2 text-sm ${city.trim() ? "text-slate-600" : "text-slate-300"}`}
          >
            <input
              checked={allCities && !city.trim()}
              className="h-4 w-4 rounded border-white/20 bg-white/5 accent-amber-300"
              disabled={Boolean(city.trim())}
              onChange={(e) => setAllCities(e.target.checked)}
              type="checkbox"
            />
            Sweep all major cities{city.trim() ? " (clear city first)" : ""}
          </label>
        </div>

        {error ? (
          <p className="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.04]"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:opacity-50"
            disabled={submitting || !niche.trim()}
            onClick={() => void submit()}
            type="button"
          >
            {submitting ? "Starting…" : "Start sweep"}
          </button>
        </div>
      </div>
    </div>
  );
}
