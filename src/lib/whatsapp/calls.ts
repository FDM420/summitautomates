import { and, eq, inArray, isNull, lt, notInArray, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { contacts, whatsappCalls, whatsappMessages } from "@/lib/db/schema";
import { clip } from "./decode";
import { initiateCall, respondToCall, sendCallPermissionRequest } from "./graph";
import { getOrCreateWaContact } from "./inbound";

/**
 * WhatsApp voice calling (Business Calling API) — service layer.
 *
 * Ported from the tafsheen production build, minus its incident scar tissue and
 * WITH the fixes from its adversarial review baked in:
 *  - "connected" keys off `answeredAt IS NOT NULL`, never off employee stamps
 *    (outbound rows stamp `answeredByUserId` at DIAL time, for scoping only).
 *  - Duration is only ever computed from `answeredAt`; a never-connected call
 *    gets `durationSeconds: null` and status `missed`, never a fake talk time.
 *  - Every transition is a status-GUARDED update (compare-and-set) so webhook
 *    redeliveries, the sweeper, and user actions race safely.
 *  - answer() claims the row atomically BEFORE calling Meta, so a concurrent
 *    terminate/second-answer loses cleanly instead of corrupting state.
 */

const CALL_FIELDS = {
  id: whatsappCalls.id,
  contactId: whatsappCalls.contactId,
  waCallId: whatsappCalls.waCallId,
  direction: whatsappCalls.direction,
  status: whatsappCalls.status,
  sdpOffer: whatsappCalls.sdpOffer,
  sdpAnswer: whatsappCalls.sdpAnswer,
  startedAt: whatsappCalls.startedAt,
  answeredAt: whatsappCalls.answeredAt,
  endReason: whatsappCalls.endReason,
  lastHeartbeatAt: whatsappCalls.lastHeartbeatAt,
};

const TERMINAL = ["ended", "missed", "failed"] as const;

export type CallOutcome<T = { ok: true }> = T | { ok: false; status: number; error: string };

// --- Webhook ingest --------------------------------------------------------

/** The slice of Meta's `calls` webhook payload we read. */
export type RawCallEvent = {
  id?: string;
  from?: string;
  to?: string;
  event?: string; // "connect" | "terminate" | ...
  timestamp?: string | number;
  direction?: string;
  session?: { sdp_type?: string; sdp?: string };
  /** On terminate: Meta's own view of the outcome. */
  status?: string;
  /** On terminate: CONNECTED duration in seconds (absent/0 if never connected). */
  duration?: number;
};

/**
 * Handle one Meta `calls` webhook event. Idempotent under at-least-once
 * delivery: inserts are ON CONFLICT no-ops on `waCallId`, updates are
 * status-guarded so a redelivered `connect` can never resurrect an ended call
 * and a duplicate `terminate` can never rewrite a closed one.
 */
export async function ingestCallEvent(
  call: RawCallEvent,
  nameByWaId?: Map<string, string>,
): Promise<void> {
  const waCallId = call.id;
  const event = call.event;
  if (!waCallId || !event) return;

  const [existing] = await db
    .select(CALL_FIELDS)
    .from(whatsappCalls)
    .where(eq(whatsappCalls.waCallId, waCallId))
    .limit(1);

  if (event === "connect") {
    if (existing) {
      // Outbound: the customer accepted — their SDP answer rides this event.
      // Guarded on `ringing` so a redelivery after the call ended is a no-op
      // (a redelivered connect once resurrected ENDED calls in tafsheen).
      if (existing.direction === "outbound" && call.session?.sdp && !existing.answeredAt) {
        await db
          .update(whatsappCalls)
          .set({
            status: "answered",
            sdpAnswer: call.session.sdp,
            answeredAt: new Date(),
            event: "connect",
            updatedAt: new Date(),
          })
          .where(and(eq(whatsappCalls.id, existing.id), eq(whatsappCalls.status, "ringing")));
      }
      return; // inbound redelivery → exact no-op
    }

    // New inbound ring: store the offer; the dock's poll picks it up.
    if (!call.from || !call.session?.sdp) return;
    const contact = await getOrCreateWaContact(call.from, nameByWaId?.get(call.from) ?? null);
    if (contact.blocked) {
      await respondToCall({ callId: waCallId, action: "reject" }).catch(() => undefined);
      return;
    }
    await db
      .insert(whatsappCalls)
      .values({
        contactId: contact.id,
        waCallId,
        direction: "inbound",
        status: "ringing",
        event: "connect",
        sdpOffer: call.session.sdp,
      })
      .onConflictDoNothing({ target: whatsappCalls.waCallId });
    return;
  }

  if (event === "terminate") {
    if (!existing) return;
    if ((TERMINAL as readonly string[]).includes(existing.status)) return; // duplicate

    // Connected ⇔ answeredAt stamped. NEVER key off employee stamps or fall
    // back to startedAt — that's how tafsheen logged ring time as talk time.
    const answered = existing.answeredAt != null;
    const metaDuration =
      typeof call.duration === "number" && Number.isFinite(call.duration) && call.duration > 0
        ? Math.round(call.duration)
        : null;
    const secs = answered
      ? (metaDuration ??
        Math.max(0, Math.round((Date.now() - existing.answeredAt!.getTime()) / 1000)))
      : null;

    const closed = await db
      .update(whatsappCalls)
      .set({
        status: answered ? "ended" : "missed",
        event: "terminate",
        endReason: answered
          ? "caller-hangup"
          : existing.direction === "outbound"
            ? "no-answer"
            : "missed",
        endedAt: new Date(),
        durationSeconds: secs,
        updatedAt: new Date(),
      })
      .where(
        and(eq(whatsappCalls.id, existing.id), notInArray(whatsappCalls.status, [...TERMINAL])),
      )
      .returning({ id: whatsappCalls.id });
    if (closed.length === 0) return; // another closer won the race

    if (answered && secs != null && secs > 0) {
      await postCallEndedLine(existing.id, existing.contactId, secs);
    } else if (!answered && existing.direction === "inbound") {
      await postMissedCallLine(existing.id, existing.contactId);
    }
  }
}

/**
 * The customer answered our call-permission request (tapped Allow / Decline).
 * Arrives as an interactive message with type `call_permission_reply`.
 */
export async function handleCallPermissionReply(
  contactId: string,
  interactive: unknown,
): Promise<void> {
  const reply = (
    interactive as {
      call_permission_reply?: { response?: string; expiration_timestamp?: number };
    }
  )?.call_permission_reply;
  if (!reply?.response) return;
  const granted = String(reply.response).toLowerCase() === "accept";
  const expiresAt = granted
    ? typeof reply.expiration_timestamp === "number"
      ? new Date(reply.expiration_timestamp * 1000)
      : new Date(Date.now() + 7 * 24 * 3600 * 1000) // Meta's default grant ≈ 7 days
    : null;
  const now = new Date();
  await db
    .update(contacts)
    .set({
      waCallPermissionStatus: granted ? "granted" : "rejected",
      waCallPermissionExpiresAt: expiresAt,
      waLastMessagePreview: granted ? "✅ Allowed WhatsApp calls" : "✋ Declined WhatsApp calls",
      updatedAt: now,
    })
    .where(eq(contacts.id, contactId));
}

// --- Agent actions ---------------------------------------------------------

/**
 * Accept a ringing inbound call with the browser's SDP answer.
 *
 * Claims the row atomically FIRST (compare-and-set on `ringing`): a double-tap,
 * a second device, or a concurrent caller-hangup loses the claim and gets a
 * clean 409 instead of sending Meta a second SDP. If Meta then refuses the
 * accept (caller already gone), the claim is rolled back to `failed` so the
 * row never sits as a phantom answered call.
 */
export async function answerCall(
  id: string,
  sdpAnswer: string,
  userId: string,
): Promise<CallOutcome> {
  if (!sdpAnswer) return { ok: false, status: 400, error: "Missing sdpAnswer" };
  const now = new Date();
  const claimed = await db
    .update(whatsappCalls)
    .set({
      status: "answered",
      sdpAnswer,
      answeredAt: now,
      answeredByUserId: userId,
      lastHeartbeatAt: now,
      updatedAt: now,
    })
    .where(and(eq(whatsappCalls.id, id), eq(whatsappCalls.status, "ringing")))
    .returning({ waCallId: whatsappCalls.waCallId });
  if (!claimed[0]) {
    return { ok: false, status: 409, error: "Call is no longer ringing" };
  }

  const res = await respondToCall({ callId: claimed[0].waCallId, action: "accept", sdpAnswer });
  if ("error" in res) {
    // Roll back our own claim (guarded, so a webhook terminate that slipped in
    // between keeps its terminal write). No talk time, no phantom answered row.
    await db
      .update(whatsappCalls)
      .set({
        status: "failed",
        answeredAt: null,
        endReason: "accept-failed",
        endedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(whatsappCalls.id, id), eq(whatsappCalls.status, "answered")));
    return {
      ok: false,
      status: 502,
      error: res.error.title ?? res.error.message ?? "Could not accept the call",
    };
  }
  return { ok: true };
}

/** Decline a ringing inbound call. */
export async function rejectCall(id: string): Promise<CallOutcome> {
  const [row] = await db
    .select(CALL_FIELDS)
    .from(whatsappCalls)
    .where(eq(whatsappCalls.id, id))
    .limit(1);
  if (!row) return { ok: false, status: 404, error: "Call not found" };
  if ((TERMINAL as readonly string[]).includes(row.status)) return { ok: true }; // idempotent

  // Meta may already consider the call over ("already terminated" 4xx) — that
  // is success for our purposes, so errors are ignored.
  await respondToCall({ callId: row.waCallId, action: "reject" }).catch(() => undefined);
  const closed = await db
    .update(whatsappCalls)
    .set({
      status: "missed",
      endReason: "rejected",
      endedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(and(eq(whatsappCalls.id, id), eq(whatsappCalls.status, "ringing")))
    .returning({ id: whatsappCalls.id });
  if (closed.length > 0 && row.direction === "inbound") {
    await postMissedCallLine(row.id, row.contactId, "declined");
  }
  return { ok: true };
}

/**
 * End a call. Connected (`answeredAt` set) → `ended` with real talk time and a
 * chat line. Never connected (an outbound dial the rep cancelled, or a ring we
 * want to kill) → `missed`/cancelled with NO duration and NO talk-time line —
 * tafsheen's hangup logged ring time as talk time on every outbound cancel.
 */
export async function hangupCall(id: string): Promise<CallOutcome> {
  const [row] = await db
    .select(CALL_FIELDS)
    .from(whatsappCalls)
    .where(eq(whatsappCalls.id, id))
    .limit(1);
  if (!row) return { ok: false, status: 404, error: "Call not found" };
  if ((TERMINAL as readonly string[]).includes(row.status)) return { ok: true }; // idempotent

  // A Meta "already terminated" 4xx is fine — close our side regardless.
  await respondToCall({ callId: row.waCallId, action: "terminate" }).catch(() => undefined);

  if (row.answeredAt) {
    const secs = Math.max(0, Math.round((Date.now() - row.answeredAt.getTime()) / 1000));
    const closed = await db
      .update(whatsappCalls)
      .set({
        status: "ended",
        event: "terminate",
        endReason: "hangup",
        endedAt: new Date(),
        durationSeconds: secs,
        updatedAt: new Date(),
      })
      .where(and(eq(whatsappCalls.id, id), eq(whatsappCalls.status, "answered")))
      .returning({ id: whatsappCalls.id });
    if (closed.length > 0 && secs > 0) await postCallEndedLine(row.id, row.contactId, secs);
  } else {
    await db
      .update(whatsappCalls)
      .set({
        status: "missed",
        event: "terminate",
        endReason: row.direction === "outbound" ? "cancelled" : "rejected",
        endedAt: new Date(),
        durationSeconds: null,
        updatedAt: new Date(),
      })
      .where(and(eq(whatsappCalls.id, id), eq(whatsappCalls.status, "ringing")));
  }
  return { ok: true };
}

/**
 * Liveness ping (~15s) from the dock while a call is connected, so the sweeper
 * can free the Meta leg if the tab dies. Scoped to the answering user — an
 * unknown/ended id or someone else's call is a harmless no-op.
 */
export async function heartbeat(id: string, userId: string): Promise<void> {
  await db
    .update(whatsappCalls)
    .set({ lastHeartbeatAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(whatsappCalls.id, id),
        eq(whatsappCalls.status, "answered"),
        eq(whatsappCalls.answeredByUserId, userId),
      ),
    );
}

// --- Outbound --------------------------------------------------------------

/**
 * Place a business-initiated call. The browser supplies the SDP offer; Meta
 * enforces the customer's call permission — a permission failure comes back as
 * a clear, actionable message. The customer's SDP answer arrives later on the
 * connect webhook; the dialing dock picks it up from its poll.
 */
export async function initiateOutboundCall(
  contactId: string,
  sdpOffer: string,
  userId: string,
): Promise<CallOutcome<{ ok: true; callId: string }>> {
  if (!sdpOffer) return { ok: false, status: 400, error: "Missing SDP offer" };
  const [contact] = await db
    .select({ waId: contacts.waId, blockedAt: contacts.waBlockedAt })
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);
  if (!contact) return { ok: false, status: 404, error: "Contact not found" };
  if (!contact.waId) return { ok: false, status: 400, error: "Contact has no WhatsApp thread" };
  if (contact.blockedAt) return { ok: false, status: 400, error: "Contact is blocked" };

  // One line, one live call at a time.
  const [live] = await db
    .select({ id: whatsappCalls.id })
    .from(whatsappCalls)
    .where(inArray(whatsappCalls.status, ["ringing", "answered"]))
    .limit(1);
  if (live) return { ok: false, status: 409, error: "Another call is already in progress" };

  const res = await initiateCall({ to: contact.waId, sdpOffer });
  if ("error" in res) {
    const msg = res.error.title ?? res.error.message ?? "Could not place the call";
    // Meta rejects calls without the customer's opt-in — translate to a next step.
    if (/permission|consent|not allowed|opt[- ]?in|138\d{3}|139\d{3}/i.test(msg)) {
      return {
        ok: false,
        status: 400,
        error:
          "This customer hasn't allowed WhatsApp calls yet. Send a call-permission request first — once they tap Allow, call again.",
      };
    }
    return { ok: false, status: 502, error: msg };
  }

  const [row] = await db
    .insert(whatsappCalls)
    .values({
      contactId,
      waCallId: res.callId,
      direction: "outbound",
      status: "ringing",
      event: "connect",
      sdpOffer,
      // Scoping stamp ONLY (heartbeat/CDR). Connection truth lives in
      // answeredAt, which the connect webhook stamps on customer pickup.
      answeredByUserId: userId,
    })
    .returning({ id: whatsappCalls.id });

  // A successful initiate implies permission is currently granted.
  await db
    .update(contacts)
    .set({ waCallPermissionStatus: "granted", updatedAt: new Date() })
    .where(and(eq(contacts.id, contactId), isNull(contacts.waCallPermissionStatus)))
    .catch(() => undefined);

  return { ok: true, callId: row.id };
}

const PERMISSION_TEXT =
  "We'd like to call you on WhatsApp — it's a free voice call over your internet connection. May we call you?";

/** Send the customer Meta's call-permission opt-in (needs an open 24h window). */
export async function requestCallPermission(
  contactId: string,
  userId: string,
): Promise<CallOutcome> {
  const [contact] = await db
    .select({
      waId: contacts.waId,
      blockedAt: contacts.waBlockedAt,
      windowExpiresAt: contacts.waWindowExpiresAt,
    })
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);
  if (!contact) return { ok: false, status: 404, error: "Contact not found" };
  if (!contact.waId) return { ok: false, status: 400, error: "Contact has no WhatsApp thread" };
  if (contact.blockedAt) return { ok: false, status: 400, error: "Contact is blocked" };
  const windowOpen = contact.windowExpiresAt && contact.windowExpiresAt.getTime() > Date.now();
  if (!windowOpen) {
    return {
      ok: false,
      status: 400,
      error:
        "The 24-hour window is closed — the permission request can only be sent after the customer messages you.",
    };
  }

  const sent = await sendCallPermissionRequest(contact.waId, PERMISSION_TEXT);
  if ("error" in sent) {
    return {
      ok: false,
      status: 502,
      error: sent.error.title ?? sent.error.message ?? "Could not send the permission request",
    };
  }

  const now = new Date();
  await db.insert(whatsappMessages).values({
    contactId,
    direction: "outbound",
    type: "interactive",
    status: "sent",
    body: `🔔 Requested permission to call. "${PERMISSION_TEXT}"`,
    payload: { callPermissionRequest: true },
    providerMessageId: sent.id,
    sentByUserId: userId,
    sentAt: now,
    occurredAt: now,
  });
  await db
    .update(contacts)
    .set({
      waCallPermissionStatus: "pending",
      waLastMessageAt: now,
      waLastMessagePreview: "🔔 Call permission requested",
      waLastOutboundAt: now,
      lastActivityAt: now,
      updatedAt: now,
    })
    .where(eq(contacts.id, contactId));
  return { ok: true };
}

// --- Dock polling + sweeper ------------------------------------------------

export type ActiveCallView = {
  id: string;
  contactId: string;
  direction: "inbound" | "outbound";
  status: string;
  endReason: string | null;
  name: string;
  phone: string | null;
  /** Present on an outbound call once the customer accepted (apply once). */
  sdpAnswer: string | null;
};

/**
 * The dock's poll: sweeps stale calls, then reports (a) the row the dock is
 * tracking (any status — this is how the dock learns the caller hung up) and
 * (b) the newest ringing inbound call, for a fresh ring. Contact display data
 * is joined in so the card can render immediately.
 */
export async function getActiveCalls(watchId?: string | null): Promise<{
  watched: ActiveCallView | null;
  ringing: ActiveCallView | null;
}> {
  await sweepStaleCalls().catch((e) => console.error("[calls] sweep failed:", e));

  const view = (r: {
    id: string;
    contactId: string;
    direction: "inbound" | "outbound";
    status: string;
    endReason: string | null;
    sdpAnswer: string | null;
    name: string | null;
    profileName: string | null;
    phone: string | null;
    waId: string | null;
  }): ActiveCallView => ({
    id: r.id,
    contactId: r.contactId,
    direction: r.direction,
    status: r.status,
    endReason: r.endReason,
    name: r.profileName || r.name || (r.phone ?? r.waId ?? "Unknown"),
    phone: r.phone ?? (r.waId ? `+${r.waId}` : null),
    // The dialing dock needs the customer's answer; everyone else doesn't.
    sdpAnswer: r.direction === "outbound" && r.status === "answered" ? r.sdpAnswer : null,
  });

  const SELECT = {
    id: whatsappCalls.id,
    contactId: whatsappCalls.contactId,
    direction: whatsappCalls.direction,
    status: whatsappCalls.status,
    endReason: whatsappCalls.endReason,
    sdpAnswer: whatsappCalls.sdpAnswer,
    name: contacts.displayName,
    profileName: contacts.waProfileName,
    phone: contacts.phone,
    waId: contacts.waId,
  };

  let watched: ActiveCallView | null = null;
  if (watchId) {
    const [w] = await db
      .select(SELECT)
      .from(whatsappCalls)
      .innerJoin(contacts, eq(contacts.id, whatsappCalls.contactId))
      .where(eq(whatsappCalls.id, watchId))
      .limit(1);
    if (w) watched = view(w);
  }

  const [r] = await db
    .select(SELECT)
    .from(whatsappCalls)
    .innerJoin(contacts, eq(contacts.id, whatsappCalls.contactId))
    .where(and(eq(whatsappCalls.status, "ringing"), eq(whatsappCalls.direction, "inbound")))
    .orderBy(whatsappCalls.createdAt)
    .limit(1);
  const ringing = r && r.id !== watchId ? view(r) : null;

  return { watched, ringing };
}

const RING_TTL_MS = 90_000;
const HEARTBEAT_STALE_MS = 120_000; // 8 missed 15s beats (web-only clients)
const NO_HEARTBEAT_TTL_MS = 10 * 60_000; // answered but never once pinged

/**
 * Reap stale calls so a crashed tab or an unanswered ring can't leave zombies:
 *  - ringing past 90s → missed (ring-timeout) + missed-call line for inbound
 *  - answered with a stale/absent heartbeat → terminate the Meta leg + ended
 *    (orphan-timeout), duration anchored on the LAST HEARTBEAT, not on now —
 *    so a dead tab doesn't inflate talk time by the detection delay.
 * Cheap enough to run on every dock poll.
 */
export async function sweepStaleCalls(): Promise<void> {
  const now = Date.now();

  const rangOut = await db
    .update(whatsappCalls)
    .set({
      status: "missed",
      endReason: "ring-timeout",
      endedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(whatsappCalls.status, "ringing"),
        lt(whatsappCalls.createdAt, new Date(now - RING_TTL_MS)),
      ),
    )
    .returning({
      id: whatsappCalls.id,
      contactId: whatsappCalls.contactId,
      direction: whatsappCalls.direction,
    });
  for (const r of rangOut) {
    if (r.direction === "inbound") await postMissedCallLine(r.id, r.contactId);
  }

  const zombies = await db
    .select(CALL_FIELDS)
    .from(whatsappCalls)
    .where(
      and(
        eq(whatsappCalls.status, "answered"),
        or(
          lt(whatsappCalls.lastHeartbeatAt, new Date(now - HEARTBEAT_STALE_MS)),
          and(
            isNull(whatsappCalls.lastHeartbeatAt),
            lt(whatsappCalls.startedAt, new Date(now - NO_HEARTBEAT_TTL_MS)),
          ),
        ),
      ),
    )
    .limit(20);

  for (const z of zombies) {
    await respondToCall({ callId: z.waCallId, action: "terminate" }).catch(() => undefined);
    const anchor = z.lastHeartbeatAt ?? z.answeredAt;
    const secs =
      z.answeredAt && anchor
        ? Math.max(0, Math.round((anchor.getTime() - z.answeredAt.getTime()) / 1000))
        : null;
    const closed = await db
      .update(whatsappCalls)
      .set({
        status: "ended",
        event: "terminate",
        endReason: "orphan-timeout",
        endedAt: new Date(),
        durationSeconds: secs,
        updatedAt: new Date(),
      })
      .where(and(eq(whatsappCalls.id, z.id), eq(whatsappCalls.status, "answered")))
      .returning({ id: whatsappCalls.id });
    if (closed.length > 0 && secs != null && secs > 0) {
      await postCallEndedLine(z.id, z.contactId, secs);
    }
  }
}

// --- Thread lines ----------------------------------------------------------

function fmtTalkTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")} min ${String(s).padStart(2, "0")} sec`;
}

