import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { sendHumanTemplate } from "@/lib/whatsapp/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Send an approved template to a prospect — first-touch outreach. Finds or
 * creates the CRM contact for the prospect's number and links it back.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await request.json().catch(() => null)) as {
    templateName?: unknown;
    language?: unknown;
    bodyParams?: unknown;
    bodyText?: unknown;
    idempotencyKey?: unknown;
  } | null;

  const templateName = typeof body?.templateName === "string" ? body.templateName.trim() : "";
  const language = typeof body?.language === "string" ? body.language.trim() : "";
  const bodyText = typeof body?.bodyText === "string" ? body.bodyText.trim() : "";
  const idempotencyKey = typeof body?.idempotencyKey === "string" ? body.idempotencyKey : "";
  const bodyParams = Array.isArray(body?.bodyParams)
    ? body.bodyParams.filter((p): p is string => typeof p === "string")
    : undefined;

  if (!templateName || !language || !bodyText) {
    return NextResponse.json({ error: "Missing template fields" }, { status: 400 });
  }
  if (idempotencyKey.length < 8) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  if (
    templateName.length > 512 ||
    language.length > 15 ||
    bodyText.length > 4096 ||
    idempotencyKey.length > 128 ||
    (bodyParams && (bodyParams.length > 20 || bodyParams.some((p) => p.length > 1024)))
  ) {
    return NextResponse.json({ error: "Template fields out of bounds" }, { status: 400 });
  }

  const result = await sendHumanTemplate({
    prospectId: id,
    templateName,
    language,
    bodyParams,
    bodyText,
    userId: user.id,
    idempotencyKey,
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ message: result.message });
}
