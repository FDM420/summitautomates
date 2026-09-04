import { Storage } from "@google-cloud/storage";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { whatsappMessages } from "@/lib/db/schema";
import { downloadMedia, getMediaInfo } from "./graph";

/**
 * Media re-hosting to Cloud Storage.
 *
 * Meta's media URLs expire in ~5 minutes and media ids in ~30 days, so on first
 * sight we copy the bytes into our own bucket and store ONLY the object key.
 * Runs on Cloud Run with Application Default Credentials (keyless) — the App
 * Hosting service account needs roles/storage.objectAdmin on the bucket.
 * Any failure leaves `media_key = meta:<id>` so it can be retried later.
 */
const BUCKET = process.env.GCS_BUCKET?.trim();

const globalForGcs = globalThis as unknown as { __summitStorage?: Storage };
function storage(): Storage {
  return (globalForGcs.__summitStorage ??= new Storage());
}

/** "audio/ogg; codecs=opus" → "audio/ogg". */
export function bareMime(mime: string | undefined | null): string {
  return (mime ?? "application/octet-stream").split(";")[0].trim().toLowerCase();
}

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/3gpp": "3gp",
  "audio/ogg": "ogg",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
  "audio/amr": "amr",
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
};

export function extForMime(mime: string): string {
  const m = bareMime(mime);
  return EXT[m] ?? (m.split("/")[1]?.replace(/[^a-z0-9]/g, "") || "bin");
}

export function storageConfigured(): boolean {
  return Boolean(BUCKET);
}

/**
 * Copy an inbound Meta media object into our bucket and update the message row.
 * Idempotent: if the row already has a non-`meta:` key, it's a no-op.
 */
export async function rehostInboundMedia(
  messageId: string,
  mediaId: string,
): Promise<boolean> {
  if (!BUCKET) {
    console.warn("[media] GCS_BUCKET not set; leaving meta:<id> reference");
    return false;
  }
  try {
    const [row] = await db
      .select({ mediaKey: whatsappMessages.mediaKey })
      .from(whatsappMessages)
      .where(eq(whatsappMessages.id, messageId))
      .limit(1);
    if (row?.mediaKey && !row.mediaKey.startsWith("meta:")) return true;

    const info = await getMediaInfo(mediaId);
    if (!info?.url) return false;
    const bytes = await downloadMedia(info.url);
    if (!bytes) return false;

    const mime = bareMime(info.mime_type);
    const key = `whatsapp/media/${messageId}.${extForMime(mime)}`;
    await storage()
      .bucket(BUCKET)
      .file(key)
      .save(bytes, { contentType: mime, resumable: false });

    await db
      .update(whatsappMessages)
      .set({
        mediaKey: key,
        mediaMime: mime,
        mediaSizeBytes: info.file_size ?? bytes.length,
        mediaSha256: info.sha256 ?? null,
        updatedAt: new Date(),
      })
      .where(eq(whatsappMessages.id, messageId));
    return true;
  } catch (error) {
    console.error("[media] rehost failed:", error);
    return false;
  }
}

/** Short-lived V4 signed URL so <img>/<video>/<audio> can load the object directly. */
export async function signedReadUrl(key: string, minutes = 5): Promise<string | null> {
  if (!BUCKET) return null;
  try {
    const [url] = await storage()
      .bucket(BUCKET)
      .file(key)
      .getSignedUrl({ version: "v4", action: "read", expires: Date.now() + minutes * 60_000 });
    return url;
  } catch (error) {
    console.error("[media] signedReadUrl failed:", error);
    return null;
  }
}

/**
 * Prove the runtime can write + read + delete in the bucket (IAM check).
 * Used by the admin storage-check route after deploys.
 */
export async function storageSelfTest(): Promise<{ ok: boolean; bucket: string | null; error?: string }> {
  if (!BUCKET) return { ok: false, bucket: null, error: "GCS_BUCKET not set" };
  const key = `whatsapp/tmp/selftest-${Date.now()}.txt`;
  try {
    const file = storage().bucket(BUCKET).file(key);
    await file.save("ok", { contentType: "text/plain", resumable: false });
    const [meta] = await file.getMetadata();
    await file.delete();
    return { ok: Boolean(meta?.name), bucket: BUCKET };
  } catch (error) {
    return { ok: false, bucket: BUCKET, error: error instanceof Error ? error.message : String(error) };
  }
}

/** Save bytes we produced ourselves (CRM uploads). Returns the object key. */
export async function saveOutboundMedia(
  messageId: string,
  bytes: Buffer,
  mime: string,
): Promise<string | null> {
  if (!BUCKET) return null;
  try {
    const m = bareMime(mime);
    const key = `whatsapp/outbound/${messageId}.${extForMime(m)}`;
    await storage().bucket(BUCKET).file(key).save(bytes, { contentType: m, resumable: false });
    return key;
  } catch (error) {
    console.error("[media] saveOutboundMedia failed:", error);
    return null;
  }
}
