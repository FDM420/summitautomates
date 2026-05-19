"use client";

import { motion } from "framer-motion";
import { Bell, Megaphone, TrendingUp } from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "crm-ai-marketing-automation";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

const KANBAN = [
  { stage: "New", count: 32, cards: ["Apex Solutions", "BrightCore", "Velocity Tech"] },
  { stage: "Qualified", count: 18, cards: ["Northwind Labs", "Summit Design", "DataBridge"] },
  { stage: "Proposal", count: 9, cards: ["Innova Systems", "CloudScale", "Peak Ventures"] },
  { stage: "Won", count: 5, cards: ["Blue Horizon", "Elevate Co.", "NextGen AI"] },
];

export function CrmMarketingHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Center: Funnel */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
      >
        <svg height="160" viewBox="0 0 160 160" width="160">
          <defs>
            <linearGradient id="funnel-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={accent} stopOpacity="0.6" />
              <stop offset="100%" stopColor={accent2} stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <path
            d="M 20 20 L 140 20 L 110 70 L 50 70 Z"
            fill="url(#funnel-grad)"
            opacity="0.55"
            stroke={accent}
            strokeWidth="1.5"
          />
          <path
            d="M 50 70 L 110 70 L 95 110 L 65 110 Z"
            fill="url(#funnel-grad)"
            opacity="0.75"
            stroke={accent}
            strokeWidth="1.5"
          />
          <path
            d="M 65 110 L 95 110 L 88 140 L 72 140 Z"
            fill="url(#funnel-grad)"
            opacity="0.95"
            stroke={accent2}
            strokeWidth="1.5"
          />
          <rect fill={accent2} height="14" rx="2" width="14" x="73" y="142" />
        </svg>
        <p className="mt-2 text-center font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/65">
          Lead Capture
        </p>
      </motion.div>

      {/* Top-left: New Leads list */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[2%] flex w-[14rem] flex-col gap-2 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.2 }}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            New Leads
          </span>
          <span className="text-base font-semibold text-white">128</span>
        </div>
        {["Ryan Mitchell", "Jessica Lee", "David Chen", "Amanda Clark"].map((name, i) => (
          <div className="flex items-center gap-2" key={name}>
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-[0.55rem] font-semibold text-white"
              style={{ backgroundColor: hexWithAlpha(accent, 0.55 + i * 0.05) }}
            >
              {name.split(" ").map((s) => s[0]).join("")}
            </span>
            <span className="flex-1 text-[0.7rem] text-white/85">{name}</span>
            <span className="text-[0.55rem] font-medium" style={{ color: accent2 }}>
              Open
            </span>
          </div>
        ))}
      </motion.div>

      {/* Top-right: Sales Pipeline (kanban) */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[2%] flex w-[19rem] flex-col gap-2 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.28 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          Sales Pipeline
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {KANBAN.map((col) => (
            <div className="flex flex-col gap-1" key={col.stage}>
              <div className="flex flex-col leading-tight">
                <span className="text-[0.6rem] font-semibold text-white">{col.stage}</span>
                <span className="text-[0.55rem] text-white/55">{col.count} leads</span>
              </div>
              {col.cards.slice(0, 2).map((card) => (
                <div
                  className="rounded border px-1.5 py-1 text-[0.55rem] text-white/85"
                  key={card}
                  style={{
                    backgroundColor: "rgba(8,12,28,0.6)",
                    borderColor: hexWithAlpha(accent, 0.25),
                  }}
                >
                  {card}
                </div>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom-left: Campaigns */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[1%] flex w-[15rem] flex-col gap-1.5 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.38 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <Megaphone className="h-3 w-3" /> Campaigns
          </span>
          <span
            className="rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
            style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent }}
          >
            Active
          </span>
        </div>
        {["Product Launch", "Webinar Series", "Lead Nurture Flow"].map((campaign) => (
          <div className="flex items-center justify-between" key={campaign}>
            <span className="text-[0.65rem] text-white/85">{campaign}</span>
            <span className="text-[0.5rem]" style={{ color: accent2 }}>
              Live
            </span>
          </div>
        ))}
      </motion.div>

      {/* Bottom-right: Follow-up reminders */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[2%] right-[2%] flex w-[16rem] flex-col gap-1.5 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.44 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <Bell className="h-3 w-3" /> Follow-up Reminders
          </span>
          <span className="text-[0.5rem] text-white/55">Today</span>
        </div>
        {[
          { time: "10:00 AM", task: "Follow up with Ryan M." },
          { time: "11:30 AM", task: "Proposal reminder" },
          { time: "1:00 PM", task: "Left VM — Jessica" },
          { time: "3:30 PM", task: "Contract follow up" },
        ].map((row) => (
          <div className="flex items-center gap-2" key={row.task}>
            <span
              className="rounded-md border px-1.5 py-0.5 text-[0.5rem]"
              style={{
                backgroundColor: hexWithAlpha(accent, 0.1),
                borderColor: hexWithAlpha(accent, 0.3),
                color: accent2,
              }}
            >
              {row.time}
            </span>
            <span className="flex-1 text-[0.65rem] text-white/85">{row.task}</span>
          </div>
        ))}
      </motion.div>

      {/* Mini analytics indicator */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="absolute hidden lg:flex left-[12%] top-[44%] flex items-center gap-1.5 rounded-full border px-3 py-1.5"
        initial={{ opacity: 0, scale: 0.9 }}
        style={{
          backgroundColor: "rgba(6,10,24,0.7)",
          borderColor: hexWithAlpha(accent, 0.35),
        }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.5 }}
      >
        <TrendingUp className="h-3 w-3" style={{ color: accent }} />
        <span className="text-[0.6rem] text-white/85">Conversion</span>
        <span className="text-[0.7rem] font-semibold" style={{ color: accent2 }}>
          24.8%
        </span>
      </motion.div>
    </div>
  );
}
