"use client";

import { motion } from "framer-motion";
import { Clock, Mic } from "lucide-react";
import { hexWithAlpha } from "@/lib/services-config";
import { HoloPedestal } from "../HoloPedestal";

const GREEN = "#25d366";
const GREEN_LIGHT = "#4ce886";
const GREEN_DEEP = "#1ea052";
const CYAN = "#4fd1ff";
const CYAN_DEEP = "#3b82f6";
const VIOLET = "#a78bfa";
const BLUE = "#60a5fa";
const TEAL = "#34d8a4";

const EASE = [0.22, 1, 0.36, 1] as const;

const INBOX_ROWS = [
  { name: "Rohan Mehta", preview: "Hi, interested in…", unread: 2, color: VIOLET },
  { name: "Neha Sharma", preview: "Can I get pricing?", unread: 1, color: BLUE },
  { name: "Amit Verma", preview: "Need help with…", unread: 3, color: GREEN_LIGHT },
  { name: "Priya Nair", preview: "Thanks, that worked!", unread: 0, color: CYAN },
];

const ROUTING = [
  { team: "Sales", note: "Lead 92", tone: GREEN_LIGHT },
  { team: "Support", note: "Ticket", tone: BLUE },
  { team: "Onboarding", note: "New", tone: VIOLET },
];

function WhatsappGlyph({ size = 80, color = "white" }: { size?: number; color?: string }) {
  // Official-style WhatsApp glyph (phone-in-chat-bubble silhouette)
  return (
    <svg fill={color} height={size} viewBox="0 0 32 32" width={size} xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2.5c-7.45 0-13.5 6.05-13.5 13.5 0 2.4.62 4.7 1.83 6.78L2.5 29.5l6.95-1.8A13.46 13.46 0 0 0 16 29.5c7.45 0 13.5-6.05 13.5-13.5S23.45 2.5 16 2.5Zm0 24.6c-2.18 0-4.32-.58-6.2-1.7l-.45-.27-4.13 1.08 1.1-4-.3-.45a11.04 11.04 0 0 1-1.72-5.85C4.3 9.9 9.55 4.65 16 4.65c6.45 0 11.7 5.25 11.7 11.7 0 6.45-5.25 11.75-11.7 11.75Zm6.4-8.78c-.36-.18-2.1-1.04-2.43-1.16-.33-.12-.56-.18-.8.18-.24.36-.92 1.16-1.13 1.4-.2.24-.42.27-.78.09-2.13-1.07-3.53-1.9-4.94-4.32-.37-.64.37-.6 1.06-1.97.12-.24.06-.45-.03-.63-.09-.18-.8-1.94-1.1-2.66-.3-.7-.6-.6-.8-.62-.2-.01-.45-.01-.69-.01a1.3 1.3 0 0 0-.95.45c-.33.36-1.26 1.23-1.26 3 0 1.77 1.29 3.48 1.47 3.72.18.24 2.53 3.87 6.13 5.43.86.37 1.53.59 2.05.76.86.27 1.65.23 2.27.14.69-.1 2.1-.86 2.39-1.69.3-.83.3-1.55.21-1.7-.08-.14-.32-.23-.68-.41Z" />
    </svg>
  );
}

