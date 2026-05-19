"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, FileText } from "lucide-react";
import { hexWithAlpha } from "@/lib/services-config";
import { SceneRoot } from "../../scene/SceneRoot";
import { HoloPedestal } from "../HoloPedestal";
import { RecruitmentScene3D } from "../RecruitmentScene3D";

const VIOLET = "#7c82ff";
const VIOLET_LIGHT = "#a78bfa";
const TEAL = "#34d8a4";
const BLUE = "#60a5fa";

const EASE = [0.22, 1, 0.36, 1] as const;

const STAGES = ["Applied", "Screening", "Interview", "Hired"] as const;

export function RecruitmentCardIllustration() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden">
      <HoloPedestal accent={VIOLET} accent2={BLUE} topPercent={66} widthPercent={82} />

      <div className="pointer-events-none absolute inset-0">
        <SceneRoot
          bloomIntensity={1.25}
          cameraPosition={[0, 0.3, 4.6]}
          envPreset="city"
          fov={44}
        >
          <RecruitmentScene3D />
        </SceneRoot>
      </div>

      {/* Smart Screening panel — top-right */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute right-3 top-6 w-[13rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: 16, y: 8 }}
        style={{
          borderColor: hexWithAlpha(VIOLET, 0.5),
          boxShadow: `0 28px 60px rgba(0,0,0,0.6), 0 0 30px ${hexWithAlpha(VIOLET, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(2deg) rotateY(-5deg)",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.18 }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
          Smart Screening
        </p>
        <p className="mt-1 text-[0.55rem] text-white/55">AI is ranking candidates</p>
        <div className="mt-2 flex flex-col gap-1.5">
          {[
            { name: "Best Match", score: 92 },
            { name: "Strong", score: 78 },
            { name: "Good", score: 64 },
          ].map((row) => (
            <div className="flex items-center gap-2" key={row.name}>
              <span
                className="grid h-6 w-6 place-items-center rounded-full text-[0.55rem] font-semibold text-white"
                style={{ background: `linear-gradient(160deg, ${VIOLET_LIGHT}, ${VIOLET})` }}
              >
                {row.name.charAt(0)}
              </span>
              <span className="flex-1 text-[0.65rem] font-medium text-white/85">{row.name}</span>
              <span className="text-[0.7rem] font-bold" style={{ color: VIOLET_LIGHT }}>
                {row.score}%
              </span>
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: TEAL }} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* CV Intake card — top-left */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute left-3 top-6 w-[11rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: -16, y: 8 }}
        style={{
          borderColor: hexWithAlpha(TEAL, 0.45),
          boxShadow: `0 26px 50px rgba(0,0,0,0.55), 0 0 26px ${hexWithAlpha(TEAL, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(2deg) rotateY(5deg)",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.26 }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
          CV Intake: Auto
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span
            className="grid h-9 w-9 place-items-center rounded-lg"
            style={{
              background: `linear-gradient(160deg, ${TEAL}, #06b48a)`,
              boxShadow: `0 0 20px ${hexWithAlpha(TEAL, 0.45)}`,
            }}
          >
            <FileText className="h-4 w-4 text-white" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-2xl font-bold text-white">128</span>
            <span className="text-[0.55rem] text-white/55">New CVs detected</span>
          </div>
        </div>
      </motion.div>

      {/* 4-stage pipeline strip — bottom */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-[5%] left-1/2 flex -translate-x-1/2 items-center gap-1"
        initial={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
      >
        {STAGES.map((stage, i) => {
          const isLast = i === STAGES.length - 1;
          const color = isLast ? TEAL : VIOLET_LIGHT;
          return (
            <div className="flex items-center gap-1" key={stage}>
              <div
                className="rounded-lg border px-3 py-1.5 text-[0.6rem] font-semibold text-white backdrop-blur"
                style={{
                  background: isLast
                    ? `linear-gradient(140deg, ${hexWithAlpha(TEAL, 0.25)}, ${hexWithAlpha(TEAL, 0.08)})`
                    : "rgba(8,12,28,0.85)",
                  borderColor: hexWithAlpha(color, 0.6),
                  boxShadow: isLast ? `0 0 16px ${hexWithAlpha(TEAL, 0.4)}` : "none",
                }}
              >
                {stage}
              </div>
              {i < STAGES.length - 1 ? (
                <span style={{ color: hexWithAlpha(VIOLET, 0.6) }}>›</span>
              ) : null}
            </div>
          );
        })}
      </motion.div>

      {/* Interview scheduled chip — middle-right */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-4 top-[48%] flex items-center gap-2 rounded-full border bg-[rgba(8,14,32,0.92)] px-3 py-1.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: 14 }}
        style={{
          borderColor: hexWithAlpha(BLUE, 0.45),
          boxShadow: `0 0 22px ${hexWithAlpha(BLUE, 0.3)}`,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
      >
        <Calendar className="h-3 w-3" style={{ color: BLUE }} />
        <span className="text-[0.6rem] font-semibold text-white">Interview · Tomorrow</span>
      </motion.div>
    </div>
  );
}
