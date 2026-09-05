"use client";

import { Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
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
  const [sweepsRefreshKey, setSweepsRefreshKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const loadProspects = useCallback(async () => {
    const q = filtersToParams(filters);
    q.set("page", String(page));
    q.set("pageSize", String(PAGE_SIZE));
    try {
      const r = await fetch(`/api/admin/prospecting/prospects?${q}`);
      const j = (await r.json()) as { items?: ProspectDTO[]; total?: number };
      if (j.items) {
        setItems(j.items);
        setTotal(j.total ?? 0);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
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
        <SweepsStrip onSweepDone={onSweepDone} refreshKey={sweepsRefreshKey} />
      </div>

      <div className="mt-4">
        <FilterBar
          facets={facets}
          filters={filters}
          onChange={onFiltersChange}
          onEnrichFiltered={() => setEnrichOpen(true)}
        />
      </div>

      {/* Table / states */}
      {loading ? (
        <p className="mt-10 text-sm text-slate-500">Loading prospects…</p>
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
