"use client";

import { motion } from "framer-motion";
import { Bell, Megaphone, TrendingUp } from "lucide-react";
import { hexWithAlpha } from "@/lib/services-config";
import { CrmScene3D } from "../CrmScene3D";
import { HoloPedestal } from "../HoloPedestal";
import { SceneRoot } from "../../scene/SceneRoot";

const BLUE = "#3b82f6";
const CYAN = "#4fd1ff";
const TEAL = "#34d8a4";
const VIOLET = "#7c82ff";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CrmMarketingCardIllustration() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden">
      <HoloPedestal accent={BLUE} accent2={CYAN} topPercent={66} widthPercent={82} />

      <div className="pointer-events-none absolute inset-0">
        <SceneRoot
          bloomIntensity={1.3}
          cameraPosition={[0, 0.3, 4.6]}
          envPreset="city"
          fov={44}
        >
          <CrmScene3D />
        </SceneRoot>
      </div>

      {/* New Leads panel — top-left */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute left-3 top-6 w-[12rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: -16, y: 8 }}
        style={{
          borderColor: hexWithAlpha(TEAL, 0.5),
          boxShadow: `0 28px 60px rgba(0,0,0,0.6), 0 0 30px ${hexWithAlpha(TEAL, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(2deg) rotateY(5deg)",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.2 }}
      >
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
            New Leads
          </span>
          <span className="text-base font-bold text-white">128</span>
        </div>
        <div className="mt-2 flex flex-col gap-1.5">
          {[
            { name: "Alex J.", role: "Marketing" },
            { name: "Sarah C.", role: "Growth" },
            { name: "Jose M.", role: "Sales" },
          ].map((row, i) => (
            <div className="flex items-center gap-2" key={row.name}>
              <span
                className="grid h-6 w-6 place-items-center rounded-full text-[0.55rem] font-bold text-white"
                style={{
                  background: `linear-gradient(160deg, ${hexWithAlpha(BLUE, 0.9)}, ${hexWithAlpha(BLUE, 0.4)})`,
                  boxShadow: `0 0 12px ${hexWithAlpha(BLUE, 0.4)}`,
                }}
              >
                {row.name.charAt(0)}
              </span>
              <div className="flex flex-1 flex-col leading-none">
                <span className="text-[0.6rem] font-medium text-white">{row.name}</span>
                <span className="text-[0.5rem] text-white/55">{row.role}</span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TEAL }} />
              {i === 0 ? null : null}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pipeline Overview — bottom-right */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute bottom-[10%] right-3 w-[13rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: 16, y: 10 }}
        style={{
          borderColor: hexWithAlpha(BLUE, 0.5),
          boxShadow: `0 28px 60px rgba(0,0,0,0.6), 0 0 30px ${hexWithAlpha(BLUE, 0.3)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(2deg) rotateY(-6deg)",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.32 }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
          Pipeline Overview
        </p>
        <svg className="mt-1.5 w-full" height="50" viewBox="0 0 120 50">
          <defs>
            <linearGradient id="crm-area-card" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={BLUE} stopOpacity="0.5" />
              <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M 0 40 L 18 32 L 36 35 L 56 22 L 76 18 L 96 12 L 120 6 L 120 50 L 0 50 Z"
            fill="url(#crm-area-card)"
          />
          <path
            d="M 0 40 L 18 32 L 36 35 L 56 22 L 76 18 L 96 12 L 120 6"
            fill="none"
            stroke={CYAN}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.6"
          />
        </svg>
        <div className="mt-1 flex items-baseline justify-between">
          <span className="text-lg font-bold text-white">$2.48M</span>
          <span className="flex items-center gap-0.5 text-[0.55rem] font-semibold" style={{ color: TEAL }}>
            <TrendingUp className="h-2.5 w-2.5" /> 28%
          </span>
        </div>
      </motion.div>

      {/* Follow-up reminders chip — middle */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-3 top-[44%] flex items-center gap-2 rounded-full border bg-[rgba(8,14,32,0.92)] px-3 py-1.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: 14 }}
        style={{
          borderColor: hexWithAlpha(VIOLET, 0.45),
          boxShadow: `0 0 22px ${hexWithAlpha(VIOLET, 0.3)}`,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.42 }}
      >
        <Bell className="h-3 w-3" style={{ color: VIOLET }} />
        <span className="text-[0.6rem] font-semibold text-white">3 reminders today</span>
      </motion.div>

      {/* Campaigns chip — bottom-left */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="absolute bottom-[15%] left-3 flex items-center gap-2 rounded-full border bg-[rgba(8,14,32,0.92)] px-3 py-1.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: -14 }}
        style={{
          borderColor: hexWithAlpha(CYAN, 0.45),
          boxShadow: `0 0 22px ${hexWithAlpha(CYAN, 0.3)}`,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
      >
        <Megaphone className="h-3 w-3" style={{ color: CYAN }} />
        <span className="text-[0.6rem] font-semibold text-white">3 active campaigns</span>
      </motion.div>
    </div>
  );
}
