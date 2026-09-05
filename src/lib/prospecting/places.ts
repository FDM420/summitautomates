/**
 * Free-tier places provider (ported from the Lead Finder sweeper).
 *
 * ALL underlying vendor specifics — endpoint URLs, headers, request/response
 * field names — are confined to THIS file. The rest of the app only ever sees
 * the neutral `ProviderPlace` / `ProviderPlaceDetails` shapes and the "free
 * tier" label. Nothing vendor-named leaks into the engine or route layer.
 */

export type ProviderPlace = {
  placeId: string;
  name: string;
  address: string | null;
  city: string | null;
  rating: number | null;
  reviews: number | null;
  lat: number | null;
  lng: number | null;
};

export type ProviderPlaceDetails = ProviderPlace & {
  phone: string | null;
  website: string | null;
  hours: string | null;
};

// Underlying free-tier endpoints (Text Search + Place Details).
const TEXT_SEARCH_URL = "https://places.googleapis.com/v1/places:searchText";
const DETAILS_URL = "https://places.googleapis.com/v1/places";

// Up to 20 results per page; we page until `max` or 3 pages (the upstream cap).
const PAGE_SIZE = 20;
const MAX_PAGES = 3;

// Field masks tell the upstream service exactly which fields to return. Listing
// only what we map keeps responses small and billing in the cheapest tier.
const SEARCH_FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.formattedAddress",
  "places.addressComponents",
  "places.rating",
  "places.userRatingCount",
  "places.location",
  "nextPageToken",
].join(",");

// City is taken from the structured address components (reliable) and only
// falls back to parsing the formatted address. Preference order handles the
// different ways countries label a "city".
const CITY_COMPONENT_TYPES = [
  "locality",
  "postal_town",
  "administrative_area_level_3",
  "administrative_area_level_2",
];

const DETAILS_FIELD_MASK = [
  "id",
  "displayName",
  "formattedAddress",
  "rating",
  "userRatingCount",
  "location",
  "internationalPhoneNumber",
  "nationalPhoneNumber",
  "websiteUri",
  "regularOpeningHours.weekdayDescriptions",
].join(",");

interface UpstreamLocation {
  latitude?: number;
  longitude?: number;
}

interface UpstreamDisplayName {
  text?: string;
  languageCode?: string;
}

interface UpstreamAddressComponent {
  longText?: string;
  shortText?: string;
  types?: string[];
}

interface UpstreamPlace {
  id?: string;
  displayName?: UpstreamDisplayName;
  formattedAddress?: string;
  addressComponents?: UpstreamAddressComponent[];
  rating?: number;
  userRatingCount?: number;
  location?: UpstreamLocation;
}

interface UpstreamPlaceDetails extends UpstreamPlace {
  internationalPhoneNumber?: string;
  nationalPhoneNumber?: string;
  websiteUri?: string;
  regularOpeningHours?: { weekdayDescriptions?: string[] };
}

interface UpstreamSearchResponse {
  places?: UpstreamPlace[];
  nextPageToken?: string;
}

interface UpstreamError {
  error?: { code?: number; status?: string; message?: string };
}

// Read at call time, not module load — env may not be populated at build.
function apiKey(): string | undefined {
  return process.env.PROVIDER_API_KEY?.trim() || undefined;
}

/** Whether the free-tier data provider key is set (sweeps/enrich need it). */
export function providerConfigured(): boolean {
  return Boolean(apiKey());
}

function requireKey(): string {
  const key = apiKey();
  if (!key) {
    throw new Error(
      "The data provider key is not configured — set the PROVIDER_API_KEY secret.",
    );
  }
  return key;
}

function deriveCity(address: string | null): string | null {
  if (!address) return null;
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean);
  // Heuristic: the second-from-last comma segment is usually the locality.
  if (parts.length >= 2) return parts[parts.length - 2];
  return parts[0] ?? null;
}

function cityFromComponents(components?: UpstreamAddressComponent[]): string | null {
  if (!components?.length) return null;
  for (const type of CITY_COMPONENT_TYPES) {
    const match = components.find((c) => c.types?.includes(type));
    const name = match?.longText?.trim();
    if (name) return name;
  }
  return null;
}

