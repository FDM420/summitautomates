"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BulkTemplateModal } from "./BulkTemplateModal";
import { EnrichPreviewModal } from "./EnrichPreviewModal";
import { FilterBar } from "./FilterBar";
import { ProspectDrawer } from "./ProspectDrawer";
import { ProspectsTable } from "./ProspectsTable";
import { QuotaChips } from "./QuotaChips";
import { SweepDialog } from "./SweepDialog";
import { SweepsStrip } from "./SweepsStrip";
import type {
  EnrichResultDTO,
  FacetsDTO,
  ProspectDTO,
  ProspectFilters,
  QuotaDTO,
  SweepDTO,
} from "./types";

const PAGE_SIZE = 50;

function filtersToParams(f: ProspectFilters): URLSearchParams {
  const q = new URLSearchParams();
  if (f.q) q.set("q", f.q);
  if (f.countryCode) q.set("countryCode", f.countryCode);
  if (f.niche) q.set("niche", f.niche);
  if (f.city) q.set("city", f.city);
  if (f.minRating != null) q.set("minRating", String(f.minRating));
  if (f.minReviews != null) q.set("minReviews", String(f.minReviews));
  if (f.enrichment && f.enrichment !== "all") q.set("enrichment", f.enrichment);
  if (f.contactable) q.set("contact", f.contactable);
  if (f.sort) q.set("sort", f.sort);
  return q;
}

