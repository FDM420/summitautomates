"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Route, Users } from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "workforce-operations-tracking";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

const PINS = [
  { x: 22, y: 76 },
  { x: 38, y: 50 },
  { x: 58, y: 60 },
  { x: 76, y: 36 },
];

export function WorkforceHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Center: Map plane */}
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card absolute hidden lg:flex left-1/2 top-[44%] flex w-[20rem] -translate-x-1/2 -translate-y-1/2 flex-col gap-2 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, scale: 0.92 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <MapPin className="h-3 w-3" /> Field Coverage
          </span>
          <span
            className="rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
            style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent2 }}
          >
            Live
          </span>
        </div>
        <div
          className="relative h-32 w-full overflow-hidden rounded-md"
          style={{
            backgroundColor: "#04101c",
            backgroundImage: `linear-gradient(${hexWithAlpha(accent, 0.18)} 1px, transparent 1px), linear-gradient(90deg, ${hexWithAlpha(accent, 0.18)} 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        >
          <svg
            className="absolute inset-0 h-full w-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <path
              d={`M ${PINS.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
              fill="none"
              stroke={accent}
              strokeDasharray="2 3"
              strokeWidth="0.6"
            />
            {PINS.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} fill={accent2} opacity="0.4" r="3.5" />
                <circle cx={p.x} cy={p.y} fill={accent2} r="1.8" />
              </g>
            ))}
          </svg>
        </div>
        <div className="flex items-center justify-between text-[0.6rem]">
          <span className="text-white/65">128 staff active</span>
          <span style={{ color: accent }}>
            4 sites covered
          </span>
        </div>
      </motion.div>

      {/* Top-left: GPS check-in */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[4%] flex w-[14rem] flex-col gap-1 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.24 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          Today&apos;s Attendance
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-white">128</span>
          <span className="text-[0.55rem] text-white/55">/ 150 checked in</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent}, ${accent2})`, width: "85%" }}
          />
        </div>
        <span className="text-[0.55rem] text-white/55">85% on-site verified via GPS</span>
      </motion.div>

      {/* Top-right: Shift Overview */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[4%] flex w-[14rem] flex-col gap-2 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.3 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Clock className="h-3 w-3" /> Shift Overview
        </span>
        {[
          { label: "Day Shift", count: 98 },
          { label: "Evening", count: 42 },
          { label: "Night Shift", count: 30 },
        ].map((row) => (
          <div className="flex items-center justify-between text-[0.65rem]" key={row.label}>
            <span className="text-white/85">{row.label}</span>
            <span className="font-semibold" style={{ color: accent2 }}>
              {row.count}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Bottom-left: Route progress */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[1%] flex w-[15rem] flex-col gap-1.5 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Route className="h-3 w-3" /> Route Progress
        </span>
        {[
          { driver: "Team A · North", pct: 92 },
          { driver: "Team B · West", pct: 78 },
          { driver: "Team C · South", pct: 64 },
        ].map((row) => (
          <div className="flex flex-col gap-0.5" key={row.driver}>
            <div className="flex items-center justify-between text-[0.6rem]">
              <span className="text-white/85">{row.driver}</span>
              <span style={{ color: accent2 }}>{row.pct}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full"
                style={{ backgroundColor: accent, width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Bottom-right: Daily Report */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[2%] right-[2%] flex w-[14rem] flex-col gap-1.5 p-3.5"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.46 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Users className="h-3 w-3" /> Daily Report
        </span>
        <div className="flex h-12 items-end gap-1">
          {[16, 28, 12, 32, 22, 28, 36].map((h, i) => (
            <div
              className="flex-1 rounded-t"
              key={i}
              style={{ background: `linear-gradient(180deg, ${accent}, ${accent2})`, height: `${h * 1.4}px` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[0.55rem]">
          <span className="text-white/55">Mon - Sun</span>
          <span style={{ color: accent }}>+12.5% productivity</span>
        </div>
      </motion.div>
    </div>
  );
}
