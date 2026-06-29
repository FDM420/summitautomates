"use client";

import { motion } from "framer-motion";
import {
  ArrowRightLeft,
  CheckCircle2,
  Mic,
  Phone,
  PhoneCall,
  UserPlus,
} from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "ai-voice-agents";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

const LIVE_CALLS = [
  { name: "Aisha Khan", number: "+92 300 124", status: "Talking" },
  { name: "Bilal Ahmed", number: "+92 321 887", status: "Ringing" },
  { name: "Hina Raza", number: "+92 333 410", status: "Qualified" },
];

const TRANSCRIPT = [
  { who: "Caller", line: "Hi, I'd like to know about your plans." },
  { who: "Agent", line: "Happy to help — what's your team size?" },
  { who: "Caller", line: "Around twenty agents." },
  { who: "Agent", line: "Perfect, I'll book a quick demo for you." },
];

const QA_BARS = [
  { label: "Script adherence", value: 98 },
  { label: "Sentiment", value: 94 },
  { label: "Compliance", value: 96 },
];

const ROUTES = [
  { title: "Appointment booked", note: "Calendar synced", priority: "Auto", Icon: CheckCircle2 },
  { title: "Qualified → CRM", note: "Lead score 91", priority: "High", Icon: UserPlus },
  { title: "Transfer to human", note: "Tier 2 desk", priority: "Live", Icon: ArrowRightLeft },
];

export function AiVoiceAgentsHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Central live-call widget */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      >
        <div
          className="relative flex h-[300px] w-[180px] flex-col gap-3 overflow-hidden rounded-[1.75rem] border bg-[#04101c] p-4 sm:h-[340px] sm:w-[200px]"
          style={{
            borderColor: hexWithAlpha(accent, 0.45),
            boxShadow: `0 0 40px ${hexWithAlpha(accent, 0.25)}, inset 0 0 0 1px ${hexWithAlpha(accent, 0.18)}`,
          }}
        >
          {/* Caller header */}
          <div className="flex items-center gap-2 border-b border-white/8 pb-3">
            <span
              className="grid h-8 w-8 place-items-center rounded-full text-slate-950"
              style={{ backgroundColor: accent }}
            >
              <PhoneCall className="h-4 w-4" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-[0.7rem] font-semibold text-white">Aisha Khan</span>
              <span className="text-[0.55rem] text-white/55">Inbound · Sales</span>
            </div>
          </div>

          {/* Voice waveform */}
          <div className="flex flex-1 flex-col items-center justify-center gap-3">
            <div className="flex h-16 items-center gap-[3px]">
              {Array.from({ length: 22 }).map((_, i) => {
                const h = 14 + Math.abs(Math.sin(i * 0.7)) * 34 + (i % 4) * 3;
                return (
                  <span
                    className="block w-[3px] rounded-full"
                    key={i}
                    style={{
                      height: `${Math.max(6, h)}px`,
                      backgroundColor: i % 3 === 0 ? accent2 : hexWithAlpha(accent, 0.9),
                    }}
                  />
                );
              })}
            </div>
            <span
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.55rem] font-medium"
              style={{
                borderColor: hexWithAlpha(accent, 0.4),
                backgroundColor: hexWithAlpha(accent, 0.1),
                color: accent2,
              }}
            >
              <Mic className="h-3 w-3" /> AI agent speaking
            </span>
          </div>

          {/* Call timer + status */}
          <div className="flex items-center justify-between border-t border-white/8 pt-3">
            <span className="flex items-center gap-1.5 text-[0.6rem] text-white/70">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accent }}
              />
              Live call
            </span>
            <span className="font-mono text-[0.75rem] font-semibold" style={{ color: accent }}>
              0:42
            </span>
          </div>
        </div>
      </motion.div>

      {/* Top-left: Live Calls queue */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[6%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <Phone className="h-3 w-3" /> Live Calls
          </span>
          <span className="text-[0.55rem] text-white/45">3 active</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {LIVE_CALLS.map((call) => (
            <div className="flex items-center gap-2" key={call.name}>
              <span
                className="grid h-7 w-7 place-items-center rounded-full text-[0.6rem] font-semibold text-white"
                style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
              >
                {call.name.charAt(0)}
              </span>
              <div className="flex flex-1 flex-col leading-tight">
                <span className="text-[0.7rem] font-medium text-white">{call.name}</span>
                <span className="text-[0.55rem] text-white/55">{call.number}</span>
              </div>
              <span
                className="rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
                style={{
                  borderColor: hexWithAlpha(accent, 0.4),
                  color: call.status === "Qualified" ? accent2 : accent,
                }}
              >
                {call.status}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top-right: Call Transcript */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[4%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.32 }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            Call Transcript
          </span>
          <span className="text-[0.55rem] text-white/45">Live</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {TRANSCRIPT.map((row, i) => {
            const isAgent = row.who === "Agent";
            return (
              <div className={`flex flex-col gap-0.5 ${isAgent ? "items-end" : "items-start"}`} key={i}>
                <span
                  className="font-mono text-[0.5rem] uppercase tracking-[0.16em]"
                  style={{ color: isAgent ? accent : hexWithAlpha(accent, 0.6) }}
                >
                  {row.who}
                </span>
                <span
                  className={`max-w-[88%] rounded-2xl px-2.5 py-1 text-[0.6rem] ${
                    isAgent ? "rounded-br-sm text-slate-950" : "rounded-bl-sm bg-white/8 text-white/85"
                  }`}
                  style={isAgent ? { backgroundColor: accent } : undefined}
                >
                  {row.line}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom-left: QA Score */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[3%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            QA Score
          </span>
          <span className="text-[1.4rem] font-semibold leading-none" style={{ color: accent }}>
            96
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {QA_BARS.map((bar) => (
            <div className="flex flex-col gap-1" key={bar.label}>
              <div className="flex items-center justify-between">
                <span className="text-[0.6rem] text-white/85">{bar.label}</span>
                <span className="text-[0.55rem] font-medium" style={{ color: accent2 }}>
                  {bar.value}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <span
                  className="block h-full rounded-full"
                  style={{ width: `${bar.value}%`, backgroundColor: accent }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom-right: Outcome Routing */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute hidden lg:flex bottom-[2%] right-[2%] w-[16rem] flex-col gap-2"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.48 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          Outcome Routing
        </span>
        {ROUTES.map(({ title, note, priority, Icon }) => (
          <div
            className="glass-card flex items-center gap-3 p-2.5"
            data-accent={m.accent}
            key={title}
            style={{ borderRadius: "0.75rem" }}
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-md border border-white/10"
              style={{ color: accent, backgroundColor: hexWithAlpha(accent, 0.08) }}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="flex flex-1 flex-col leading-tight">
              <span className="text-[0.7rem] font-semibold text-white">{title}</span>
              <span className="text-[0.55rem] text-white/55">{note}</span>
            </div>
            <span
              className="rounded-full border px-2 py-0.5 text-[0.55rem] font-medium"
              style={{
                borderColor: hexWithAlpha(accent, 0.4),
                color: accent2,
              }}
            >
              {priority}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Soft pedestal glow under the widget */}
      <div
        className="pointer-events-none absolute left-1/2 top-[78%] h-2 w-[220px] -translate-x-1/2 rounded-full blur-2xl"
        style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
      />
    </div>
  );
}
