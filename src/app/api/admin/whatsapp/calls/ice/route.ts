import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * ICE servers for the dock's RTCPeerConnection.
 *
 * Cloudflare TURN when configured (CLOUDFLARE_TURN_KEY_ID/_API_TOKEN), with
 * STALE-IF-ERROR reuse: minted creds are valid 24h, so a failed re-mint serves
 * the last good set until its real TTL instead of silently degrading — a
 * Cloudflare hiccup never takes calling down. Public STUN always rides along
 * as the fallback; production CDR data (tafsheen, 1000+ calls) shows srflx
 * paths carry essentially every call, so STUN-only is a workable floor.
 */
const STUN = [{ urls: ["stun:stun.l.google.com:19302", "stun:stun.cloudflare.com:3478"] }];

let cache: { servers: unknown[]; refreshAt: number; hardExpiresAt: number } | null = null;

async function cloudflareIce(): Promise<unknown[] | null> {
  const keyId = process.env.CLOUDFLARE_TURN_KEY_ID?.trim();
  const token = process.env.CLOUDFLARE_TURN_API_TOKEN?.trim();
  if (!keyId || !token) return null;
  const now = Date.now();
  if (cache && cache.refreshAt > now) return cache.servers;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${keyId}/credentials/generate-ice-servers`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ttl: 86400 }),
        signal: ctrl.signal,
      },
    ).finally(() => clearTimeout(t));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { iceServers?: unknown[] };
    const servers = Array.isArray(data.iceServers) ? data.iceServers : null;
    if (!servers?.length) throw new Error("empty iceServers");
    // Re-mint at 12h; keep serving until the true 24h expiry if re-mints fail.
    cache = { servers, refreshAt: now + 12 * 3600_000, hardExpiresAt: now + 24 * 3600_000 };
    return servers;
  } catch (e) {
    console.warn("[calls] Cloudflare TURN mint failed:", (e as Error).message);
    if (cache && cache.hardExpiresAt > now) return cache.servers; // stale-if-error
    return null;
  }
}

export async function GET() {
  if (!(await getCurrentUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cf = await cloudflareIce();
  return NextResponse.json({ iceServers: cf ? [...cf, ...STUN] : STUN });
}