/**
 * "📞 Call ended — Talk time: MM min SS sec" as a SYSTEM line in the thread.
 * Idempotent per call via the unique idempotencyKey, so every end path
 * (hangup, caller terminate, sweeper) can post it and only one line lands.
 * Best-effort: never throws into call teardown.
 */
async function postCallEndedLine(callId: string, contactId: string, secs: number): Promise<void> {
  const now = new Date();
  const body = `📞 Call ended — Talk time: ${fmtTalkTime(secs)}`;
  try {
    const inserted = await db
      .insert(whatsappMessages)
      .values({
        contactId,
        direction: "outbound", // business-side record — never counts as unread
        type: "system",
        status: "sent",
        body,
        idempotencyKey: `call-ended-${callId}`,
        sentAt: now,
        occurredAt: now,
      })
      .onConflictDoNothing({ target: whatsappMessages.idempotencyKey })
      .returning({ id: whatsappMessages.id });
    if (inserted.length > 0) {
      await db
        .update(contacts)
        .set({
          waLastMessageAt: now,
          waLastMessagePreview: clip(body),
          lastActivityAt: now,
          updatedAt: now,
        })
        .where(eq(contacts.id, contactId));
    }
  } catch (e) {
    console.error("[calls] talk-time line failed:", e);
  }
}

