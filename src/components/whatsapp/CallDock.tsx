"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * In-CRM WhatsApp softphone. Mounted once globally in the admin layout.
 *
 * Poll-driven (no websockets in this stack): every ~2.5s the dock asks
 * `/api/admin/whatsapp/calls/active` for (a) the call it is tracking and
 * (b) any fresh inbound ring. The browser does the WebRTC: on Accept it takes
 * the stored SDP offer, produces an answer, and POSTs it; the backend relays
 * `accept` to Meta and two-way audio flows right here. Outbound is the mirror:
 * the browser offers, the customer's answer arrives via webhook → poll.
 *
 * Hardening carried over from the tafsheen adversarial review:
 *  - a failed /answer NEVER posts /hangup (it could kill a call answered on
 *    another device) — it tears down locally only;
 *  - every async flow carries a generation number (seqRef) checked after each
 *    await, so cancelling an outbound dial mid-flight actually cancels it
 *    (including a hangup for a call id learned only after the cancel);
 *  - the duration display resets at call start;
 *  - `disconnected` gets a 20s grace for native ICE recovery (WhatsApp
 *    call-control has no renegotiation path), only failed/closed is terminal.
 */

type Phase = "ringing" | "dialing" | "connecting" | "in-call" | "reconnecting" | "ended" | "error";

type ActiveCallView = {
  id: string;
  contactId: string;
  direction: "inbound" | "outbound";
  status: string;
  endReason: string | null;
  name: string;
  phone: string | null;
  sdpAnswer: string | null;
};

type CallCard = {
  callId: string | null; // null while an outbound dial awaits its id
  contactId: string;
  name: string;
  phone: string | null;
};

const POLL_MS = 2500;
const RING_TIMEOUT_MS = 45_000;
const DIAL_TIMEOUT_MS = 60_000;
const RECONNECT_GRACE_MS = 20_000;
const HEARTBEAT_MS = 15_000;

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Resolve once the SDP can safely be sent non-trickle. Meta's call-control
 * bakes all ICE candidates into ONE offer/answer (no trickle path), so wait
 * for a usable public candidate (srflx or relay — production CDR shows srflx
 * carries essentially every call) plus a short floor, hard-capped at 12s.
 */
function waitForIce(pc: RTCPeerConnection): Promise<void> {
  return new Promise((resolve) => {
    if (pc.iceGatheringState === "complete") return resolve();
    let settled = false;
    let sawPublic = false;
    const startedAt = Date.now();
    const finish = () => {
      if (settled) return;
      settled = true;
      pc.removeEventListener("icegatheringstatechange", onGather);
      pc.removeEventListener("icecandidate", onCand);
      clearInterval(poll);
      clearTimeout(cap);
      resolve();
    };
    const onGather = () => {
      if (pc.iceGatheringState === "complete") finish();
    };
    const onCand = (e: RTCPeerConnectionIceEvent) => {
      if (e.candidate && /\btyp (relay|srflx)\b/.test(e.candidate.candidate)) sawPublic = true;
    };
    const poll = setInterval(() => {
      if (sawPublic && Date.now() - startedAt > 1200) finish();
    }, 250);
    const cap = setTimeout(finish, 12_000);
    pc.addEventListener("icegatheringstatechange", onGather);
    pc.addEventListener("icecandidate", onCand);
  });
}

async function api<T = Record<string, unknown>>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await fetch(`/api/admin/whatsapp/calls${path}`, {
    ...init,
    headers: init?.body ? { "content-type": "application/json", ...init?.headers } : init?.headers,
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, data };
}

