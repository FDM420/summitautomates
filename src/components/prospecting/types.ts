// Client-side mirrors of the prospecting API DTOs (drizzle rows serialized by
// NextResponse.json — timestamps arrive as ISO strings). Shapes are pinned by
// the prospecting spec; keep in sync with src/lib/db/schema.ts.

export type ProspectDTO = {
  id: string;
  name: string;
  niche: string;
  countryCode: string;
  countryName: string;
  city: string | null;
  address: string | null;
  rating: number | null;
  reviews: number | null;
  phone: string | null;
  website: string | null;
  hours: string | null;
  linkedin: string | null;
  email: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
  socialsScrapedAt: string | null;
  score: number;
  status: "pending" | "enriched" | "failed";
  enriched: boolean;
  placeId: string | null;
  lat: number | null;
  lng: number | null;
  dedupeKey: string;
  contactId: string | null;
  lastTemplateSentAt: string | null;
  templateSendCount: number;
  createdAt: string;
  updatedAt: string;
};

export type SweepDTO = {
  id: string;
  niche: string;
  countryCode: string;
  countryName: string;
  city: string | null;
  allCities: boolean;
  status: "queued" | "running" | "done" | "failed";
  found: number;
  error: string | null;
  createdAt: string;
  finishedAt: string | null;
};

export type QuotaDTO = {
  method: "search" | "details";
  label: "Searches" | "Detail lookups";
  used: number;
  cap: number;
  percentage: number; // 0-100 int
  resetsAt: string;
};

export type EnrichPreviewDTO = {
  matching: number;
  quotaRemaining: number;
  planned: number;
  willStopEarly: boolean;
};

export type EnrichResultDTO = {
  enriched: number;
  failed: number;
  quotaHit: boolean;
};

export type ProspectFilters = {
  q?: string;
  countryCode?: string;
  niche?: string;
  city?: string;
  minRating?: number;
  minReviews?: number;
  enrichment?: "all" | "enriched" | "not_enriched";
  /** "has" = a WhatsApp or phone number is on file (outreach-ready). */
  contactable?: "has" | "none";
  sort?: "recent" | "score" | "rating";
};

export type BulkSendResultDTO = {
  targeted: number;
  sent: number;
  failed: number;
  skipped: number;
  failures: { name: string; error: string }[];
};

export type FacetsDTO = {
  niches: { value: string; count: number }[];
  cities: { value: string; count: number }[];
  countries: { code: string; name: string; count: number }[];
};