/**
 * "📞 Missed voice call" (or declined) in the thread. A genuine miss counts as
 * unread + awaiting-reply so the owner sees it in the inbox; a deliberate
 * decline is just a record. Idempotent per call.
 */
async function postMissedCallLine(
  callId: string,
  contactId: string,
  kind: "missed" | "declined" = "missed",
): Promise<void> {
  const now = new Date();
  const body = kind === "missed" ? "📞 Missed voice call" : "📞 Declined voice call";
  try {
    const inserted = await db
      .insert(whatsappMessages)
      .values({
        contactId,
        direction: kind === "missed" ? "inbound" : "outbound",
        type: "system",
        status: kind === "missed" ? "received" : "sent",
        body,
        idempotencyKey: `call-${kind}-${callId}`,
        occurredAt: now,
        ...(kind === "declined" ? { sentAt: now } : {}),
      })
      .onConflictDoNothing({ target: whatsappMessages.idempotencyKey })
      .returning({ id: whatsappMessages.id });
    if (inserted.length === 0) return;
    if (kind === "missed") {
      const [c] = await db
        .select({ unread: contacts.waUnreadCount })
        .from(contacts)
        .where(eq(contacts.id, contactId))
        .limit(1);
      await db
        .update(contacts)
        .set({
          waLastMessageAt: now,
          waLastMessagePreview: body,
          waUnreadCount: (c?.unread ?? 0) + 1,
          waAwaitingReply: true,
          lastActivityAt: now,
          lastInboundAt: now,
          updatedAt: now,
        })
        .where(eq(contacts.id, contactId));
    } else {
      await db
        .update(contacts)
        .set({
          waLastMessageAt: now,
          waLastMessagePreview: body,
          lastActivityAt: now,
          updatedAt: now,
        })
        .where(eq(contacts.id, contactId));
    }
  } catch (e) {
    console.error("[calls] missed-call line failed:", e);
  }
}
