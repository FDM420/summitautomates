"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Moon, Sun, Sunset, UserCheck } from "lucide-react";
import { hexWithAlpha } from "@/lib/services-config";
import { HoloPedestal } from "../HoloPedestal";
import { SceneRoot } from "../../scene/SceneRoot";
import { WorkforceScene3D } from "../WorkforceScene3D";

const GREEN = "#34d8a4";
const BLUE = "#60a5fa";
const CYAN = "#4fd1ff";
const VIOLET = "#a78bfa";
const SKY = "#3b82f6";

const EASE = [0.22, 1, 0.36, 1] as const;

export function WorkforceCardIllustration() {
  return (
    <div className="relative h-full min-h-[520px] w-full overflow-hidden">
      {/* Holographic pedestal at the floor */}
      <HoloPedestal accent={SKY} accent2={CYAN} topPercent={64} widthPercent={82} />

      {/* Three.js scene with tilted map + 3D pin */}
      <div className="pointer-events-none absolute inset-0">
        <SceneRoot
          bloomIntensity={1.4}
          cameraPosition={[0, 0.4, 4.4]}
          dpr={[1, 1.6]}
          fov={45}
        >
          <WorkforceScene3D />
        </SceneRoot>
      </div>

      {/* Attendance Dashboard panel — top-left, slight tilt */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute left-5 top-6 w-[12.5rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: -16, y: 8 }}
        style={{
          borderColor: hexWithAlpha(GREEN, 0.5),
          boxShadow: `0 26px 50px rgba(0,0,0,0.55), 0 0 32px ${hexWithAlpha(GREEN, 0.3)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(2deg) rotateY(4deg)",
          transformOrigin: "center",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.18 }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
          Attendance Dashboard
        </p>
        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="relative">
            <span
              className="grid h-12 w-12 place-items-center rounded-full"
              style={{
                background: `linear-gradient(160deg, ${GREEN}, #06b48a)`,
                boxShadow: `0 0 30px ${hexWithAlpha(GREEN, 0.55)}, inset 0 -4px 10px rgba(0,0,0,0.25), inset 0 2px 6px rgba(255,255,255,0.3)`,
              }}
            >
              <CheckCircle2 className="h-6 w-6 text-white" strokeWidth={2.6} />
            </span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-bold" style={{ color: GREEN }}>
              Verified
            </span>
            <span className="text-[0.55rem] text-white/55">All records verified</span>
          </div>
        </div>
      </motion.div>

      {/* Shift Management panel — center-left, deeper tilt */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute left-3 top-[40%] w-[13.5rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: -16, y: 10 }}
        style={{
          borderColor: hexWithAlpha(BLUE, 0.5),
          boxShadow: `0 28px 60px rgba(0,0,0,0.6), 0 0 32px ${hexWithAlpha(BLUE, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(3deg) rotateY(6deg)",
          transformOrigin: "center",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.28 }}
      >
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
          Shift Management
        </p>
        <div className="mt-2.5 flex flex-col gap-2">
          {[
            { label: "Morning Shift", count: 128, time: "06:00 AM - 02:00 PM", Icon: Sun, color: "#f5c46b" },
            { label: "Evening Shift", count: 96, time: "02:00 PM - 10:00 PM", Icon: Sunset, color: VIOLET },
            { label: "Night Shift", count: 72, time: "10:00 PM - 06:00 AM", Icon: Moon, color: BLUE },
          ].map((row) => (
            <div className="flex items-center gap-2" key={row.label}>
              <span
                className="grid h-7 w-7 place-items-center rounded-lg"
                style={{
                  background: `linear-gradient(140deg, ${hexWithAlpha(row.color, 0.85)}, ${hexWithAlpha(row.color, 0.4)})`,
                  boxShadow: `0 0 14px ${hexWithAlpha(row.color, 0.35)}, inset 0 1px 0 rgba(255,255,255,0.2)`,
                }}
              >
                <row.Icon className="h-3.5 w-3.5 text-white" strokeWidth={2.2} />
              </span>
              <div className="flex flex-1 flex-col leading-tight">
                <span className="text-[0.7rem] font-semibold text-white">{row.label}</span>
                <span className="text-[0.5rem] text-white/50">{row.time}</span>
              </div>
              <span
                className="flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.6rem] font-bold"
                style={{
                  backgroundColor: hexWithAlpha(row.color, 0.12),
                  borderColor: hexWithAlpha(row.color, 0.3),
                  color: "white",
                }}
              >
                <UserCheck className="h-2.5 w-2.5 opacity-70" />
                {row.count}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Report panel — bottom-right */}
      <motion.div
        animate={{ opacity: 1, x: 0, y: 0 }}
        className="absolute bottom-[10%] right-3 w-[13rem] rounded-2xl border bg-[rgba(8,14,32,0.92)] p-3.5 backdrop-blur-xl"
        initial={{ opacity: 0, x: 18, y: 10 }}
        style={{
          borderColor: hexWithAlpha(VIOLET, 0.5),
          boxShadow: `0 28px 60px rgba(0,0,0,0.6), 0 0 32px ${hexWithAlpha(VIOLET, 0.28)}, inset 0 1px 0 rgba(255,255,255,0.06)`,
          transform: "perspective(900px) rotateX(3deg) rotateY(-6deg)",
          transformOrigin: "center",
        }}
        transition={{ duration: 0.75, ease: EASE, delay: 0.4 }}
      >
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.22em] text-white/65">
            Daily Report
          </p>
          <span className="flex items-baseline gap-0.5 text-[0.65rem] font-bold" style={{ color: GREEN }}>
            +12.5%
          </span>
        </div>
        <p className="text-[0.5rem] text-white/45">vs yesterday</p>
        <div className="mt-2 flex h-16 items-end gap-1.5">
          {[
            { h: 22, label: "M" },
            { h: 30, label: "T" },
            { h: 18, label: "W" },
            { h: 38, label: "T" },
            { h: 28, label: "F" },
            { h: 36, label: "S" },
            { h: 46, label: "S" },
          ].map((bar, i) => (
            <div className="flex flex-1 flex-col items-center gap-1" key={i}>
              <div
                className="w-full rounded-t-sm"
                style={{
                  background: `linear-gradient(180deg, ${VIOLET}, ${BLUE})`,
                  height: `${bar.h * 1.2}px`,
                  boxShadow: `0 0 10px ${hexWithAlpha(VIOLET, 0.45)}`,
                }}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
