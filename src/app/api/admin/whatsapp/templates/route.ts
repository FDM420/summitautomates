import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { listMessageTemplates } from "@/lib/whatsapp/graph";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Live message-template approval status from Meta. Admin-gated; the access token
 * stays server-side. The panel at /admin/templates renders the result.
 */
export async function GET() {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await listMessageTemplates();
  if ("error" in result) {
    return NextResponse.json(
      { error: result.error.message ?? "Failed to load templates from Meta" },
      { status: 502 },
    );
  }
  return NextResponse.json({ templates: result.templates });
}
