import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { providerQuota } from "@/lib/db/schema";

/**
 * Monthly free-tier quota metering (ported from the Lead Finder sweeper).
 *
 * One `provider_quota` row per (method, "YYYY-MM" UTC period). Every metered
 * provider call routes through `recordOrThrow` FIRST, so no paid request is
 * ever issued once the free tier is spent — even under concurrent requests
 * across Cloud Run instances (the increment is one atomic statement).
 */

/** Thrown BEFORE a metered provider call when the monthly cap is reached. */
export class QuotaExhaustedError extends Error {
  readonly method: string;
  constructor(method: string) {
    super(`Free tier quota exhausted for "${method}".`);
    this.name = "QuotaExhaustedError";
    this.method = method;
  }
}

export type QuotaMethod = "search" | "details";

export type QuotaDTO = {
  method: QuotaMethod;
  label: string;
  used: number;
  cap: number;
  /** 0–100 integer. */
  percentage: number;
  /** ISO timestamp of the first day of next month, UTC. */
  resetsAt: string;
};

const LABELS: Record<QuotaMethod, string> = {
  search: "Searches",
  details: "Detail lookups",
};

function capFor(method: QuotaMethod): number {
  const raw =
    method === "search"
      ? process.env.SEARCH_MONTHLY_CAP
      : process.env.DETAILS_MONTHLY_CAP;
  const parsed = parseInt(raw ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1000;
}

/** Current UTC month key, e.g. "2026-09". */
function currentPeriod(now = new Date()): string {
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** ISO timestamp of the first day of next month, UTC. */
function nextMonthResetIso(now = new Date()): string {
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  return new Date(Date.UTC(year, month + 1, 1, 0, 0, 0, 0)).toISOString();
}

async function usedThisPeriod(method: QuotaMethod): Promise<number> {
  const [row] = await db
    .select({ used: providerQuota.used })
    .from(providerQuota)
    .where(and(eq(providerQuota.method, method), eq(providerQuota.period, currentPeriod())))
    .limit(1);
  return row?.used ?? 0;
}

/** How many metered calls of `method` remain this month (never negative). */
export async function remaining(method: QuotaMethod): Promise<number> {
  const used = await usedThisPeriod(method);
  return Math.max(0, capFor(method) - used);
}

/**
 * Records one unit of usage for `method`, throwing QuotaExhaustedError BEFORE
 * exceeding the cap. Call this immediately before the metered provider call.
 *
 * Concurrency-safe: the check-and-increment is one atomic upsert. The DO
 * UPDATE only fires while `used < cap`, so concurrent callers can never push
 * usage past the cap — zero returned rows means the cap is already spent.
 */
export async function recordOrThrow(method: QuotaMethod): Promise<void> {
  const cap = capFor(method);
  if (cap < 1) throw new QuotaExhaustedError(method);

  const rows = await db.execute(sql`
    INSERT INTO provider_quota (method, period, used)
    VALUES (${method}, ${currentPeriod()}, 1)
    ON CONFLICT (method, period) DO UPDATE
      SET used = provider_quota.used + 1
      WHERE provider_quota.used < ${cap}
    RETURNING used
  `);
  if (rows.length === 0) {
    throw new QuotaExhaustedError(method);
  }
}

/** Both metered methods with labels, percentage and the monthly reset date. */
export async function getQuotas(): Promise<QuotaDTO[]> {
  const resetsAt = nextMonthResetIso();
  const methods: QuotaMethod[] = ["search", "details"];

  return Promise.all(
    methods.map(async (method) => {
      const used = await usedThisPeriod(method);
      const cap = capFor(method);
      const percentage = cap > 0 ? Math.min(100, Math.round((used / cap) * 100)) : 0;
      return { method, label: LABELS[method], used, cap, percentage, resetsAt };
    }),
  );
}
