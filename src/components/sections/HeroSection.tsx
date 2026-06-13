"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles, Workflow, Zap } from "lucide-react";
import Link from "next/link";
import { SERVICE_MODULES } from "@/lib/services-config";
import { OrbitalCards, OrbitCard } from "../hero/OrbitalCards";

/**
 * Central AI hub for the orbital carousel — rendered as a flat layer
 * beneath the orbiting cards (outside the 3D context; see OrbitalCards).
 * Cards in the front half of the orbit pass over it, back-half cards hide
 * via backface culling, which reads as orbiting "around" the hub.
 *
 * Layered from outermost to innermost:
 *   1. Faint outer haze (cyan radial glow)
 *   2. Slowly spinning dashed ring (counter-clockwise)
 *   3. Slowly spinning dotted ring (clockwise, different speed)
 *   4. Concentric pulse rings (ai-pulse animation)
 *   5. The ai-brain.svg illustration itself
 *   6. Inner core glow + soft highlight
 */
function AiHub({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none relative ${className}`}>
      {/* Outer haze */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(79,209,255,0.32)_0%,rgba(124,130,255,0.20)_35%,transparent_65%)] blur-2xl" />

      {/* Spinning dashed outer ring */}
      <div
        className="absolute inset-[6%] rounded-full border border-cyan-300/30"
        style={{
          borderStyle: "dashed",
          animation: "hub-spin 38s linear infinite reverse",
        }}
      />

      {/* Spinning dotted middle ring */}
      <div
        className="absolute inset-[12%] rounded-full border border-violet-300/35"
        style={{
          borderStyle: "dotted",
          borderWidth: "2px",
          animation: "hub-spin 26s linear infinite",
        }}
      />

      {/* Concentric pulse rings */}
      <div
        className="absolute inset-[18%] rounded-full border border-cyan-300/40"
        style={{ animation: "hub-pulse 4s ease-out infinite" }}
      />
      <div
        className="absolute inset-[18%] rounded-full border border-cyan-300/40"
        style={{ animation: "hub-pulse 4s ease-out infinite 1.3s" }}
      />
      <div
        className="absolute inset-[18%] rounded-full border border-cyan-300/40"
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
            "radial-gradient(circle at center, rgb(var(--hub-disc-rgb) / 0.92) 0%, rgb(var(--hub-disc-rgb) / 0.85) 45%, rgb(var(--hub-disc-rgb) / 0.55) 75%, rgb(var(--hub-disc-rgb) / 0) 100%)",
          boxShadow:
            "inset 0 0 60px rgba(79,209,255,0.18), 0 0 70px rgba(79,209,255,0.30)",
        }}
      />

      {/* Summit AI android — Soong-type synthetic human. Eyes and accent
          piping cycle through the 5 service colors in sync with the orbital
          carousel below. */}
      <div className="absolute inset-[10%] grid place-items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Summit Automates AI android — a refined synthetic-human core whose eyes glow in the accent color of each automation service as it orbits"
          className="h-full w-full select-none object-contain drop-shadow-[0_0_55px_rgba(79,209,255,0.65)]"
          src="/illustrations/android.svg"
        />
      </div>

      {/* Inner core highlight */}
      <div className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle_at_45%_40%,rgba(255,255,255,0.22)_0%,rgba(79,209,255,0.12)_35%,transparent_70%)]" />
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
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-8">
        {/* LEFT — copy + CTAs + trust + stats */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-7 lg:pt-6"
          initial={false}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <span className="eyebrow w-fit">
            <Sparkles className="h-3 w-3" /> Automation Command Center
          </span>

          <h1 className="text-balance text-[2.65rem] font-semibold leading-[1.02] tracking-[-0.04em] text-ink sm:text-5xl lg:text-[3.6rem]">
            Automate your business workflows{" "}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              with smart AI systems.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-muted sm:text-lg">
            Summit Automates builds intelligent automation systems that streamline operations,
            reduce costs, and accelerate business growth — across WhatsApp, recruitment, CRM,
            documents, and workforce.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(79,209,255,0.28)] transition hover:scale-[1.02] active:scale-[0.99]"
              href="#contact"
            >
              Book a Discovery Call
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-full border border-hair bg-overlay px-6 py-3 text-sm font-semibold text-ink transition hover:border-hair-strong hover:bg-overlay-strong active:scale-[0.99]"
              href="#services"
            >
              Explore Services
            </Link>
          </div>

          {/* Trust pills */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRUST_PILLS.map(({ label, Icon }) => (
              <div
                className="flex items-center gap-2 rounded-xl border border-hair bg-overlay px-3 py-2.5 text-xs text-ink/80 backdrop-blur"
                key={label}
              >
                <Icon className="h-3.5 w-3.5 text-accent-ink" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map((stat) => (
              <div
                className="rounded-2xl border border-hair bg-overlay px-4 py-3 backdrop-blur"
                key={stat.label}
              >
                <p className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-2xl font-semibold tracking-tight text-transparent dark:from-cyan-200 dark:to-violet-300 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-[0.7rem] uppercase tracking-[0.15em] text-ink/55">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT (tablet/desktop) — AI hub + orbiting service cards */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto hidden w-full max-w-[760px] md:block md:aspect-[5/4] lg:aspect-[1/1] lg:max-w-[820px]"
          initial={false}
          transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
        >
          {/* "SUMMIT AUTOMATES AI CORE" label */}
          <div className="pointer-events-none absolute left-1/2 top-[80%] z-10 -translate-x-1/2 font-mono text-[0.65rem] uppercase tracking-[0.4em] text-accent-ink/80">
            Summit Automates AI Core
          </div>

          {/* Service cards orbit around the hub. The hub renders as a flat
              layer under the carousel; back-half cards hide via backface
              culling (see OrbitalCards). */}
          <OrbitalCards
            radius={310}
            center={<AiHub className="h-[780px] w-[780px] -translate-x-1/2 -translate-y-1/2" />}
          />
        </motion.div>

        {/* RIGHT (phones / small tablets) — compact hub + swipeable service
            card row. Below ~768px the 3D carousel can't fit readable cards,
            and live 3D + big filtered layers are what flicker on mobile
            GPUs — so small screens get a flat, lightweight variant instead.
            Cards snap to the horizontal center of the screen. */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative md:hidden"
          initial={false}
          transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
        >
          <AiHub className="mx-auto h-[270px] w-[270px]" />
          <p className="mt-3 text-center font-mono text-[0.6rem] uppercase tracking-[0.4em] text-accent-ink/80">
            Summit Automates AI Core
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {SERVICE_MODULES.map((module, i) => (
              <OrbitCard
                badge={`0${i + 1}`}
                className="w-full"
                key={module.slug}
                module={module}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
