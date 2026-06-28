"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";
import Link from "next/link";
import { OrbitalCards } from "../hero/OrbitalCards";

/**
 * Central AI hub for the orbital carousel — rendered as a flat plane
 * inside the 3D context at z=0. Big enough to occlude cards orbiting
 * behind it (giving the holographic depth effect), small enough to let
 * cards orbit visibly around it.
 *
 * Layered from outermost to innermost:
 *   1. Faint outer haze (cyan radial glow)
 *   2. Slowly spinning dashed ring (counter-clockwise)
 *   3. Slowly spinning dotted ring (clockwise, different speed)
 *   4. Concentric pulse rings (ai-pulse animation)
 *   5. The ai-brain.svg illustration itself
 *   6. Inner core glow + soft highlight
 */
function AiHub() {
  return (
    <div className="pointer-events-none relative h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2">
      {/* Outer haze */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(233,200,120,0.32)_0%,rgba(212,175,90,0.20)_35%,transparent_65%)] blur-2xl" />

      {/* Spinning dashed outer ring */}
      <div
        className="absolute inset-[6%] rounded-full border border-gold-300/30"
        style={{
          borderStyle: "dashed",
          animation: "hub-spin 38s linear infinite reverse",
        }}
      />

      {/* Spinning dotted middle ring */}
      <div
        className="absolute inset-[12%] rounded-full border border-gold-300/35"
        style={{
          borderStyle: "dotted",
          borderWidth: "2px",
          animation: "hub-spin 26s linear infinite",
        }}
      />

      {/* Concentric pulse rings */}
      <div
        className="absolute inset-[18%] rounded-full border border-gold-300/40"
        style={{ animation: "hub-pulse 4s ease-out infinite" }}
      />
      <div
        className="absolute inset-[18%] rounded-full border border-gold-300/40"
        style={{ animation: "hub-pulse 4s ease-out infinite 1.3s" }}
      />
      <div
        className="absolute inset-[18%] rounded-full border border-gold-300/40"
        style={{ animation: "hub-pulse 4s ease-out infinite 2.6s" }}
      />

      {/* Solid-ish disc that visually blocks cards passing behind the hub.
          Radial gradient: opaque dark navy in the middle, fades to transparent at the edge
          so back cards are hidden in the center but slightly visible at the rim
          (the "emerging from behind the wheel" effect). */}
      <div
        className="absolute inset-[14%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(8,14,32,0.92) 0%, rgba(8,14,32,0.85) 45%, rgba(8,14,32,0.55) 75%, rgba(8,14,32,0) 100%)",
          boxShadow:
            "inset 0 0 60px rgba(233,200,120,0.18), 0 0 70px rgba(233,200,120,0.30)",
        }}
      />

      {/* Summit AI android — Soong-type synthetic human. Eyes and accent
          piping cycle through the 5 service colors in sync with the orbital
          carousel below. */}
      <div className="absolute inset-[10%] grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Summit Automates AI android — a refined synthetic-human core whose eyes glow in the accent color of each automation service as it orbits"
          className="h-full w-full select-none object-contain drop-shadow-[0_0_55px_rgba(233,200,120,0.65)]"
          src="/illustrations/android.svg"
        />
      </div>

      {/* Inner core highlight */}
      <div className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle_at_45%_40%,rgba(255,255,255,0.22)_0%,rgba(233,200,120,0.12)_35%,transparent_70%)]" />
    </div>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

const TRUST_PILLS = [
  { label: "Enterprise grade", Icon: ShieldCheck },
  { label: "AI powered", Icon: Sparkles },
  { label: "Scalable", Icon: Workflow },
  { label: "Fast to ship", Icon: Zap },
];

const STATS = [
  { value: "500+", label: "Workflows deployed" },
  { value: "98%", label: "Process efficiency lift" },
  { value: "40+", label: "Industries served" },
  { value: "99.9%", label: "Uptime SLO" },
];

export function HeroSection() {
  return (
    <section className="section-shell relative pt-10 sm:pt-14 lg:pt-20" id="top">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-8">
        {/* LEFT — copy + CTAs + trust + stats */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-7 lg:pt-6"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <span className="eyebrow w-fit">
            <Sparkles className="h-3 w-3" /> Automation Command Center
          </span>

          <h1 className="text-balance text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.6rem]">
            Automate your business workflows{" "}
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 bg-clip-text text-transparent">
              with smart AI systems.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            Summit Automates builds intelligent automation systems that streamline operations,
            reduce costs, and accelerate business growth — across WhatsApp, recruitment, CRM,
            documents, and workforce.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(233,200,120,0.28)] transition hover:scale-[1.02] active:scale-[0.99]"
              href="#contact"
            >
              Book a Discovery Call
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10 active:scale-[0.99]"
              href="#services"
            >
              Explore Services
            </Link>
          </div>

          {/* Trust pills */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRUST_PILLS.map(({ label, Icon }) => (
              <div
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-3 py-2.5 text-xs text-white/80 backdrop-blur"
                key={label}
              >
                <Icon className="h-3.5 w-3.5 text-gold-300" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 backdrop-blur"
                key={stat.label}
              >
                <p className="bg-gradient-to-r from-gold-200 to-gold-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.15em] text-white/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT — AI hub + service mini-cards + beams */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto aspect-square w-full max-w-[760px] sm:aspect-[5/4] lg:aspect-[1/1] lg:max-w-[820px]"
          initial={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
        >
          {/* "SUMMIT AUTOMATES AI CORE" label */}
          <div className="pointer-events-none absolute left-1/2 top-[80%] z-10 -translate-x-1/2 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-gold-200/80 sm:text-[0.65rem]">
            Summit Automates AI Core
          </div>

          {/* 5 service cards orbit around the hub — rotates 360° in ~15s, pauses 1s, repeats.
              The brain hub is rendered INSIDE OrbitalCards' 3D context at z=0 so cards
              naturally pass behind it when they rotate to the back of the carousel. */}
          <OrbitalCards
            radius={310}
            center={<AiHub />}
          />
        </motion.div>
      </div>
    </section>
  );
}
