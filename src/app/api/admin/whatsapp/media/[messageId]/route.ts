import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { whatsappMessages } from "@/lib/db/schema";
import { rehostInboundMedia, signedReadUrl } from "@/lib/whatsapp/media";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Serve a message's media to the CRM: auth-check, then 302 to a 5-minute
 * signed URL so <img>/<video>/<audio> load natively (with Range support).
 * If the media was never re-hosted (`meta:<id>`), try again now while Meta
 * still holds the asset.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ messageId: string }> },
) {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { messageId } = await params;

  const load = () =>
    db
      .select({ mediaKey: whatsappMessages.mediaKey })
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

  const url = await signedReadUrl(row.mediaKey, 5);
  if (!url) return NextResponse.json({ error: "Storage unavailable" }, { status: 500 });
  return NextResponse.redirect(url, { status: 302 });
}
