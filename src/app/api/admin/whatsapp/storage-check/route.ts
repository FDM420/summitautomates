import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { storageSelfTest } from "@/lib/whatsapp/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Admin-only: verifies the deployed app can write/read/delete in the media bucket. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await storageSelfTest();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
