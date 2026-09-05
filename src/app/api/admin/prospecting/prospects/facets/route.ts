import { and, count, desc, eq, isNotNull, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { prospects } from "@/lib/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Distinct filter values with counts for the prospects FilterBar. Optional
 * `?countryCode=` scopes the city list (niches/countries stay global).
 */
export async function GET(request: Request) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(request.url);
  const countryCode = (url.searchParams.get("countryCode") ?? "").trim().toUpperCase();

  const cityConds = [isNotNull(prospects.city), ne(prospects.city, "")];
  if (countryCode) cityConds.push(eq(prospects.countryCode, countryCode));

  const [niches, cities, countries] = await Promise.all([
    db
      .select({ value: prospects.niche, count: count() })
      .from(prospects)
      .where(ne(prospects.niche, ""))
      .groupBy(prospects.niche)
      .orderBy(desc(count()))
      .limit(30),
    db
      .select({ value: prospects.city, count: count() })
      .from(prospects)
      .where(and(...cityConds))
      .groupBy(prospects.city)
      .orderBy(desc(count()))
      .limit(40),
    db
      .select({ code: prospects.countryCode, name: prospects.countryName, count: count() })
      .from(prospects)
      .where(ne(prospects.countryCode, ""))
      .groupBy(prospects.countryCode, prospects.countryName)
      .orderBy(desc(count()))
      .limit(50),
  ]);

  return NextResponse.json({ niches, cities, countries });
}
