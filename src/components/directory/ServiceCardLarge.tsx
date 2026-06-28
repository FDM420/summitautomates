"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { hexWithAlpha, type ServiceModule } from "@/lib/services-config";

const EASE = [0.22, 1, 0.36, 1] as const;

export type MetricPill = {
  label: string;
  value: string;
  /** Tailwind text color class for value. */
  tone?: "green" | "blue" | "violet" | "gold" | "cyan";
};

export type ServiceCardLargeProps = {
  module: ServiceModule;
  /** Status pill text (e.g. "Open"). */
  status?: string;
  /** Two metric pills under the description. */
  metrics: [MetricPill, MetricPill];
  /** Three feature bullets shown with checkmarks. */
  bullets: [string, string, string];
  /** Right-side illustration composition. */
  illustration: ReactNode;
  /** Index for stagger animation. */
  index: number;
};

const TONE_COLOR: Record<NonNullable<MetricPill["tone"]>, string> = {
  green: "#34d8a4",
  blue: "#e6c878",
  violet: "#a78bfa",
  gold: "#f5c46b",
  cyan: "#f4dd95",
};

export function ServiceCardLarge({
  module,
  status = "Open",
  metrics,
  bullets,
  illustration,
  index,
}: ServiceCardLargeProps) {
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="group relative isolate overflow-hidden rounded-[2rem] border bg-[#070b1c] transition-all duration-500 hover:-translate-y-1"
      data-accent={module.accent}
      initial={{ opacity: 0, y: 24 }}
      style={{
        borderColor: hexWithAlpha(module.hex, 0.25),
        boxShadow: `
          0 30px 80px rgba(0,0,0,0.45),
          inset 0 1px 0 rgba(255,255,255,0.04)
        `,
      }}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.08 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {/* Outer luminous border on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${hexWithAlpha(module.hex, 0.6)}, transparent 35%, ${hexWithAlpha(module.hexSecondary, 0.5)})`,
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {/* Faint background grid */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div className="grid items-stretch gap-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* LEFT: copy + CTA */}
        <div className="flex flex-col gap-6 p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 place-items-center rounded-xl border"
              style={{
                backgroundColor: hexWithAlpha(module.hex, 0.1),
                borderColor: hexWithAlpha(module.hex, 0.35),
                color: module.hex,
              }}
            >
              <module.Icon className="h-4 w-4" />
            </span>
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[0.7rem] font-medium"
              style={{
                backgroundColor: hexWithAlpha("#34d8a4", 0.08),
                borderColor: hexWithAlpha("#34d8a4", 0.4),
                color: "#34d8a4",
              }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {status}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.04em] text-white sm:text-4xl">
              {module.fullName}
            </h2>
            <p className="max-w-md text-sm leading-6 text-slate-300/85 sm:text-base sm:leading-7">
              {module.blurb}
            </p>
          </div>

          {/* Metric pills */}
          <div className="flex flex-wrap gap-3">
            {metrics.map((metric) => {
              const tone = TONE_COLOR[metric.tone ?? "green"];
              return (
                <div
                  className="rounded-xl border px-3.5 py-2.5 backdrop-blur"
                  key={metric.label}
                  style={{
                    backgroundColor: hexWithAlpha(tone, 0.06),
                    borderColor: hexWithAlpha(tone, 0.3),
                  }}
                >
                  <p className="text-[0.65rem] uppercase tracking-[0.15em] text-white/55">
                    {metric.label}
                  </p>
                  <p className="mt-1 text-lg font-semibold" style={{ color: tone }}>
                    {metric.value}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bullets */}
          <ul className="flex flex-col gap-2.5">
            {bullets.map((b) => (
              <li className="flex items-center gap-2.5" key={b}>
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: module.hex }} />
                <span className="text-sm text-white/85">{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-2 flex items-center gap-2 border-t border-white/8 pt-5 text-xs text-white/55">
            <ArrowRight className="h-3.5 w-3.5" />
            Open the full service page and discovery path.
          </div>

          <Link
            className="group/btn inline-flex w-fit items-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:gap-3"
            href={`/services/${module.slug}`}
            style={{
              background: `linear-gradient(120deg, ${hexWithAlpha(module.hex, 0.85)}, ${hexWithAlpha(module.hexSecondary, 0.95)})`,
              boxShadow: `0 18px 40px ${hexWithAlpha(module.hex, 0.35)}`,
            }}
          >
            View service
            <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-0.5" />
          </Link>
        </div>

        {/* RIGHT: illustration */}
        <div className="relative min-h-[420px] overflow-hidden border-t border-white/5 lg:border-l lg:border-t-0">
          {/* Soft accent glow background */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-0"
            style={{
              background: `radial-gradient(circle at 50% 60%, ${hexWithAlpha(module.hex, 0.18)} 0%, transparent 55%), radial-gradient(circle at 80% 20%, ${hexWithAlpha(module.hexSecondary, 0.15)} 0%, transparent 50%)`,
            }}
          />
          <div className="relative h-full w-full">{illustration}</div>
        </div>
      </div>
    </motion.article>
  );
}
