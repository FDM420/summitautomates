import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { whatsappMessages } from "@/lib/db/schema";
import {
  contentDisposition,
  readObject,
  rehostInboundMedia,
  signedReadUrl,
} from "@/lib/whatsapp/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Serve a message's media to the CRM: auth-check, then prefer a 302 to a
 * 5-minute signed URL (native <img>/<video>/<audio> loading, Range support);
 * if signing isn't available, stream the bytes through this route. If the
 * media was never re-hosted (`meta:<id>`), try again now while Meta holds it.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { messageId } = await params;
  if (!UUID.test(messageId)) return NextResponse.json({ error: "No media" }, { status: 404 });

  const load = () =>
    db
      .select({ mediaKey: whatsappMessages.mediaKey, mediaFilename: whatsappMessages.mediaFilename })
      .from(whatsappMessages)
      .where(eq(whatsappMessages.id, messageId))
      .limit(1);

  let [row] = await load();
  if (!row?.mediaKey) return NextResponse.json({ error: "No media" }, { status: 404 });

  if (row.mediaKey.startsWith("meta:")) {
    await rehostInboundMedia(messageId, row.mediaKey.slice("meta:".length));
    [row] = await load();
    if (!row?.mediaKey || row.mediaKey.startsWith("meta:")) {
      return NextResponse.json({ error: "Media unavailable" }, { status: 503 });
    }
  }

  const url = await signedReadUrl(row.mediaKey, 5, row.mediaFilename);
  if (url) return NextResponse.redirect(url, { status: 302 });

  // Fallback: stream through us (works with objectAdmin alone).
  const obj = await readObject(row.mediaKey);
  if (!obj) return NextResponse.json({ error: "Storage unavailable" }, { status: 500 });
  const headers: Record<string, string> = {
    "content-type": obj.contentType,
    "content-disposition": contentDisposition(row.mediaFilename, row.mediaKey),
    "cache-control": "private, max-age=300",
  };
  if (obj.size) headers["content-length"] = String(obj.size);
  return new Response(obj.stream, { status: 200, headers });
}
