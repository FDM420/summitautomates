import { and, eq, inArray, isNotNull, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { prospects } from "@/lib/db/schema";
import { prospectWhere, type ProspectFilters } from "./enrich";
import { computeProspectScore } from "./score";

/**
 * Website contact scraper (ported from the Lead Finder sweeper).
 *
 * Given a prospect's website it pulls the homepage HTML (plus one likely
 * contact page) and extracts the channels businesses expose as plain links:
 * WhatsApp (wa.me / api.whatsapp.com — the outreach gold), email, LinkedIn,
 * Facebook, Instagram. Fetch-based only — no headless browser, so it runs on
 * Cloud Run with zero image changes; JS-rendered-only contact info is out of
 * scope. Existing prospect data is only FILLED, never overwritten.
 */

export interface SocialResult {
  linkedin: string | null;
  email: string | null;
  whatsapp: string | null; // digits only
  facebook: string | null;
  instagram: string | null;
}

const EMPTY: SocialResult = { linkedin: null, email: null, whatsapp: null, facebook: null, instagram: null };

const FETCH_TIMEOUT_MS = 8_000;
const MAX_BYTES = 600_000; // cap the HTML we parse to keep memory bounded
const USER_AGENT =
  "SummitBot/1.0 (+https://summitautomates.com; contact-info collector; polite, low-volume)";

// Email local-parts we prefer for outreach, best first.
const EMAIL_PRIORITY = [
  "info", "contact", "hello", "sales", "office", "admin", "hr", "careers", "jobs",
];

// Junk substrings that disqualify a "mailto" / email match.
const EMAIL_BLOCKLIST = [
  "example.com", "example.org", "sentry.io", "wixpress.com", "wix.com",
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", "your-email", "yourname",
  "domain.com", "email@",
];

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const u = new URL(withProto);
    // Public http(s) hosts only — never let a stored "website" point the
    // server at itself or private infrastructure.
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    const host = u.hostname.toLowerCase();
    if (
      host === "localhost" ||
      host.endsWith(".local") ||
      host.endsWith(".internal") ||
      /^\d+\.\d+\.\d+\.\d+$/.test(host) || // raw IPv4 (private ranges included)
      host.includes(":") // IPv6 literal
    ) {
      return null;
    }
    return u.toString();
  } catch {
    return null;
  }
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,application/xhtml+xml" },
    });
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("html")) return null;
    const text = await res.text();
    return text.length > MAX_BYTES ? text.slice(0, MAX_BYTES) : text;
  } catch {
    return null; // timeout, DNS failure, TLS error, etc. — treated as "no data"
  }
}

