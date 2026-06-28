"use client";

import { motion } from "framer-motion";
import { Headphones, MessageCircle, Mic, Phone, UserPlus } from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "whatsapp-automation";

const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;

const EASE = [0.22, 1, 0.36, 1] as const;

export function WhatsappHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Central phone with chat */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      >
        <div
          className="relative flex h-[300px] w-[170px] flex-col gap-2 overflow-hidden rounded-[1.75rem] border bg-[#04101c] p-3 sm:h-[340px] sm:w-[195px]"
          style={{
            borderColor: hexWithAlpha(accent, 0.45),
            boxShadow: `0 0 40px ${hexWithAlpha(accent, 0.25)}, inset 0 0 0 1px ${hexWithAlpha(accent, 0.18)}`,
          }}
        >
          {/* Phone header */}
          <div className="flex items-center gap-2 border-b border-white/8 pb-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-full text-white"
              style={{ backgroundColor: hexWithAlpha(accent, 0.85) }}
            >
              <Phone className="h-3.5 w-3.5" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-[0.7rem] font-semibold text-white">Business Account</span>
              <span className="text-[0.55rem] text-white/55">Online</span>
            </div>
          </div>

          {/* Chat bubbles */}
          <div className="flex flex-1 flex-col gap-2 py-2 text-[0.65rem]">
            <div className="self-start rounded-2xl rounded-bl-sm bg-white/8 px-2.5 py-1.5 text-white/85">
              Hi, I&apos;m interested in your services.
            </div>
            <div
              className="self-end rounded-2xl rounded-br-sm px-2.5 py-1.5 text-slate-950"
              style={{ backgroundColor: accent }}
            >
              Thanks! How can we help you today?
            </div>
            <div className="self-start rounded-2xl rounded-bl-sm bg-white/8 px-2.5 py-1.5 text-white/85">
              Pricing for the enterprise plan?
            </div>
          </div>

          {/* Quick reply chips */}
          <div className="flex flex-col gap-1.5">
            <button
              className="rounded-full border px-3 py-1 text-[0.6rem] font-medium text-white/85"
              style={{ borderColor: hexWithAlpha(accent, 0.4) }}
              type="button"
            >
              Book a Demo
            </button>
            <button
              className="rounded-full border px-3 py-1 text-[0.6rem] font-medium text-white/85"
              style={{ borderColor: hexWithAlpha(accent, 0.4) }}
              type="button"
            >
              View Pricing
            </button>
          </div>
        </div>
      </motion.div>

      {/* Top-left: Automation Workflow */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[6%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          Automation Workflow
        </span>
        <div className="flex flex-col gap-1.5">
          {["New message received", "Intent detection", "Auto reply or route"].map((step, i) => (
            <div className="flex items-center gap-2" key={step}>
              <span
                className="grid h-5 w-5 place-items-center rounded-full text-[0.55rem] font-bold text-slate-950"
                style={{ backgroundColor: i === 1 ? accent : hexWithAlpha(accent, 0.4) }}
              >
                {i + 1}
              </span>
              <span className="text-[0.7rem] text-white/85">{step}</span>
            </div>
          ))}
        </div>
        <div className="mt-1 grid grid-cols-3 gap-1 text-center">
          {["Support", "Sales", "General"].map((c) => (
            <span
              className="rounded-md border px-1 py-0.5 text-[0.55rem] text-white/70"
              key={c}
              style={{ borderColor: hexWithAlpha(accent, 0.3) }}
            >
              {c}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Top-right: Team Inbox */}
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
            Team Inbox
          </span>
          <span className="text-[0.55rem] text-white/45">128 unread</span>
        </div>
        <div className="flex flex-col gap-1.5">
          {[
            { name: "Rohan Mehta", msg: "Hi, interested in...", time: "10:30", unread: 2 },
            { name: "Neha Sharma", msg: "Can I get pricing?", time: "10:28", unread: 1 },
            { name: "Amit Verma", msg: "Need help with...", time: "10:25", unread: 3 },
            { name: "Priya Nair", msg: "Thanks, that worked!", time: "10:20", unread: 0 },
          ].map((row) => (
            <div className="flex items-center gap-2" key={row.name}>
              <span
                className="grid h-7 w-7 place-items-center rounded-full text-[0.6rem] font-semibold text-white"
                style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
              >
                {row.name.charAt(0)}
              </span>
              <div className="flex flex-1 flex-col leading-tight">
                <span className="text-[0.7rem] font-medium text-white">{row.name}</span>
                <span className="truncate text-[0.6rem] text-white/55">{row.msg}</span>
              </div>
              <div className="flex flex-col items-end gap-1 leading-tight">
                <span className="text-[0.55rem] text-white/50">{row.time}</span>
                {row.unread > 0 ? (
                  <span
                    className="grid h-3.5 w-3.5 place-items-center rounded-full text-[0.5rem] font-bold text-slate-950"
                    style={{ backgroundColor: accent }}
                  >
                    {row.unread}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom-left: Voice Note + Transcription */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[3%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <Mic className="h-3 w-3" /> Voice Note
          </span>
          <span className="text-[0.6rem] font-semibold" style={{ color: accent }}>
            0:18
          </span>
        </div>
        {/* Mini waveform */}
        <div className="flex h-8 items-end gap-[2px]">
          {Array.from({ length: 28 }).map((_, i) => {
            const h = 18 + Math.sin(i * 0.9) * 12 + (i % 3) * 4;
            return (
              <span
                className="block w-[3px] rounded-full"
                key={i}
                style={{ height: `${Math.max(4, h)}px`, backgroundColor: hexWithAlpha(accent, 0.85) }}
              />
            );
          })}
        </div>
        <div className="flex items-center justify-between border-t border-white/8 pt-2">
          <span className="text-[0.6rem] text-white/70">Transcribing…</span>
          <span className="text-[0.7rem] font-semibold" style={{ color: accent2 }}>
            98%
          </span>
        </div>
      </motion.div>

      {/* Bottom-right: Lead Routing cards */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute hidden lg:flex bottom-[2%] right-[2%] w-[16rem] flex-col gap-2"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.48 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          Lead Routing
        </span>
        {[
          { team: "Sales Team", note: "Lead score 92", priority: "High", Icon: UserPlus },
          { team: "Support Team", note: "Ticket created", priority: "Medium", Icon: Headphones },
          { team: "Onboarding Team", note: "New customer", priority: "Medium", Icon: MessageCircle },
        ].map(({ team, note, priority, Icon }) => (
          <div
            className="glass-card flex items-center gap-3 p-2.5"
            data-accent={m.accent}
            key={team}
            style={{ borderRadius: "0.75rem" }}
          >
            <span
              className="grid h-7 w-7 place-items-center rounded-md border border-white/10"
              style={{ color: accent, backgroundColor: hexWithAlpha(accent, 0.08) }}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="flex flex-1 flex-col leading-tight">
              <span className="text-[0.7rem] font-semibold text-white">{team}</span>
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

      {/* Soft pedestal glow under the phone */}
      <div
        className="pointer-events-none absolute left-1/2 top-[78%] h-2 w-[220px] -translate-x-1/2 rounded-full blur-2xl"
        style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
      />
    </div>
  );
}