/** Full Prospects page: sweeps + quota + filterable table + detail drawer. */
export function ProspectsApp() {
  const [filters, setFilters] = useState<ProspectFilters>({});
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<ProspectDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quotas, setQuotas] = useState<QuotaDTO[]>([]);
  const [facets, setFacets] = useState<FacetsDTO | null>(null);
  const [selected, setSelected] = useState<ProspectDTO | null>(null);
  const [sweepOpen, setSweepOpen] = useState(false);
  const [enrichOpen, setEnrichOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [sweepsRefreshKey, setSweepsRefreshKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  // Monotonic fetch id: a slow older response must never overwrite a newer one.
  const fetchSeq = useRef(0);

  const loadProspects = useCallback(async () => {
    const seq = ++fetchSeq.current;
    const q = filtersToParams(filters);
    q.set("page", String(page));
    q.set("pageSize", String(PAGE_SIZE));
    try {
      const r = await fetch(`/api/admin/prospecting/prospects?${q}`);
      const j = (await r.json()) as { items?: ProspectDTO[]; total?: number; error?: string };
      if (seq !== fetchSeq.current) return; // superseded by a newer fetch
      if (!r.ok || !j.items) throw new Error(j.error || `Request failed (${r.status})`);
      setItems(j.items);
      setTotal(j.total ?? 0);
      setListError(null);
    } catch (e) {
      if (seq !== fetchSeq.current) return;
      setListError(e instanceof Error ? e.message : "Failed to load prospects");
    } finally {
      if (seq === fetchSeq.current) setLoading(false);
    }
  }, [filters, page]);

  const loadFacets = useCallback(async () => {
    const q = filters.countryCode ? `?countryCode=${encodeURIComponent(filters.countryCode)}` : "";
    try {
      const r = await fetch(`/api/admin/prospecting/prospects/facets${q}`);
      const j = (await r.json()) as FacetsDTO;
      if (j.niches) setFacets(j);
    } catch {
      /* ignore */
    }
  }, [filters.countryCode]);

  const loadQuota = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/prospecting/quota");
      const j = (await r.json()) as { quotas?: QuotaDTO[] };
      if (j.quotas) setQuotas(j.quotas);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void loadProspects();
  }, [loadProspects]);
  useEffect(() => {
    void loadFacets();
  }, [loadFacets]);
  useEffect(() => {
    void loadQuota();
  }, [loadQuota]);

  // Keep the open drawer in sync with refreshed rows.
  useEffect(() => {
    setSelected((prev) => {
      if (!prev) return prev;
      return items.find((p) => p.id === prev.id) ?? prev;
    });
  }, [items]);

  // Ephemeral toast.
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const onFiltersChange = useCallback((next: ProspectFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  /** Sweep dropdown: load that sweep's full data (its niche/country/city). */
  const onSelectSweep = useCallback((sweep: SweepDTO | null) => {
    setFilters((prev) =>
      sweep
        ? {
            ...prev,
            niche: sweep.niche,
            countryCode: sweep.countryCode,
            city: sweep.city ?? undefined,
            q: undefined,
          }
        : { ...prev, niche: undefined, countryCode: undefined, city: undefined },
    );
    setPage(1);
  }, []);

  /** A sweep finished server-side: new rows + facets + spent quota. */
  const onSweepDone = useCallback(() => {
    void loadProspects();
    void loadFacets();
    void loadQuota();
  }, [loadProspects, loadFacets, loadQuota]);

  /** Single-prospect enrich from the drawer. */
  const enrichOne = useCallback(
    async (id: string) => {
      try {
        const r = await fetch("/api/admin/prospecting/enrich", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ids: [id] }),
        });
        const j = (await r.json().catch(() => ({}))) as EnrichResultDTO & { error?: string };
        if (!r.ok) {
          setToast(j.error ?? "Enrichment failed");
          return;
        }
        setToast(
          j.quotaHit
            ? "Detail-lookup quota reached for this month."
            : j.enriched > 0
              ? "Prospect enriched ✓"
              : "Enrichment failed for this prospect.",
        );
        void loadProspects();
        void loadQuota();
      } catch {
        setToast("Network error");
      }
    },
    [loadProspects, loadQuota],
  );

  /** Template sent from the drawer: bump locally, then pull server truth (contactId). */
  const onTemplateSent = useCallback(
    (id: string) => {
      const nowIso = new Date().toISOString();
      setItems((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, templateSendCount: p.templateSendCount + 1, lastTemplateSentAt: nowIso }
            : p,
        ),
      );
      void loadProspects();
    },
    [loadProspects],
  );

  const hasActiveFilters = Boolean(
    filters.q ||
      filters.countryCode ||
      filters.niche ||
      filters.city ||
      filters.minRating != null ||
      filters.minReviews != null ||
      (filters.enrichment && filters.enrichment !== "all"),
  );

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(total, page * PAGE_SIZE);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Prospects</h1>
          <p className="mt-1 text-sm text-slate-400">
            {total.toLocaleString()} {total === 1 ? "prospect" : "prospects"}
            {hasActiveFilters ? " · filtered" : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <QuotaChips quotas={quotas} />
          <button
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
            onClick={() => setSweepOpen(true)}
            type="button"
          >
            <Plus className="h-4 w-4" /> New sweep
          </button>
        </div>
      </div>

      <div className="mt-4">
        <SweepsStrip onSelectSweep={onSelectSweep} onSweepDone={onSweepDone} refreshKey={sweepsRefreshKey} />
      </div>

      <div className="mt-4">
        <FilterBar
          facets={facets}
          filters={filters}
          onBulkTemplate={() => setBulkOpen(true)}
          onChange={onFiltersChange}
          onEnrichFiltered={() => setEnrichOpen(true)}
        />
      </div>

      {/* Table / states */}
      {loading ? (
        <p className="mt-10 text-sm text-slate-500">Loading prospects…</p>
      ) : listError ? (
        <div className="mt-10 rounded-2xl border border-rose-500/30 bg-rose-500/[0.06] p-6 text-center">
          <p className="text-sm text-rose-200">Couldn’t load prospects: {listError}</p>
          <button
            className="mt-3 rounded-lg border border-rose-400/30 px-3 py-1.5 text-xs text-rose-100 hover:bg-rose-500/10"
            onClick={() => { setLoading(true); void loadProspects(); }}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-slate-300">
            {hasActiveFilters
              ? "No prospects match these filters."
              : "No prospects yet — run your first sweep."}
          </p>
          {!hasActiveFilters ? (
            <p className="mt-1 text-xs text-slate-500">
              A sweep searches the data provider for businesses in a niche and country.
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mt-4">
            <ProspectsTable items={items} onSelect={setSelected} />
          </div>
          {/* Pagination */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              {start.toLocaleString()}–{end.toLocaleString()} of {total.toLocaleString()}
            </p>
            <div className="flex gap-2">
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/[0.04] disabled:opacity-40"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                type="button"
              >
                Prev
              </button>
              <button
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-white/[0.04] disabled:opacity-40"
                disabled={end >= total}
                onClick={() => setPage((p) => p + 1)}
                type="button"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Overlays */}
      <SweepDialog
        onClose={() => setSweepOpen(false)}
        onCreated={() => setSweepsRefreshKey((k) => k + 1)}
        open={sweepOpen}
      />
      <EnrichPreviewModal
        filters={filters}
        onClose={() => setEnrichOpen(false)}
        onDone={() => {
          void loadProspects();
          void loadQuota();
        }}
        open={enrichOpen}
      />
      <BulkTemplateModal
        filters={filters}
        onClose={() => setBulkOpen(false)}
        onDone={() => void loadProspects()}
        open={bulkOpen}
      />
      {selected ? (
        <ProspectDrawer
          key={selected.id}
          onClose={() => setSelected(null)}
          onEnrichNow={enrichOne}
          onTemplateSent={onTemplateSent}
          prospect={selected}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-[#0f1320] px-4 py-2 text-sm text-slate-200 shadow-2xl">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
