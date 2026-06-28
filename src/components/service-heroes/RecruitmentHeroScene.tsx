"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, FileText, ShieldCheck } from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "recruitment-hr-automation";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

const PIPELINE = [
  { label: "Applied", count: 128 },
  { label: "Screening", count: 86 },
  { label: "Interview", count: 24 },
  { label: "Hired", count: 6 },
];

export function RecruitmentHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Center: pipeline strip */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex left-1/2 top-[42%] w-[28rem] -translate-x-1/2 -translate-y-1/2 items-center gap-1 p-3"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 12 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
      >
        {PIPELINE.map((stage, i) => (
          <div className="flex flex-1 items-center gap-1" key={stage.label}>
            <div
              className="flex flex-1 flex-col items-center gap-0.5 rounded-md border p-2"
              style={{
                backgroundColor: i === 3 ? hexWithAlpha(accent, 0.12) : "rgba(8,12,28,0.6)",
                borderColor: hexWithAlpha(accent, i === 3 ? 0.6 : 0.25),
              }}
            >
              <span className="text-[0.55rem] uppercase tracking-wider text-white/65">
                {stage.label}
              </span>
              <span className="text-base font-semibold text-white">{stage.count}</span>
            </div>
            {i < PIPELINE.length - 1 ? (
              <span style={{ color: hexWithAlpha(accent, 0.5) }}>›</span>
            ) : null}
          </div>
        ))}
      </motion.div>

      {/* Top-left: CV intake */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[4%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          CV Intake: Auto
        </span>
        <div className="flex items-center gap-2">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg border"
            style={{
              backgroundColor: hexWithAlpha(accent, 0.08),
              borderColor: hexWithAlpha(accent, 0.3),
              color: accent,
            }}
          >
            <FileText className="h-4 w-4" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-semibold text-white">128</span>
            <span className="text-[0.6rem] text-white/55">New CVs detected</span>
          </div>
        </div>
        <p className="text-[0.65rem] text-white/55">
          Auto-parsing &amp; data extraction in progress…
        </p>
      </motion.div>

      {/* Top-right: Smart Screening */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[4%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.32 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          Smart Screening
        </span>
        {[
          { name: "Best Match", score: 92 },
          { name: "Strong Match", score: 78 },
          { name: "Good Match", score: 64 },
        ].map((row) => (
          <div className="flex items-center gap-2" key={row.name}>
            <span
              className="grid h-6 w-6 place-items-center rounded-full text-[0.55rem] font-semibold text-white"
              style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
            >
              {row.name.charAt(0)}
            </span>
            <span className="flex-1 text-[0.7rem] text-white/85">{row.name}</span>
            <span className="text-[0.7rem] font-semibold" style={{ color: accent2 }}>
              {row.score}%
            </span>
            <CheckCircle2 className="h-3.5 w-3.5" style={{ color: accent }} />
          </div>
        ))}
      </motion.div>

      {/* Bottom-left: Top Candidate */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[3%] left-[2%] w-[14rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          Top Candidate
        </span>
        <div className="flex items-center gap-2">
          <span
            className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: hexWithAlpha(accent, 0.6) }}
          >
            AM
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-[0.75rem] font-semibold text-white">Arjun Mehta</span>
            <span className="text-[0.6rem] text-white/55">Senior DevOps Engineer</span>
            <span className="text-[0.6rem] font-medium" style={{ color: accent }}>
              92% Match
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {["Skills", "Experience", "Culture Fit"].map((tag) => (
            <span
              className="rounded-full border px-2 py-0.5 text-[0.55rem] text-white/70"
              key={tag}
              style={{ borderColor: hexWithAlpha(accent, 0.3) }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Bottom-right: Interview scheduled */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[6%] right-[2%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.46 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Calendar className="h-3 w-3" /> Interview Scheduled
        </span>
        <div className="flex flex-col gap-0.5">
          <span className="text-[0.75rem] font-semibold text-white">Technical Round</span>
          <span className="text-[0.65rem] text-white/65">Tomorrow, 11:00 AM</span>
        </div>
        <div className="mt-1 flex items-center justify-between border-t border-white/8 pt-2">
          <span className="text-[0.6rem] text-white/60">Video link sent</span>
          <ShieldCheck className="h-3.5 w-3.5" style={{ color: accent }} />
        </div>
      </motion.div>

      {/* Right edge: Document Verification */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-[1%] top-[42%] w-[11rem] flex-col gap-1 p-3"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.55 }}
      >
        <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-white/55">
          Doc Verification
        </span>
        <span className="text-[0.6rem] font-medium" style={{ color: accent }}>
          Verified
        </span>
        <span className="text-2xl font-semibold text-white">98%</span>
        <span className="text-[0.55rem] text-white/55">Documents verified</span>
      </motion.div>
    </div>
  );
}
