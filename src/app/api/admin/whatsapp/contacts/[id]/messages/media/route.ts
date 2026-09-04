import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { sendHumanMedia } from "@/lib/whatsapp/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BYTES = 100 * 1024 * 1024;

/** Upload + send a media message (photo/video/voice/document) from the CRM. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  const idempotencyKey = String(form?.get("idempotencyKey") ?? "");
  const caption = String(form?.get("caption") ?? "").trim();
  const voice = String(form?.get("voice") ?? "") === "true";

  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (idempotencyKey.length < 8) return NextResponse.json({ error: "Missing key" }, { status: 400 });
  if (file.size === 0) return NextResponse.json({ error: "Empty file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File too large (max 100 MB)" }, { status: 400 });

  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await sendHumanMedia({
    contactId: id,
    userId: user.id,
    bytes,
    mime: file.type || "application/octet-stream",
    filename: file.name || "file",
    caption: caption || undefined,
    voice,
    idempotencyKey,
  });

  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status });
  return NextResponse.json({ message: result.message });
}
