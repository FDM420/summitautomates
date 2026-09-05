"use client";

import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { FacetsDTO, ProspectFilters } from "./types";

const SELECT =
  "rounded-lg border border-white/10 bg-[#0f1320] px-2 py-1.5 text-xs text-slate-200 focus:border-amber-400/40 focus:outline-none";

/**
 * Filter row above the prospects table. Facet options come from the server
 * (cities scoped to the chosen country); the free-text search is debounced.
 */
export function FilterBar({
  filters,
  facets,
  onChange,
  onEnrichFiltered,
}: {
  filters: ProspectFilters;
  facets: FacetsDTO | null;
  onChange: (next: ProspectFilters) => void;
  onEnrichFiltered: () => void;
}) {
  const [search, setSearch] = useState(filters.q ?? "");

  // Debounce the search box into the shared filters (300ms). `filters` stays
  // in the deps so a select changed mid-debounce is never reverted by a stale
  // spread; the q-equality guard keeps this from looping.
  useEffect(() => {
    const t = setTimeout(() => {
      const q = search.trim();
      if ((filters.q ?? "") !== q) onChange({ ...filters, q: q || undefined });
    }, 300);
    return () => clearTimeout(t);
  }, [search, filters, onChange]);

  const set = (patch: Partial<ProspectFilters>) => onChange({ ...filters, ...patch });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        className="min-w-[160px] flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-600 focus:border-amber-400/40 focus:outline-none sm:max-w-xs"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search name, city, niche…"
        value={search}
      />

      <select
        className={SELECT}
        onChange={(e) => set({ countryCode: e.target.value || undefined, city: undefined })}
        value={filters.countryCode ?? ""}
      >
        <option value="">All countries</option>
        {(facets?.countries ?? []).map((c) => (
          <option key={c.code} value={c.code}>
            {c.name} · {c.count}
          </option>
        ))}
      </select>

      <select
        className={SELECT}
        onChange={(e) => set({ niche: e.target.value || undefined })}
        value={filters.niche ?? ""}
      >
        <option value="">All niches</option>
        {(facets?.niches ?? []).map((n) => (
          <option key={n.value} value={n.value}>
            {n.value} · {n.count}
          </option>
        ))}
      </select>

      <select
        className={SELECT}
        onChange={(e) => set({ city: e.target.value || undefined })}
        value={filters.city ?? ""}
      >
        <option value="">All cities</option>
        {(facets?.cities ?? []).map((c) => (
          <option key={c.value} value={c.value}>
            {c.value} · {c.count}
          </option>
        ))}
      </select>

      <select
        className={SELECT}
        onChange={(e) => set({ minRating: e.target.value ? Number(e.target.value) : undefined })}
        value={filters.minRating != null ? String(filters.minRating) : ""}
      >
        <option value="">Any rating</option>
        <option value="3">3+ ★</option>
        <option value="4">4+ ★</option>
        <option value="4.5">4.5+ ★</option>
      </select>

      <select
        className={SELECT}
        onChange={(e) => set({ minReviews: e.target.value ? Number(e.target.value) : undefined })}
        value={filters.minReviews != null ? String(filters.minReviews) : ""}
      >
        <option value="">Any reviews</option>
        <option value="10">10+ reviews</option>
        <option value="50">50+ reviews</option>
        <option value="200">200+ reviews</option>
      </select>

      <select
        className={SELECT}
        onChange={(e) =>
          set({ enrichment: (e.target.value || undefined) as ProspectFilters["enrichment"] })
        }
        value={filters.enrichment ?? "all"}
      >
        <option value="all">All prospects</option>
        <option value="enriched">Enriched</option>
        <option value="not_enriched">Not enriched</option>
      </select>

      <select
        className={SELECT}
        onChange={(e) => set({ sort: e.target.value as ProspectFilters["sort"] })}
        value={filters.sort ?? "recent"}
      >
        <option value="recent">Newest first</option>
        <option value="score">Best score</option>
        <option value="rating">Best rating</option>
      </select>

      <button
        className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-300/20"
        onClick={onEnrichFiltered}
        type="button"
      >
        <Sparkles className="h-3.5 w-3.5" /> Enrich filtered
      </button>
    </div>
  );
}
