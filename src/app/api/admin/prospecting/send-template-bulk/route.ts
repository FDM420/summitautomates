import { and, count, desc, eq, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { prospects } from "@/lib/db/schema";
import { prospectWhere, type ProspectFilters } from "@/lib/prospecting/enrich";
import { sendHumanTemplate } from "@/lib/whatsapp/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Up to 50 sequential Meta sends in one request.
export const maxDuration = 300;

/** Max actually processed per HTTP request — keeps one call inside its time
 * budget. The modal loops these to cover a bigger selection. */
const REQUEST_CAP = 50;
/** Ceiling for one "Send" click across all chunks (~a day's messaging tier). */
const MAX_PER_RUN = 250;
/** Don't re-message a prospect templated within this window. */
const RECENT_MS = 24 * 60 * 60 * 1000;
/** Literal token in `params` replaced with each prospect's business name. */
const BUSINESS_TOKEN = "{{business}}";

type Body = {
  preview?: boolean;
  /** Explicit hand-picked prospects — takes precedence over `filters`. */
  ids?: string[];
  filters?: ProspectFilters;
  templateName?: string;
  language?: string;
  /** Raw template body with {{n}} placeholders — substituted per prospect. */
  templateBody?: string;
  /** Positional {{n}} values; "{{business}}" becomes the prospect's name. */
  params?: string[];
  /** Client batch id: replays of the same batch never double-message anyone. */
  batchKey?: string;
  limit?: number;
};

/**
 * Bulk template outreach: send one approved template to every prospect that
 * matches the filters AND has a number on file, skipping anyone messaged in
 * the last 24h. `preview: true` only counts. Each prospect's send is
 * idempotency-keyed by (batchKey, prospectId), so retrying a batch resumes it.
 */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = ((await request.json().catch(() => null)) ?? {}) as Body;
  const filters = (body.filters ?? {}) as ProspectFilters;
  const limit = Math.min(Math.max(Math.trunc(Number(body.limit)) || REQUEST_CAP, 1), REQUEST_CAP);

  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((v): v is string => typeof v === "string" && UUID.test(v)).slice(0, MAX_PER_RUN)
    : null;
  if (Array.isArray(body.ids) && (!ids || ids.length === 0)) {
    return NextResponse.json({ error: "No valid prospect ids" }, { status: 400 });
  }

  const contactable = or(isNotNull(prospects.whatsapp), isNotNull(prospects.phone));
  const notRecent = or(
    isNull(prospects.lastTemplateSentAt),
    lt(prospects.lastTemplateSentAt, new Date(Date.now() - RECENT_MS)),
  );
  // A number that already bounced with 131026 (not on WhatsApp) is never
  // retried — the prospect stays in the CRM but leaves the send pool.
  const deliverable = isNull(prospects.waUndeliverableAt);
  // Hand-picked ids beat filters; the safety rails (number on file, 24h skip,
  // known-dead exclusion) apply either way.
  const base = ids ? inArray(prospects.id, ids) : prospectWhere(filters);
  const matchingWhere = and(base, contactable, deliverable);
  const eligibleWhere = and(matchingWhere, notRecent);

  if (body.preview) {
    const [[{ matching }], [{ eligible }]] = await Promise.all([
      db.select({ matching: count() }).from(prospects).where(matchingWhere),
      db.select({ eligible: count() }).from(prospects).where(eligibleWhere),
    ]);
    return NextResponse.json({
      matching,
      eligible,
      // The whole "Send" click will cover this many (across chunks of 50).
      targeted: Math.min(eligible, MAX_PER_RUN),
      cap: MAX_PER_RUN,
    });
  }

  const templateName = typeof body.templateName === "string" ? body.templateName.trim() : "";
  const language = typeof body.language === "string" ? body.language.trim() : "";
  const templateBody = typeof body.templateBody === "string" ? body.templateBody : "";
  const batchKey = typeof body.batchKey === "string" ? body.batchKey : "";
  const params = Array.isArray(body.params)
    ? body.params.filter((p): p is string => typeof p === "string")
    : [];

  if (!templateName || !language || !templateBody) {
    return NextResponse.json({ error: "Missing template fields" }, { status: 400 });
  }
  if (batchKey.length < 8 || batchKey.length > 64) {
    return NextResponse.json({ error: "Missing batch key" }, { status: 400 });
  }
  if (
    templateName.length > 512 ||
    language.length > 15 ||
    templateBody.length > 4096 ||
    params.length > 20 ||
    params.some((p) => p.length > 1024)
  ) {
    return NextResponse.json({ error: "Template fields out of bounds" }, { status: 400 });
  }

  const targets = await db
    .select({
      id: prospects.id,
      name: prospects.name,
    })
    .from(prospects)
    .where(eligibleWhere)
    .orderBy(desc(prospects.score), desc(prospects.id))
    .limit(limit);

  const result = { targeted: targets.length, sent: 0, failed: 0, skipped: 0, rateLimited: false };
  const failures: { name: string; error: string }[] = [];

  for (const p of targets) {
    const bodyParams = params.map((v) => (v === BUSINESS_TOKEN ? p.name : v));
    let bodyText = templateBody;
    bodyParams.forEach((v, i) => {
      bodyText = bodyText.replaceAll(`{{${i + 1}}}`, v);
    });

    const outcome = await sendHumanTemplate({
      prospectId: p.id,
      templateName,
      language,
      bodyParams,
      bodyText,
      userId: user.id,
      idempotencyKey: `bulk:${batchKey}:${p.id}`,
    });

    if (!outcome.ok) {
      // Unusable number / blocked contact — permanent. Mark it so the modal's
      // chunk loop doesn't reselect it forever (and it leaves the send pool).
      result.skipped += 1;
      await db
        .update(prospects)
        .set({ waUndeliverableAt: new Date(), updatedAt: new Date() })
        .where(eq(prospects.id, p.id));
      if (failures.length < 5) failures.push({ name: p.name, error: outcome.error });
      continue;
    }
    if ((outcome.message.status as string) === "failed") {
      result.failed += 1;
      if (failures.length < 5) {
        failures.push({ name: p.name, error: String(outcome.message.errorTitle ?? "Meta rejected the send") });
      }
      // 131049/131056 = daily marketing/quality cap reached — stop the whole
      // run; further sends will only pile up failures.
      const code = String(outcome.message.errorCode ?? "");
      if (code === "131049" || code === "131056") {
        result.rateLimited = true;
        break;
      }
      continue;
    }
    result.sent += 1;
  }

  return NextResponse.json({ ...result, failures });
}
