import { and, desc, eq, gt, ilike, isNotNull, isNull, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Inbox list: contacts that have a WhatsApp thread, awaiting-reply first, then
 * newest activity. `filter=all|unread|awaiting`, `search=` matches name or
 * phone digits (digits only when ≥3 of them).
 */
export async function GET(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const filter = url.searchParams.get("filter") ?? "all";
  const search = (url.searchParams.get("search") ?? "").trim();
  const limit = Math.max(1, Math.min(Math.trunc(Number(url.searchParams.get("limit"))) || 50, 200));

  const conds = [isNotNull(contacts.waId), isNull(contacts.archivedAt)];
  if (filter === "unread") conds.push(gt(contacts.waUnreadCount, 0));
  if (filter === "awaiting") conds.push(eq(contacts.waAwaitingReply, true));
  if (search) {
    const digits = search.replace(/\D/g, "");
    const byName = ilike(contacts.displayName, `%${search}%`);
    conds.push(
      digits.length >= 3
        ? (or(byName, ilike(contacts.phone, `%${digits}%`)) as ReturnType<typeof or>)!
        : byName,
    );
  }

  const rows = await db
    .select({
      id: contacts.id,
      displayName: contacts.displayName,
      phone: contacts.phone,
      waProfileName: contacts.waProfileName,
      waLastMessageAt: contacts.waLastMessageAt,
      waLastMessagePreview: contacts.waLastMessagePreview,
      waUnreadCount: contacts.waUnreadCount,
      waAwaitingReply: contacts.waAwaitingReply,
      waWindowExpiresAt: contacts.waWindowExpiresAt,
      waAutopilot: contacts.waAutopilot,
    })
    .from(contacts)
    .where(and(...conds))
    .orderBy(
      desc(contacts.waAwaitingReply),
      sql`${contacts.waLastMessageAt} desc nulls last`,
      desc(contacts.id),
    )
    .limit(limit);

  return NextResponse.json({ threads: rows });
}