function mapPlace(p: UpstreamPlace): ProviderPlace {
  const address = p.formattedAddress ?? null;
  return {
    placeId: p.id ?? "",
    name: p.displayName?.text ?? "Unknown",
    address,
    city: cityFromComponents(p.addressComponents) ?? deriveCity(address),
    rating: typeof p.rating === "number" ? p.rating : null,
    reviews: typeof p.userRatingCount === "number" ? p.userRatingCount : null,
    lat: p.location?.latitude ?? null,
    lng: p.location?.longitude ?? null,
  };
}

function mapDetails(p: UpstreamPlaceDetails): ProviderPlaceDetails {
  const base = mapPlace(p);
  const hours = p.regularOpeningHours?.weekdayDescriptions?.length
    ? p.regularOpeningHours.weekdayDescriptions.join("; ")
    : null;
  return {
    ...base,
    phone: p.internationalPhoneNumber ?? p.nationalPhoneNumber ?? null,
    website: p.websiteUri ?? null,
    hours,
  };
}

/** Pulls a useful message out of an upstream error body, if present. */
async function readError(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as UpstreamError;
    const e = body.error;
    if (e?.status || e?.message) {
      return `${e.status ?? res.status}${e.message ? ` — ${e.message}` : ""}`;
    }
  } catch {
    // fall through to the bare HTTP status
  }
  return `HTTP ${res.status}`;
}

/**
 * Text search for businesses matching `niche` in a country (optionally scoped
 * to a city). Throws an Error with a readable message on hard failure (bad
 * key, API disabled, bad query).
 */
export async function searchPlaces(input: {
  niche: string;
  countryCode: string;
  countryName: string;
  max: number;
  city?: string;
}): Promise<ProviderPlace[]> {
  const key = requireKey();
  const max = Math.min(Math.max(input.max, 1), PAGE_SIZE * MAX_PAGES);
  const where = input.city ? `${input.city}, ${input.countryName}` : input.countryName;
  const textQuery = `${input.niche} in ${where}`;
  const regionCode = input.countryCode.toUpperCase();

  const collected: ProviderPlace[] = [];
  let pageToken: string | undefined;

  // The upstream service returns up to 20 results per page with a token for
  // the next page (immediately valid, unlike the legacy API). We page until
  // we hit `max` or run out of pages.
  for (let page = 0; page < MAX_PAGES && collected.length < max; page++) {
    const body: Record<string, unknown> = {
      textQuery,
      regionCode,
      pageSize: PAGE_SIZE,
      // Force English place names + address components so cities come back in
      // consistent Latin script (e.g. "Karachi", not "کراچی").
      languageCode: "en",
    };
    if (pageToken) body.pageToken = pageToken;

    const res = await fetch(TEXT_SEARCH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": SEARCH_FIELD_MASK,
      },
      body: JSON.stringify(body),
      // A hung upstream connection must not stall a sweep (or the request
      // that awaits it) indefinitely.
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      // The first page surfaces hard errors (bad key, API disabled, bad
      // query). A later page failing is best-effort — keep what we have.
      if (page === 0) {
        throw new Error(`Provider search error: ${await readError(res)}`);
      }
      break;
    }

    const data = (await res.json()) as UpstreamSearchResponse;
    for (const r of data.places ?? []) {
      if (!r.id) continue;
      collected.push(mapPlace(r));
      if (collected.length >= max) break;
    }

    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }

  return collected.slice(0, max);
}

/** Detail lookup for one place (phone, website, hours). Throws on failure. */
export async function getPlaceDetails(placeId: string): Promise<ProviderPlaceDetails> {
  const key = requireKey();
  const res = await fetch(`${DETAILS_URL}/${encodeURIComponent(placeId)}`, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": DETAILS_FIELD_MASK,
    },
    // Bounded: enrichBatch runs up to 50 of these sequentially in one request.
    signal: AbortSignal.timeout(15_000),
  });

  if (!res.ok) {
    throw new Error(`Provider details error: ${await readError(res)}`);
  }
  const data = (await res.json()) as UpstreamPlaceDetails;
  return mapDetails(data);
}
