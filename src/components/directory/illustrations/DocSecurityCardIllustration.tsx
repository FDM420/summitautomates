"use client";

import { motion } from "framer-motion";
import { Bell, Eye, FileCheck, Lock } from "lucide-react";
import { hexWithAlpha } from "@/lib/services-config";
import { DocSecScene3D } from "../DocSecScene3D";
import { HoloPedestal } from "../HoloPedestal";
import { SceneRoot } from "../../scene/SceneRoot";

const TEAL = "#34d8a4";
const CYAN = "#4fd1ff";
const VIOLET = "#7c82ff";
const GOLD = "#f5c46b";

const EASE = [0.22, 1, 0.36, 1] as const;

export function DocSecurityCardIllustration() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden">
      <HoloPedestal accent={TEAL} accent2={CYAN} topPercent={66} widthPercent={82} />

      <div className="pointer-events-none absolute inset-0">
        <SceneRoot
          bloomIntensity={1.3}
          cameraPosition={[0, 0.3, 4.6]}
          envPreset="city"
          fov={44}
        >
          <DocSecScene3D />
        </SceneRoot>
      </div>

      {/* Access Control panel — top-right */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute right-3 top-6 w-[12.5rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: 16, y: 8 }}
        style={{
          borderColor: hexWithAlpha(VIOLET, 0.5),
          boxShadow: `0 28px 60px rgba(0,0,0,0.6), 0 0 30px ${hexWithAlpha(VIOLET, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(2deg) rotateY(-6deg)",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.2 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
          <Lock className="h-3 w-3" /> Access Control
        </span>
        <div className="mt-2 flex flex-col gap-1.5">
          {[
            { k: "Staff Access", v: "Active" },
            { k: "Role", v: "Ops Lead" },
            { k: "Permissions", v: "4 Granted" },
            { k: "MFA", v: "Enabled" },
          ].map((row) => (
            <div className="flex items-center justify-between text-[0.65rem]" key={row.k}>
              <span className="text-white/65">{row.k}</span>
              <span className="font-semibold" style={{ color: TEAL }}>
                {row.v}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Audit Log panel — bottom-left */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute bottom-[10%] left-3 w-[13rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: -16, y: 10 }}
        style={{
          borderColor: hexWithAlpha(CYAN, 0.5),
          boxShadow: `0 28px 60px rgba(0,0,0,0.6), 0 0 30px ${hexWithAlpha(CYAN, 0.3)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(2deg) rotateY(5deg)",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.3 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
          <Eye className="h-3 w-3" /> Audit Log
        </span>
        <div className="mt-2 flex flex-col gap-1.5">
          {[
            { event: "Document Verified", time: "10:24", Icon: FileCheck },
            { event: "Access Granted", time: "10:25", Icon: Lock },
            { event: "Expiry Alert", time: "10:30", Icon: Bell },
          ].map((row) => (
            <div className="flex items-center gap-2" key={row.event}>
              <row.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: TEAL }} />
              <span className="flex-1 text-[0.6rem] font-medium text-white">{row.event}</span>
              <span className="text-[0.5rem] text-white/50">{row.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* OCR badge — top-left */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="absolute left-4 top-6 flex items-center gap-2 rounded-full border bg-[rgba(8,14,32,0.92)] px-3 py-1.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: -14 }}
        style={{
          borderColor: hexWithAlpha(TEAL, 0.5),
          boxShadow: `0 0 22px ${hexWithAlpha(TEAL, 0.3)}`,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.45 }}
      >
        <span
          className="grid h-5 w-5 place-items-center rounded font-mono text-[0.55rem] font-bold text-slate-950"
          style={{ background: `linear-gradient(140deg, ${TEAL}, #06b48a)` }}
        >
          OCR
        </span>
        <span className="text-[0.65rem] font-semibold text-white">100% Extracted</span>
      </motion.div>

      {/* Expiry chip — middle-right */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="absolute right-4 top-[48%] flex items-center gap-2 rounded-full border bg-[rgba(8,14,32,0.92)] px-3 py-1.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: 14 }}
        style={{
          borderColor: hexWithAlpha(GOLD, 0.45),
          boxShadow: `0 0 22px ${hexWithAlpha(GOLD, 0.3)}`,
        }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.52 }}
      >
        <Bell className="h-3 w-3" style={{ color: GOLD }} />
        <span className="text-[0.6rem] font-semibold text-white">3 expiry alerts</span>
      </motion.div>
    </div>
  );
}
