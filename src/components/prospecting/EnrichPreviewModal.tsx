"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { EnrichPreviewDTO, EnrichResultDTO, ProspectFilters } from "./types";

/**
 * "Enrich filtered" confirmation: previews how many matching prospects would
 * be enriched against the remaining detail-lookup quota, runs the batch, then
 * shows the outcome.
 */
export function EnrichPreviewModal({
  open,
  filters,
  onClose,
  onDone,
}: {
  open: boolean;
  filters: ProspectFilters;
  onClose: () => void;
  /** Called after a batch ran (success or partial) so the parent refreshes list + quota. */
  onDone: () => void;
}) {
  const [preview, setPreview] = useState<EnrichPreviewDTO | null>(null);
  const [result, setResult] = useState<EnrichResultDTO | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fresh preview each time the modal opens.
  useEffect(() => {
    if (!open) return;
    setPreview(null);
    setResult(null);
    setError(null);
    let alive = true;
    fetch("/api/admin/prospecting/enrich/preview", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ filters }),
    })
      .then(async (r) => {
        const j = (await r.json()) as EnrichPreviewDTO & { error?: string };
        if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
        if (alive) setPreview(j);
      })
      .catch((e) => {
        if (alive) setError(e instanceof Error ? e.message : "Failed to preview");
      });
    return () => {
      alive = false;
    };
  }, [open, filters]);

  if (!open) return null;

  const run = async () => {
    setRunning(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/prospecting/enrich", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // Same limit the preview used — the modal must never promise 50 and run 100.
        body: JSON.stringify({ filters, limit: 50 }),
      });
      const j = (await r.json()) as EnrichResultDTO & { error?: string };
      if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
      setResult(j);
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Enrichment failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1320] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">Enrich filtered prospects</h2>
          <button className="text-slate-500 hover:text-slate-300" onClick={onClose} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>

        {error ? (
          <p className="mt-4 rounded-lg border border-rose-500/20 bg-rose-500/[0.06] px-3 py-2 text-xs text-rose-200">
            {error}
          </p>
        ) : null}

        {result ? (
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>
              Enriched <span className="font-semibold text-emerald-300">{result.enriched}</span>
              {result.failed > 0 ? (
                <>
                  {" · "}
                  <span className="text-rose-300">{result.failed} failed</span>
                </>
              ) : null}
              .
            </p>
            {result.quotaHit ? (
              <p className="rounded-lg border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs text-amber-200">
                The monthly detail-lookup quota ran out before all matches were processed.
              </p>
            ) : null}
          </div>
        ) : !preview && !error ? (
          <p className="mt-4 text-sm text-slate-500">Checking matches and quota…</p>
        ) : preview ? (
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <p>
              <span className="font-semibold text-white">{preview.matching.toLocaleString()}</span>{" "}
              matching {preview.matching === 1 ? "prospect isn't" : "prospects aren't"} enriched yet.
            </p>
            <p>
              <span className="font-semibold text-white">{preview.quotaRemaining.toLocaleString()}</span>{" "}
              detail lookups remain this month — this run will enrich{" "}
              <span className="font-semibold text-amber-200">{preview.planned.toLocaleString()}</span>.
            </p>
            {preview.willStopEarly ? (
              <p className="rounded-lg border border-amber-300/20 bg-amber-300/5 px-3 py-2 text-xs text-amber-200">
                Not everything fits in this run — it will stop early. Run again later for the rest.
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.04]"
            onClick={onClose}
            type="button"
          >
            {result ? "Close" : "Cancel"}
          </button>
          {!result ? (
            <button
              className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200 disabled:opacity-50"
              disabled={running || !preview || preview.planned === 0}
              onClick={() => void run()}
              type="button"
            >
              {running ? "Enriching…" : `Enrich ${preview?.planned ?? 0}`}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