export function WhatsappCardIllustration() {
  return (
    <div className="relative h-full min-h-[560px] w-full overflow-hidden">
      {/* Holographic pedestal at the floor */}
      <HoloPedestal accent={GREEN} accent2={CYAN} topPercent={72} widthPercent={86} />

      {/* ───────── CENTERPIECE: WhatsApp orb + flow line + AI hex (HTML/SVG/CSS) ───────── */}

      {/* The SVG flow line spans across the centerpiece area */}
      <svg
        aria-hidden
        className="pointer-events-none absolute left-0 top-[36%] h-[20%] w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 20"
      >
        <defs>
          <filter height="200%" id="wa-line-glow" width="200%" x="-50%" y="-50%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="wa-line-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor={GREEN_LIGHT} stopOpacity="0.95" />
            <stop offset="50%" stopColor={CYAN} stopOpacity="0.9" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {/* Underglow */}
        <line
          filter="url(#wa-line-glow)"
          stroke={CYAN}
          strokeOpacity="0.35"
          strokeWidth="0.9"
          x1="20"
          x2="98"
          y1="10"
          y2="10"
        />
        {/* Main animated dashed line */}
        <line
          stroke="url(#wa-line-grad)"
          strokeDasharray="1.2 1.6"
          strokeLinecap="round"
          strokeWidth="0.45"
          x1="20"
          x2="98"
          y1="10"
          y2="10"
        >
          <animate attributeName="stroke-dashoffset" dur="1.8s" from="0" repeatCount="indefinite" to="-14" />
        </line>
        {/* Traveling packets (small bright circles moving along the line) */}
        {[0, 0.33, 0.66].map((delay, i) => (
          <circle
            cx="20"
            cy="10"
            fill={i === 0 ? GREEN_LIGHT : CYAN}
            filter="url(#wa-line-glow)"
            key={i}
            r="0.9"
          >
            <animate
              attributeName="cx"
              begin={`${delay * 1.8}s`}
              dur="1.8s"
              from="20"
              repeatCount="indefinite"
              to="98"
            />
            <animate
              attributeName="opacity"
              begin={`${delay * 1.8}s`}
              dur="1.8s"
              repeatCount="indefinite"
              values="0;1;1;0"
            />
          </circle>
        ))}
      </svg>

      {/* WhatsApp orb (CSS gradient sphere with SVG glyph) */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="absolute left-[8%] top-[34%] grid h-[7.5rem] w-[7.5rem] place-items-center rounded-full"
        initial={{ opacity: 0, scale: 0.88 }}
        style={{
          background: `radial-gradient(circle at 30% 25%, ${GREEN_LIGHT} 0%, ${GREEN} 45%, ${GREEN_DEEP} 100%)`,
          boxShadow: `
            0 0 60px ${hexWithAlpha(GREEN, 0.6)},
            0 20px 50px rgba(0,0,0,0.45),
            inset 0 -12px 24px rgba(0,0,0,0.35),
            inset 0 10px 18px rgba(255,255,255,0.22)
          `,
        }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      >
        {/* Specular highlight */}
        <span
          className="absolute left-[22%] top-[18%] h-[20%] w-[22%] rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.85), transparent 70%)",
            filter: "blur(2px)",
          }}
        />
        <WhatsappGlyph color="white" size={68} />
      </motion.div>

      {/* AI hexagonal core (CSS clip-path hex with sharp HTML text) */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="absolute left-1/2 top-[38%] -translate-x-1/2"
        initial={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.25 }}
      >
        {/* Outer aura halo */}
        <div
          className="absolute inset-[-30%] rounded-full"
          style={{
            background: `radial-gradient(circle, ${hexWithAlpha(CYAN, 0.55)} 0%, transparent 65%)`,
            filter: "blur(6px)",
          }}
        />
        {/* Hex tile */}
        <div
          className="relative grid h-[5.5rem] w-[5.5rem] place-items-center"
          style={{
            background: `linear-gradient(140deg, ${CYAN} 0%, ${CYAN_DEEP} 60%, #1e3a8a 100%)`,
            clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
            boxShadow: `0 0 40px ${hexWithAlpha(CYAN, 0.6)}, inset 0 -8px 18px rgba(0,0,0,0.35), inset 0 8px 12px rgba(255,255,255,0.2)`,
          }}
        >
          {/* Inner hex outline (lighter) */}
          <div
            className="absolute inset-[10%]"
            style={{
              clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
              background: `linear-gradient(140deg, ${hexWithAlpha("#ffffff", 0.12)}, transparent)`,
            }}
          />
          <span className="relative font-bold text-white" style={{ fontSize: "1.45rem", letterSpacing: "0.04em" }}>
            AI
          </span>
        </div>
      </motion.div>

      {/* ───────── HTML PROOF PANELS ───────── */}

      {/* TOP-LEFT — Reply Speed chip */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-5 top-5 flex items-center gap-2 rounded-full border bg-[rgba(8,14,32,0.92)] px-3.5 py-2 backdrop-blur-xl"
        initial={{ opacity: 0, y: -8 }}
        style={{
          borderColor: hexWithAlpha(GREEN_LIGHT, 0.55),
          boxShadow: `0 0 24px ${hexWithAlpha(GREEN_LIGHT, 0.32)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
      >
        <span
          className="grid h-6 w-6 place-items-center rounded-full"
          style={{
            background: `linear-gradient(160deg, ${GREEN_LIGHT}, ${GREEN})`,
            boxShadow: `0 0 10px ${hexWithAlpha(GREEN_LIGHT, 0.5)}`,
          }}
        >
          <Clock className="h-3 w-3 text-white" strokeWidth={2.6} />
        </span>
        <div className="flex flex-col leading-none">
          <span className="text-[0.55rem] uppercase tracking-[0.15em] text-white/55">Reply</span>
          <span className="text-[0.75rem] font-bold text-white">24/7 · 1.4s avg</span>
        </div>
      </motion.div>

      {/* TOP-RIGHT — Team Inbox panel */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute right-4 top-5 w-[14rem] rounded-2xl border bg-[rgba(8,14,32,0.93)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: 16, y: 8 }}
        style={{
          borderColor: hexWithAlpha(CYAN, 0.5),
          boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 32px ${hexWithAlpha(CYAN, 0.3)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(2deg) rotateY(-6deg)",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.25 }}
      >
        <div className="flex items-center justify-between border-b border-white/8 pb-2">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
            Team Inbox
          </span>
          <span className="font-mono text-[0.55rem] text-white/45">128 unread</span>
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {INBOX_ROWS.map((row) => {
            const initials = row.name
              .split(" ")
              .map((w) => w[0])
              .join("");
            return (
              <div className="flex items-center gap-2" key={row.name}>
                <span
                  className="grid h-7 w-7 place-items-center rounded-full text-[0.55rem] font-bold text-white"
                  style={{
                    background: `linear-gradient(160deg, ${hexWithAlpha(row.color, 0.95)}, ${hexWithAlpha(row.color, 0.4)})`,
                    boxShadow: `0 0 12px ${hexWithAlpha(row.color, 0.35)}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  }}
                >
                  {initials}
                </span>
                <div className="flex flex-1 flex-col leading-tight">
                  <span className="text-[0.65rem] font-semibold text-white">{row.name}</span>
                  <span className="truncate text-[0.55rem] text-white/55">{row.preview}</span>
                </div>
                {row.unread > 0 ? (
                  <span
                    className="grid h-4 w-4 place-items-center rounded-full text-[0.5rem] font-bold text-slate-950"
                    style={{ backgroundColor: GREEN_LIGHT }}
                  >
                    {row.unread}
                  </span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* MIDDLE-RIGHT — Routing pills */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-4 top-[58%] flex flex-col gap-1.5"
        initial={{ opacity: 0, x: 14 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.42 }}
      >
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/50">
          Lead Routing
        </span>
        {ROUTING.map((r) => (
          <div
            className="flex items-center gap-2 rounded-full border bg-[rgba(8,14,32,0.9)] px-2.5 py-1.5 backdrop-blur-xl"
            key={r.team}
            style={{
              borderColor: hexWithAlpha(r.tone, 0.45),
              boxShadow: `0 0 14px ${hexWithAlpha(r.tone, 0.25)}`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: r.tone, boxShadow: `0 0 6px ${r.tone}` }}
            />
            <span className="text-[0.6rem] font-semibold text-white">{r.team}</span>
            <span className="text-[0.55rem] text-white/55">·</span>
            <span className="text-[0.6rem] font-medium" style={{ color: r.tone }}>
              {r.note}
            </span>
          </div>
        ))}
      </motion.div>

      {/* BOTTOM-LEFT — Voice note transcription */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute bottom-[8%] left-4 w-[13.5rem] rounded-2xl border bg-[rgba(8,14,32,0.93)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: -16, y: 10 }}
        style={{
          borderColor: hexWithAlpha(GREEN_LIGHT, 0.55),
          boxShadow: `0 30px 60px rgba(0,0,0,0.6), 0 0 28px ${hexWithAlpha(GREEN_LIGHT, 0.32)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(3deg) rotateY(6deg)",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.36 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
            <Mic className="h-3 w-3" style={{ color: GREEN_LIGHT }} /> Voice Note
          </span>
          <span className="text-[0.6rem] font-bold" style={{ color: GREEN_LIGHT }}>
            0:18
          </span>
        </div>
        {/* Animated waveform */}
        <div className="mt-2 flex h-9 items-end gap-[2px]">
          {Array.from({ length: 32 }).map((_, i) => {
            const baseH = 18 + Math.sin(i * 0.7) * 11 + (i % 3) * 5;
            const isPlayed = i < 22;
            return (
              <span
                className="block w-[3px] rounded-full"
                key={i}
                style={{
                  height: `${Math.max(4, baseH)}px`,
                  backgroundColor: isPlayed ? GREEN_LIGHT : hexWithAlpha("#ffffff", 0.18),
                  boxShadow: isPlayed ? `0 0 4px ${hexWithAlpha(GREEN_LIGHT, 0.55)}` : "none",
                }}
              />
            );
          })}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-white/8 pt-2">
          <span className="text-[0.6rem] text-white/70">Transcribing…</span>
          <span className="text-[0.75rem] font-bold" style={{ color: TEAL }}>
            98%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
