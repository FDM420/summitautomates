import { WORLD_CITIES } from "./world-cities";

/**
 * Major cities per country, used to "tile" a country-wide sweep into multiple
 * city-scoped searches. Google's Text Search returns at most ~60 results per
 * query, so to capture more of a country we run the niche once per city and
 * merge the results (deduped by place id). Each city is one search against the
 * monthly quota. Countries with no entry fall back to one country-wide search.
 */
export function citiesFor(countryCode: string): string[] {
  return WORLD_CITIES[countryCode.toUpperCase()] ?? [];
}
