"use client";

import { motion } from "framer-motion";
import {
  Captions,
  Clapperboard,
  Film,
  Play,
  Sparkles,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "ai-video-generation";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

const TRENDS = [
  { topic: "AI tools 2026", views: "4.2M", tag: "TikTok" },
  { topic: "Faceless channel tips", views: "1.8M", tag: "Reels" },
  { topic: "60s explainers", views: "920K", tag: "Shorts" },
];

const PIPELINE = [
  { label: "Script", Icon: Wand2 },
  { label: "Voiceover", Icon: Sparkles },
  { label: "Scenes", Icon: Film },
  { label: "Captions", Icon: Captions },
];

const QUEUE = [
  { name: "launch_teaser.mp4", progress: 86 },
  { name: "product_demo.mp4", progress: 54 },
  { name: "founder_clip.mp4", progress: 21 },
];

export function AiVideoHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Central 9:16 short-video preview frame */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      >
        <div
          className="relative flex h-[320px] w-[180px] flex-col overflow-hidden rounded-[1.6rem] border bg-[#04101c] p-3 sm:h-[340px] sm:w-[192px]"
          style={{
            borderColor: hexWithAlpha(accent, 0.45),
            boxShadow: `0 0 44px ${hexWithAlpha(accent, 0.28)}, inset 0 0 0 1px ${hexWithAlpha(accent, 0.18)}`,
          }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[0.55rem] font-medium text-white/85">
              <Clapperboard className="h-3 w-3" style={{ color: accent2 }} />
              Short 09:16
            </span>
            <span
              className="rounded-full px-1.5 py-0.5 text-[0.5rem] font-semibold text-slate-950"
              style={{ backgroundColor: accent }}
            >
              4K
            </span>
          </div>

          {/* Stage / play area */}
          <div
            className="relative mt-2 flex flex-1 items-center justify-center rounded-xl border border-white/8"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 38%, ${hexWithAlpha(accent, 0.32)}, transparent 62%)`,
            }}
          >
            <span
              className="grid h-12 w-12 place-items-center rounded-full text-slate-950"
              style={{
                backgroundColor: accent,
                boxShadow: `0 0 26px ${hexWithAlpha(accent, 0.6)}`,
              }}
            >
              <Play className="h-5 w-5 translate-x-[1px] fill-current" />
            </span>

            {/* Caption / subtitle bar near the bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex flex-col items-center gap-1">
              <span
                className="rounded-md px-2 py-1 text-center text-[0.6rem] font-bold leading-tight text-slate-950"
                style={{ backgroundColor: hexWithAlpha(accent2, 0.92) }}
              >
                THIS changes everything
              </span>
              <span className="rounded-md bg-black/55 px-2 py-0.5 text-center text-[0.55rem] font-semibold text-white">
                for creators in 2026
              </span>
            </div>
          </div>

          {/* Progress scrubber */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="text-[0.5rem] tabular-nums text-white/55">0:14</span>
            <div className="relative h-1 flex-1 rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{ width: "62%", backgroundColor: accent }}
              />
              <div
                className="absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-[#04101c]"
                style={{ left: "62%", backgroundColor: accent2 }}
              />
            </div>
            <span className="text-[0.5rem] tabular-nums text-white/45">0:22</span>
          </div>
        </div>
      </motion.div>

      {/* Top-left: Trend Sourced */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[6%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <TrendingUp className="h-3 w-3" /> Trend Sourced
        </span>
        <div className="flex flex-col gap-1.5">
          {TRENDS.map((row) => (
            <div className="flex items-center gap-2" key={row.topic}>
              <div className="flex flex-1 flex-col leading-tight">
                <span className="text-[0.7rem] font-medium text-white">{row.topic}</span>
                <span className="text-[0.55rem] text-white/55">{row.views} views</span>
              </div>
              <span
                className="rounded-full border px-1.5 py-0.5 text-[0.5rem] font-medium"
                style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent2 }}
              >
                {row.tag}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top-right: Script -> Video pipeline */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[4%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.32 }}
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          Script → Video
        </span>
        <div className="flex flex-col gap-1.5">
          {PIPELINE.map(({ label, Icon }, i) => (
            <div className="flex items-center gap-2" key={label}>
              <span
                className="grid h-6 w-6 place-items-center rounded-md border border-white/10"
                style={{
                  color: i <= 2 ? "rgb(2 6 23)" : accent,
                  backgroundColor: i <= 2 ? accent : hexWithAlpha(accent, 0.08),
                }}
              >
                <Icon className="h-3 w-3" />
              </span>
              <span className="flex-1 text-[0.7rem] text-white/85">{label}</span>
              <span
                className="text-[0.55rem] font-medium"
                style={{ color: i <= 2 ? accent2 : "rgba(255,255,255,0.45)" }}
              >
                {i <= 2 ? "Done" : "Running"}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom-left: Auto Captions */}
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
            <Captions className="h-3 w-3" /> Auto Captions
          </span>
          <span className="text-[0.7rem] font-semibold" style={{ color: accent2 }}>
            99.2%
          </span>
        </div>
        <div
          className="rounded-md border px-2.5 py-2 text-[0.65rem] leading-snug text-white/85"
          style={{
            backgroundColor: "rgba(8,12,28,0.6)",
            borderColor: hexWithAlpha(accent, 0.25),
          }}
        >
          <span className="font-semibold" style={{ color: accent }}>
            “
          </span>
          Here&apos;s how I made{" "}
          <span className="font-semibold text-white">3 viral clips</span> in one
          afternoon
          <span className="font-semibold" style={{ color: accent }}>
            ”
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-white/8 pt-2">
          <span className="text-[0.55rem] text-white/55">Word-level sync</span>
          <span className="text-[0.55rem] font-medium" style={{ color: accent }}>
            EN · auto
          </span>
        </div>
      </motion.div>

      {/* Bottom-right: Render Queue */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[2%] right-[2%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.48 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <Film className="h-3 w-3" /> Render Queue
          </span>
          <span
            className="rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
            style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent }}
          >
            Brand template
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {QUEUE.map((clip) => (
            <div className="flex flex-col gap-1" key={clip.name}>
              <div className="flex items-center justify-between">
                <span className="truncate text-[0.65rem] text-white/85">{clip.name}</span>
                <span className="text-[0.55rem] tabular-nums" style={{ color: accent2 }}>
                  {clip.progress}%
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10">
                <div
                  className="h-1 rounded-full"
                  style={{
                    width: `${clip.progress}%`,
                    backgroundColor: hexWithAlpha(accent, 0.9),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Soft pedestal glow under the video frame */}
      <div
        className="pointer-events-none absolute left-1/2 top-[78%] h-2 w-[220px] -translate-x-1/2 rounded-full blur-2xl"
        style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
      />
    </div>
  );
}