function firstMatch(html: string, re: RegExp, reject?: (s: string) => boolean): string | null {
  const matches = html.match(re);
  if (!matches) return null;
  for (const m of matches) {
    const cleaned = m.replace(/["'<>)\\]+$/, "");
    if (reject && reject(cleaned.toLowerCase())) continue;
    return cleaned;
  }
  return null;
}

function extractLinkedIn(html: string): string | null {
  // Prefer a company/school page over a personal /in/ profile.
  const company = firstMatch(html, /https?:\/\/[a-z0-9.]*linkedin\.com\/(?:company|school)\/[^\s"'<>)]+/gi);
  if (company) return company;
  return firstMatch(html, /https?:\/\/[a-z0-9.]*linkedin\.com\/(?:in|company|school)\/[^\s"'<>)]+/gi);
}

function extractWhatsApp(html: string): string | null {
  const link = firstMatch(html, /https?:\/\/(?:wa\.me|api\.whatsapp\.com\/send)[^\s"'<>)]*/gi);
  if (!link) return null;
  // wa.me/<digits> or api.whatsapp.com/send?phone=<digits>
  const phoneParam = link.match(/[?&]phone=([+\d]+)/i)?.[1];
  const pathDigits = link.match(/wa\.me\/(\+?\d+)/i)?.[1];
  const digits = (phoneParam ?? pathDigits ?? "").replace(/\D+/g, "");
  return digits.length >= 7 ? digits : null;
}

function extractSocialDomain(html: string, domain: string): string | null {
  const re = new RegExp(`https?:\\/\\/[a-z0-9.]*${domain}\\/[^\\s"'<>)]+`, "gi");
  return firstMatch(html, re, (s) => {
    // Skip share widgets and SDK/plugin endpoints, keep real profile links.
    return (
      s.includes("/sharer") || s.includes("/share") || s.includes("/plugins") ||
      s.includes("/dialog") || s.includes("/tr?") || s.includes("connect.facebook") ||
      s.endsWith(`${domain}/`)
    );
  });
}

function rankEmail(a: string, b: string): number {
  const score = (email: string): number => {
    const local = email.split("@")[0]?.toLowerCase() ?? "";
    const idx = EMAIL_PRIORITY.findIndex((p) => local === p || local.startsWith(p));
    return idx === -1 ? EMAIL_PRIORITY.length : idx;
  };
  return score(a) - score(b);
}

function extractEmail(html: string): string | null {
  const candidates = new Set<string>();
  // mailto: links are the most reliable signal.
  for (const m of html.matchAll(/mailto:([^"'?\s>]+)/gi)) {
    if (m[1]) candidates.add(decodeURIComponent(m[1]).toLowerCase());
  }
  // Fall back to raw email-shaped strings only if no mailto was present.
  if (candidates.size === 0) {
    for (const m of html.matchAll(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)) {
      candidates.add(m[0].toLowerCase());
    }
  }
  const cleaned = [...candidates].filter(
    (e) => /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/.test(e) && !EMAIL_BLOCKLIST.some((b) => e.includes(b)),
  );
  if (cleaned.length === 0) return null;
  cleaned.sort(rankEmail);
  return cleaned[0];
}

function extractAll(html: string): SocialResult {
  return {
    linkedin: extractLinkedIn(html),
    email: extractEmail(html),
    whatsapp: extractWhatsApp(html),
    facebook: extractSocialDomain(html, "facebook\\.com"),
    instagram: extractSocialDomain(html, "instagram\\.com"),
  };
}

function merge(a: SocialResult, b: SocialResult): SocialResult {
  return {
    linkedin: a.linkedin ?? b.linkedin,
    email: a.email ?? b.email,
    whatsapp: a.whatsapp ?? b.whatsapp,
    facebook: a.facebook ?? b.facebook,
    instagram: a.instagram ?? b.instagram,
  };
}

function findContactPath(html: string, base: string): string | null {
  // Look for an internal link whose text/href suggests a contact/about page.
  const re = /href=["']([^"']*(?:contact|about)[^"']*)["']/gi;
  const match = re.exec(html);
  if (!match?.[1]) return null;
  try {
    const resolved = new URL(match[1], base).toString();
    return normalizeUrl(resolved);
  } catch {
    return null;
  }
}

/**
 * Scrape a single website. Always resolves (never throws) — failures simply
 * return an all-null result so the caller can mark the prospect "attempted".
 */
export async function scrapeSocials(website: string): Promise<SocialResult> {
  const url = normalizeUrl(website);
  if (!url) return EMPTY;

  const homepage = await fetchHtml(url);
  if (!homepage) return EMPTY;

  let result = extractAll(homepage);

  // If we still lack a WhatsApp number or email, try one contact/about page.
  if (!result.whatsapp || !result.email) {
    const contactUrl = findContactPath(homepage, url);
    if (contactUrl && contactUrl !== url) {
      const contactHtml = await fetchHtml(contactUrl);
      if (contactHtml) result = merge(result, extractAll(contactHtml));
    }
  }
  return result;
}

// --- Batch runner (mirrors enrichBatch's shape and claim discipline) --------

export type ScrapeResult = { scraped: number; foundWhatsapp: number; foundEmail: number; noData: number };

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 25; // 25 sites × ≤2 fetches × 8s worst case stays in budget

function clampLimit(limit?: number): number {
  return Math.min(Math.max(limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
}

/** How many prospects match the filters and still need a scrape. */
export async function previewScrape(
  filters: ProspectFilters,
  limit?: number,
): Promise<{ matching: number; planned: number }> {
  const [{ matching }] = await db
    .select({ matching: sql<number>`count(*)::int` })
    .from(prospects)
    .where(and(prospectWhere(filters), isNotNull(prospects.website), isNull(prospects.socialsScrapedAt)));
  return { matching, planned: Math.min(matching, clampLimit(limit)) };
}

/**
 * Scrape a batch of prospects' websites, resolved by explicit ids or by
 * filters+limit (unscraped-with-website first). Fills whatsapp/email/socials
 * (never overwrites existing values), stamps socialsScrapedAt even on empty
 * results so a site is only attempted once, and rescores.
 */
export async function scrapeBatch(args: {
  ids?: string[];
  filters?: ProspectFilters;
  limit?: number;
}): Promise<ScrapeResult> {
  const result: ScrapeResult = { scraped: 0, foundWhatsapp: 0, foundEmail: 0, noData: 0 };
  const fromIds = Boolean(args.ids && args.ids.length > 0);

  const targets = fromIds
    ? await db.select().from(prospects).where(
        and(inArray(prospects.id, args.ids!.slice(0, MAX_LIMIT)), isNotNull(prospects.website)),
      )
    : await db.select().from(prospects)
        .where(and(prospectWhere(args.filters ?? {}), isNotNull(prospects.website), isNull(prospects.socialsScrapedAt)))
        .orderBy(sql`${prospects.score} desc`, sql`${prospects.id} desc`)
        .limit(clampLimit(args.limit));

  for (const p of targets) {
    // Claim via CAS on updatedAt (ms-truncated — PG stores µs) so overlapping
    // runs never scrape the same site twice; id-runs may deliberately redo.
    const claimed = await db
      .update(prospects)
      .set({ updatedAt: new Date() })
      .where(
        and(
          eq(prospects.id, p.id),
          sql`date_trunc('milliseconds', ${prospects.updatedAt}) = ${p.updatedAt.toISOString()}::timestamptz`,
          ...(fromIds ? [] : [isNull(prospects.socialsScrapedAt)]),
        ),
      )
      .returning({ id: prospects.id });
    if (claimed.length === 0) continue;

    const socials = await scrapeSocials(p.website as string);
    const found = Object.values(socials).some(Boolean);

    const next = {
      // Fill-only: a manually curated value always wins over a scrape.
      whatsapp: p.whatsapp ?? socials.whatsapp,
      email: p.email ?? socials.email,
      linkedin: p.linkedin ?? socials.linkedin,
      facebook: p.facebook ?? socials.facebook,
      instagram: p.instagram ?? socials.instagram,
    };

    await db
      .update(prospects)
      .set({
        ...next,
        socialsScrapedAt: new Date(),
        score: computeProspectScore({
          rating: p.rating,
          reviews: p.reviews,
          phone: p.phone,
          website: p.website,
          ...next,
        }),
        updatedAt: new Date(),
      })
      .where(eq(prospects.id, p.id));

    result.scraped += 1;
    if (!found) result.noData += 1;
    if (!p.whatsapp && socials.whatsapp) result.foundWhatsapp += 1;
    if (!p.email && socials.email) result.foundEmail += 1;
  }

  return result;
}
