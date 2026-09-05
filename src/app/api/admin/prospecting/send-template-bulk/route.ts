import { and, count, desc, inArray, isNotNull, isNull, lt, or } from "drizzle-orm";
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

/** Per-run cap: one confirmation covers at most this many outreach messages. */
const BULK_CAP = 50;
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
  const limit = Math.min(Math.max(Math.trunc(Number(body.limit)) || BULK_CAP, 1), BULK_CAP);

  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const ids = Array.isArray(body.ids)
    ? body.ids.filter((v): v is string => typeof v === "string" && UUID.test(v)).slice(0, BULK_CAP)
    : null;
  if (Array.isArray(body.ids) && (!ids || ids.length === 0)) {
    return NextResponse.json({ error: "No valid prospect ids" }, { status: 400 });
  }

  const contactable = or(isNotNull(prospects.whatsapp), isNotNull(prospects.phone));
  const notRecent = or(
    isNull(prospects.lastTemplateSentAt),
    lt(prospects.lastTemplateSentAt, new Date(Date.now() - RECENT_MS)),
  );
  // Hand-picked ids beat filters; the safety rails (number on file, 24h skip)
  // apply either way.
  const base = ids ? inArray(prospects.id, ids) : prospectWhere(filters);
  const matchingWhere = and(base, contactable);
  const eligibleWhere = and(matchingWhere, notRecent);

  if (body.preview) {
    const [[{ matching }], [{ eligible }]] = await Promise.all([
      db.select({ matching: count() }).from(prospects).where(matchingWhere),
      db.select({ eligible: count() }).from(prospects).where(eligibleWhere),
    ]);
    return NextResponse.json({
      matching,
      eligible,
      targeted: Math.min(eligible, limit),
      cap: BULK_CAP,
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

  const result = { targeted: targets.length, sent: 0, failed: 0, skipped: 0 };
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
      // Unusable number, blocked contact, … — recorded but not sent.
      result.skipped += 1;
      if (failures.length < 5) failures.push({ name: p.name, error: outcome.error });
      continue;
    }
    if ((outcome.message.status as string) === "failed") {
      result.failed += 1;
      if (failures.length < 5) {
        failures.push({ name: p.name, error: String(outcome.message.errorTitle ?? "Meta rejected the send") });
      }
      continue;
    }
    result.sent += 1;
  }

  return NextResponse.json({ ...result, failures });
}
