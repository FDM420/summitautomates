/**
 * Partner-fit score (0-100) for prioritising outreach. Pure and side-effect
 * free so the server can persist it and the client can label it without
 * disagreement. Ported from the Lead Finder sweeper.
 */
export type ScorableProspect = {
  rating: number | null;
  reviews: number | null;
  phone: string | null;
  website: string | null;
  linkedin: string | null;
  email: string | null;
  whatsapp: string | null;
  facebook: string | null;
  instagram: string | null;
};

export type ScoreTier = "high" | "medium" | "low";

const has = (v: string | null | undefined): boolean => Boolean(v && v.trim());

export function computeProspectScore(p: ScorableProspect): number {
  let s = 0;

  // Reachable contact channels — the core of outreach value.
  if (p.linkedin) s += /\/company\//i.test(p.linkedin) ? 22 : 10;
  if (has(p.email)) s += 18;
  if (has(p.whatsapp)) s += 10;
  if (has(p.phone)) s += 8;
  if (has(p.website)) s += 5;

  // Credibility — established businesses are better partners.
  const rating = p.rating ?? 0;
  s += rating >= 4.5 ? 12 : rating >= 4 ? 8 : rating >= 3 ? 4 : 0;
  const reviews = p.reviews ?? 0;
  s += reviews >= 200 ? 18 : reviews >= 50 ? 12 : reviews >= 10 ? 6 : reviews > 0 ? 2 : 0;

  // Secondary social presence.
  if (has(p.facebook)) s += 4;
  if (has(p.instagram)) s += 4;

  return Math.min(100, Math.round(s));
}

export function scoreTier(score: number): ScoreTier {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}
