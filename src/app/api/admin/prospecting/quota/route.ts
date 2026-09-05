import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getQuotas } from "@/lib/prospecting/quota";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Free-tier usage for both metered methods (search + details). */
export async function GET() {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ quotas: await getQuotas() });
}