export function CallDock() {
  const router = useRouter();
  const [call, setCall] = useState<CallCard | null>(null);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [muted, setMuted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showReqPerm, setShowReqPerm] = useState(false);

  // Generation number: bumped on every call start AND every teardown. Async
  // continuations capture it at entry and bail after any await if it moved.
  const seqRef = useRef(0);
  const activeIdRef = useRef<string | null>(null);
  // A ring we just declined/dismissed: don't let the next poll re-ring it while
  // the server-side reject is still in flight.
  const dismissedIdRef = useRef<string | null>(null);
  const phaseRef = useRef<Phase | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const remoteAppliedRef = useRef(false); // outbound: answer SDP applied once
  const answeredRef = useRef(false); // timer started (real audio confirmed)
  const outboundRef = useRef(false);
  const wasConnectedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringToneRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioWaitRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // --- tones ---------------------------------------------------------------
  const tone = useCallback((notes: [number, number, number][]) => {
    try {
      let ctx = audioCtxRef.current;
      if (!ctx) {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        ctx = new Ctor();
        audioCtxRef.current = ctx;
      }
      if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
      const now = ctx.currentTime;
      for (const [freq, start, dur] of notes) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, now + start);
        g.gain.linearRampToValueAtTime(0.28, now + start + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);
        osc.connect(g).connect(ctx.destination);
        osc.start(now + start);
        osc.stop(now + start + dur + 0.02);
      }
    } catch {
      /* best-effort */
    }
  }, []);
  const playRing = useCallback(() => tone([[523.25, 0, 0.4], [659.25, 0.4, 0.5]]), [tone]);
  const playEnd = useCallback(() => tone([[440, 0, 0.18], [294, 0.16, 0.34]]), [tone]);

  const stopRingTone = useCallback(() => {
    if (ringToneRef.current) {
      clearInterval(ringToneRef.current);
      ringToneRef.current = null;
    }
  }, []);

  // --- teardown ------------------------------------------------------------
  const teardown = useCallback(
    (opts?: { silent?: boolean }) => {
      seqRef.current += 1; // invalidate every in-flight continuation
      const wasConnected = wasConnectedRef.current;
      wasConnectedRef.current = false;
      stopRingTone();
      for (const ref of [ringTimeoutRef, dialTimeoutRef, reconnectTimerRef, endedTimerRef]) {
        if (ref.current) {
          clearTimeout(ref.current);
          ref.current = null;
        }
      }
      for (const ref of [timerRef, audioWaitRef]) {
        if (ref.current) {
          clearInterval(ref.current);
          ref.current = null;
        }
      }
      try {
        pcRef.current?.getSenders().forEach((s) => s.track?.stop());
        pcRef.current?.close();
      } catch {
        /* ignore */
      }
      pcRef.current = null;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
      activeIdRef.current = null;
      remoteAppliedRef.current = false;
      answeredRef.current = false;
      outboundRef.current = false;
      setMuted(false);
      if (wasConnected && !opts?.silent) {
        playEnd();
        setPhase("ended");
        phaseRef.current = "ended";
        endedTimerRef.current = setTimeout(() => {
          endedTimerRef.current = null;
          setCall(null);
          setPhase(null);
          setSeconds(0);
          setShowReqPerm(false);
        }, 1600);
      } else {
        setCall(null);
        setPhase(null);
        setSeconds(0);
        setShowReqPerm(false);
      }
    },
    [playEnd, stopRingTone],
  );

  // --- connection monitoring ----------------------------------------------
  const startTimer = useCallback(() => {
    wasConnectedRef.current = true;
    answeredRef.current = true;
    setPhase("in-call");
    if (!timerRef.current) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  }, []);

  const monitorConnection = useCallback(
    (pc: RTCPeerConnection, seq: number) => {
      pc.onconnectionstatechange = () => {
        if (seqRef.current !== seq || pcRef.current !== pc) return; // stale peer
        const st = pc.connectionState;
        if (st === "connected") {
          if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
          }
          if (timerRef.current) {
            // Recovered from a transient drop — timer keeps running.
            setPhase("in-call");
            return;
          }
          if (outboundRef.current && !answeredRef.current) {
            // OUTBOUND: media can be "connected" while the customer's phone is
            // still ringing (Meta warms the path during ringback). Don't start
            // the timer until their audio actually flows.
            setPhase("connecting");
            if (!audioWaitRef.current) {
              audioWaitRef.current = setInterval(() => {
                if (seqRef.current !== seq || pcRef.current !== pc) {
                  if (audioWaitRef.current) {
                    clearInterval(audioWaitRef.current);
                    audioWaitRef.current = null;
                  }
                  return;
                }
                void pc
                  .getStats()
                  .then((stats) => {
                    if (seqRef.current !== seq || !audioWaitRef.current) return;
                    let bytes = 0;
                    stats.forEach((r) => {
                      if (
                        r.type === "inbound-rtp" &&
                        (r as { kind?: string }).kind === "audio" &&
                        typeof (r as { bytesReceived?: number }).bytesReceived === "number"
                      ) {
                        bytes = (r as { bytesReceived: number }).bytesReceived;
                      }
                    });
                    if (bytes > 3000) {
                      clearInterval(audioWaitRef.current!);
                      audioWaitRef.current = null;
                      if (dialTimeoutRef.current) {
                        clearTimeout(dialTimeoutRef.current);
                        dialTimeoutRef.current = null;
                      }
                      startTimer();
                    }
                  })
                  .catch(() => undefined);
              }, 500);
            }
          } else {
            // Inbound (agent already accepted) — audio flows on connect.
            startTimer();
          }
        } else if (st === "disconnected") {
          setPhase("reconnecting");
          if (!reconnectTimerRef.current) {
            reconnectTimerRef.current = setTimeout(() => {
              reconnectTimerRef.current = null;
              if (seqRef.current === seq && pc.connectionState !== "connected") {
                const id = activeIdRef.current;
                if (id) void api(`/${id}/hangup`, { method: "POST" }).catch(() => undefined);
                teardown();
              }
            }, RECONNECT_GRACE_MS);
          }
        } else if (st === "failed" || st === "closed") {
          // Tell the server either way: a connected call ends with talk time,
          // a pre-connect failure cancels the ring (so an outbound customer's
          // phone stops ringing instead of ringing into a dead dock).
          const id = activeIdRef.current;
          if (id) void api(`/${id}/hangup`, { method: "POST" }).catch(() => undefined);
          teardown();
        }
      };
    },
    [startTimer, teardown],
  );

  const buildPeer = useCallback(
    async (seq: number): Promise<RTCPeerConnection | null> => {
      const { data } = await api<{ iceServers: RTCIceServer[] }>("/ice");
      if (seqRef.current !== seq) return null;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (seqRef.current !== seq) {
        stream.getTracks().forEach((t) => t.stop());
        return null;
      }
      localStreamRef.current = stream;
      const pc = new RTCPeerConnection({ iceServers: data.iceServers ?? [] });
      pcRef.current = pc;
      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      pc.ontrack = (e) => {
        if (remoteAudioRef.current) remoteAudioRef.current.srcObject = e.streams[0] ?? null;
      };
      monitorConnection(pc, seq);
      return pc;
    },
    [monitorConnection],
  );

  // --- inbound: ring + accept ---------------------------------------------
  const startRinging = useCallback(
    (view: ActiveCallView) => {
      seqRef.current += 1;
      activeIdRef.current = view.id;
      outboundRef.current = false;
      answeredRef.current = false;
      remoteAppliedRef.current = false;
      if (endedTimerRef.current) {
        clearTimeout(endedTimerRef.current);
        endedTimerRef.current = null;
      }
      setError(null);
      setShowReqPerm(false);
      setSeconds(0); // a new call never inherits the previous one's clock
      setCall({ callId: view.id, contactId: view.contactId, name: view.name, phone: view.phone });
      setPhase("ringing");
      phaseRef.current = "ringing";
      playRing();
      stopRingTone();
      ringToneRef.current = setInterval(playRing, 3000);
      if (ringTimeoutRef.current) clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = setTimeout(() => {
        if (activeIdRef.current === view.id && phaseRef.current === "ringing") {
          dismissedIdRef.current = view.id; // don't re-ring while the server sweeps it
          teardown({ silent: true });
        }
      }, RING_TIMEOUT_MS);
    },
    [playRing, stopRingTone, teardown],
  );

  const accept = useCallback(async () => {
    const id = activeIdRef.current;
    if (!id || phaseRef.current !== "ringing") return;
    const seq = seqRef.current;
    stopRingTone();
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }
    setPhase("connecting");
    phaseRef.current = "connecting";
    setError(null);
    try {
      const detail = await api<{ call?: { sdpOffer: string | null } }>(`/${id}`);
      if (seqRef.current !== seq) return;
      const offer = detail.data.call?.sdpOffer;
      if (!offer) throw new Error("No SDP offer for this call");

      const pc = await buildPeer(seq);
      if (!pc) return; // torn down mid-build; buildPeer cleaned up
      await pc.setRemoteDescription({ type: "offer", sdp: offer });
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await waitForIce(pc);
      if (seqRef.current !== seq) return;

      const res = await api<{ error?: string }>(`/${id}/answer`, {
        method: "POST",
        body: JSON.stringify({ sdpAnswer: pc.localDescription?.sdp ?? "" }),
      });
      if (seqRef.current !== seq) return;
      if (!res.ok) {
        // Answer refused (already answered elsewhere / caller gone). Tear down
        // LOCALLY only — never POST /hangup for a call we failed to answer.
        teardown({ silent: true });
        setError(res.data.error ?? "Could not accept the call");
        return;
      }
      // connectionstatechange flips to in-call once media connects.
    } catch (e) {
      if (seqRef.current !== seq) return;
      teardown({ silent: true });
      setError(e instanceof Error ? e.message : "Could not connect the call");
    }
  }, [buildPeer, stopRingTone, teardown]);

  const decline = useCallback(async () => {
    const id = activeIdRef.current;
    dismissedIdRef.current = id;
    teardown({ silent: true });
    if (id) await api(`/${id}/reject`, { method: "POST" }).catch(() => undefined);
  }, [teardown]);

  const hangup = useCallback(async () => {
    const id = activeIdRef.current;
    teardown();
    if (id) await api(`/${id}/hangup`, { method: "POST" }).catch(() => undefined);
  }, [teardown]);

  // --- outbound ------------------------------------------------------------
  const startOutbound = useCallback(
    async (detail: { contactId: string; name?: string | null; phone?: string | null }) => {
      if (!detail?.contactId) return;
      if (activeIdRef.current || phaseRef.current) return; // busy
      seqRef.current += 1;
      const seq = seqRef.current;
      outboundRef.current = true;
      answeredRef.current = false;
      remoteAppliedRef.current = false;
      setError(null);
      setShowReqPerm(false);
      setSeconds(0);
      setCall({
        callId: null,
        contactId: detail.contactId,
        name: detail.name?.trim() || detail.phone || "Contact",
        phone: detail.phone ?? null,
      });
      setPhase("dialing");
      phaseRef.current = "dialing";
      try {
        const pc = await buildPeer(seq);
        if (!pc) return;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await waitForIce(pc);
        if (seqRef.current !== seq) return; // cancelled mid-build (teardown freed media)

        const res = await api<{ callId?: string; error?: string }>("/outbound", {
          method: "POST",
          body: JSON.stringify({
            contactId: detail.contactId,
            sdpOffer: pc.localDescription?.sdp ?? "",
          }),
        });
        if (seqRef.current !== seq) {
          // Cancelled while the POST was in flight: the customer's phone may
          // now be ringing for a dead dock — kill the real call immediately.
          if (res.ok && res.data.callId) {
            void api(`/${res.data.callId}/hangup`, { method: "POST" }).catch(() => undefined);
          }
          return;
        }
        if (!res.ok || !res.data.callId) {
          const msg = res.data.error ?? "Could not place the call";
          // Free the media but keep the card so the error stays actionable.
          try {
            pcRef.current?.getSenders().forEach((s) => s.track?.stop());
            pcRef.current?.close();
          } catch {
            /* ignore */
          }
          pcRef.current = null;
          localStreamRef.current?.getTracks().forEach((t) => t.stop());
          localStreamRef.current = null;
          setError(msg);
          setShowReqPerm(/permission|allow/i.test(msg));
          setPhase("error");
          phaseRef.current = "error";
          return;
        }
        activeIdRef.current = res.data.callId;
        setCall((c) => (c ? { ...c, callId: res.data.callId! } : c));
        // Give up if the customer doesn't pick up.
        if (dialTimeoutRef.current) clearTimeout(dialTimeoutRef.current);
        dialTimeoutRef.current = setTimeout(() => {
          dialTimeoutRef.current = null;
          if (seqRef.current === seq && !answeredRef.current) {
            const id = activeIdRef.current;
            if (id) void api(`/${id}/hangup`, { method: "POST" }).catch(() => undefined);
            teardown({ silent: true });
          }
        }, DIAL_TIMEOUT_MS);
      } catch (e) {
        if (seqRef.current !== seq) return;
        teardown({ silent: true });
        setError(e instanceof Error ? e.message : "Could not place the call");
      }
    },
    [buildPeer, teardown],
  );

  // "Call" buttons anywhere dispatch this; the globally-mounted dock owns the
  // WebRTC + UI.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        contactId: string;
        name?: string | null;
        phone?: string | null;
      };
      void startOutbound(detail);
    };
    window.addEventListener("wa:call", handler);
    return () => window.removeEventListener("wa:call", handler);
  }, [startOutbound]);

  const requestPermission = useCallback(async () => {
    const contactId = call?.contactId;
    if (!contactId) return;
    const res = await api<{ error?: string }>("/permission", {
      method: "POST",
      body: JSON.stringify({ contactId }),
    });
    if (res.ok) {
      setShowReqPerm(false);
      setError("Permission request sent — once they tap Allow, call again.");
    } else {
      setError(res.data.error ?? "Could not send the permission request");
    }
  }, [call?.contactId]);

  // --- the poll ------------------------------------------------------------
  useEffect(() => {
    let stopped = false;
    const tick = async () => {
      if (stopped) return;
      try {
        const watch = activeIdRef.current;
        const { ok, data } = await api<{
          watched: ActiveCallView | null;
          ringing: ActiveCallView | null;
        }>(`/active${watch ? `?watch=${watch}` : ""}`);
        if (!ok || stopped) return;

        const w = data.watched;
        if (watch && activeIdRef.current === watch && w) {
          if (["ended", "missed", "failed"].includes(w.status)) {
            // Caller hung up / server closed it — mirror locally.
            const livePhases: (Phase | null)[] = ["in-call", "reconnecting", "connecting"];
            teardown({ silent: !livePhases.includes(phaseRef.current) });
            if (w.status === "failed" && w.endReason === "accept-failed") {
              setError("The call could not be connected.");
            }
          } else if (
            w.sdpAnswer &&
            outboundRef.current &&
            !remoteAppliedRef.current &&
            pcRef.current
          ) {
            // Outbound: the customer accepted — apply their SDP answer once.
            remoteAppliedRef.current = true;
            setPhase("connecting");
            phaseRef.current = "connecting";
            pcRef.current
              .setRemoteDescription({ type: "answer", sdp: w.sdpAnswer })
              .catch(() => teardown());
          }
        }

        // A fresh inbound ring, and the dock is idle → ring it.
        if (
          !activeIdRef.current &&
          !phaseRef.current &&
          data.ringing &&
          data.ringing.id !== dismissedIdRef.current
        ) {
          startRinging(data.ringing);
        }
      } catch {
        /* poll errors are silent; next tick retries */
      }
    };
    void tick();
    const i = setInterval(tick, POLL_MS);
    return () => {
      stopped = true;
      clearInterval(i);
    };
  }, [startRinging, teardown]);

  // --- heartbeat while connected -------------------------------------------
  useEffect(() => {
    if (phase !== "in-call" && phase !== "reconnecting") return;
    const i = setInterval(() => {
      const id = activeIdRef.current;
      if (id) void api(`/${id}/heartbeat`, { method: "POST" }).catch(() => undefined);
    }, HEARTBEAT_MS);
    const id = activeIdRef.current;
    if (id) void api(`/${id}/heartbeat`, { method: "POST" }).catch(() => undefined);
    return () => clearInterval(i);
  }, [phase]);

  useEffect(() => () => teardown({ silent: true }), [teardown]);

  const toggleMute = useCallback(() => {
    const track = localStreamRef.current?.getAudioTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMuted(!track.enabled);
  }, []);

  const openChat = useCallback(() => {
    if (!call?.contactId) return;
    router.push(`/admin/inbox?c=${call.contactId}`);
  }, [call?.contactId, router]);

  if (!call && !error) {
    return <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />;
  }

  const statusLine = (() => {
    switch (phase) {
      case "ringing":
        return "Incoming WhatsApp call…";
      case "dialing":
        return "Calling…";
      case "connecting":
        // Outbound sits here while the customer's phone still rings.
        return outboundRef.current ? "Ringing…" : "Connecting…";
      case "in-call":
        return `In call · ${fmt(seconds)}`;
      case "reconnecting":
        return `Reconnecting… · ${fmt(seconds)}`;
      case "ended":
        return `Call ended · ${fmt(seconds)}`;
      case "error":
        return "Call failed";
      default:
        return "";
    }
  })();

  return (
    <>
      <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />
      <div
        role="dialog"
        aria-label="WhatsApp call"
        className="fixed right-4 bottom-4 z-[200] w-[300px] rounded-2xl border border-white/10 bg-[#111527]/95 p-4 shadow-2xl shadow-black/50 backdrop-blur"
        style={{ borderLeft: "3px solid #34d399" }}
      >
        <div className="mb-2.5 flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-500/15 text-lg">
            📞
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{call?.name ?? "Call"}</p>
            <p className="truncate text-[12px] text-slate-400">{statusLine}</p>
          </div>
        </div>
        {call?.phone && phase === "ringing" ? (
          <p className="mb-2 text-[12px] text-slate-400">{call.phone}</p>
        ) : null}
        {error ? <p className="mb-2 text-[12px] text-rose-300">{error}</p> : null}

        {call?.contactId &&
        (phase === "ringing" ||
          phase === "dialing" ||
          phase === "connecting" ||
          phase === "in-call" ||
          phase === "reconnecting") ? (
          <button
            className="mb-2 w-full rounded-lg bg-white/5 py-1.5 text-xs text-slate-300 transition hover:bg-white/10"
            onClick={openChat}
            type="button"
          >
            💬 Open chat
          </button>
        ) : null}

        <div className="flex gap-2">
          {phase === "ringing" ? (
            <>
              <button
                className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                onClick={() => void accept()}
                type="button"
              >
                Accept
              </button>
              <button
                className="flex-1 rounded-lg bg-rose-500/90 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                onClick={() => void decline()}
                type="button"
              >
                Decline
              </button>
            </>
          ) : phase === "error" || (!phase && error) ? (
            <>
              {showReqPerm ? (
                <button
                  className="flex-1 rounded-lg bg-emerald-500 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                  onClick={() => void requestPermission()}
                  type="button"
                >
                  Request permission
                </button>
              ) : null}
              <button
                className="flex-1 rounded-lg bg-white/5 py-2 text-sm text-slate-300 transition hover:bg-white/10"
                onClick={() => {
                  setError(null);
                  teardown({ silent: true });
                }}
                type="button"
              >
                Close
              </button>
            </>
          ) : phase === "ended" ? null : (
            <>
              <button
                className="flex-1 rounded-lg bg-white/5 py-2 text-sm text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
                disabled={phase !== "in-call" && phase !== "reconnecting"}
                onClick={toggleMute}
                type="button"
              >
                {muted ? "Unmute" : "Mute"}
              </button>
              <button
                className="flex-1 rounded-lg bg-rose-500/90 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
                onClick={() => void hangup()}
                type="button"
              >
                Hang up
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
