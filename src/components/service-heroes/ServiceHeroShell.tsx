"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { hexWithAlpha, type ServiceModule } from "@/lib/services-config";

const EASE = [0.22, 1, 0.36, 1] as const;

type Stat = { value: string; label: string };

type ServiceHeroShellProps = {
  module: ServiceModule;
  /** Override the H1 if needed; defaults to the brief style "<Full Name> — <tagline>". */
  title?: ReactNode;
  /** Subtitle/blurb */
  description?: string;
  /** Primary CTA */
  primaryCta?: { label: string; href: string };
  /** Secondary CTA */
  secondaryCta?: { label: string; href: string };
  /** Stats row below the CTAs */
  stats?: Stat[];
  /** The dense right-column scene composition. */
  scene: ReactNode;
};

const DEFAULT_PRIMARY = { label: "Book a Discovery Call", href: "#contact" };

export function ServiceHeroShell({
  module,
  title,
  description,
  primaryCta = DEFAULT_PRIMARY,
  secondaryCta,
  stats,
  scene,
}: ServiceHeroShellProps) {
  return (
    <section className="section-shell relative pt-10 sm:pt-14 lg:pt-20">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.45fr)] lg:gap-10">
        {/* Copy column */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 lg:pt-6"
          initial={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.75, ease: EASE }}
        >
          <span
            className="eyebrow w-fit"
            style={{
              borderColor: hexWithAlpha(module.hex, 0.4),
              color: module.hex,
            }}
          >
            <Sparkles className="h-3 w-3" /> {module.shortName}
          </span>

          <h1 className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-5xl sm:tracking-[-0.045em] lg:text-[3.4rem]">
            {title ?? module.fullName}{" "}
            <span
              className="block bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(120deg, ${module.hex}, ${module.hexSecondary})`,
              }}
            >
              {module.tagline.replace(/\.$/, "")}.
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
            {description ?? module.blurb}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.02] active:scale-[0.99]"
              href={primaryCta.href}
              style={{
                background: `linear-gradient(120deg, ${module.hex}, ${module.hexSecondary})`,
                boxShadow: `0 18px 50px ${hexWithAlpha(module.hex, 0.32)}`,
              }}
            >
              {primaryCta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
            {secondaryCta ? (
              <Link
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10 active:scale-[0.99]"
                href={secondaryCta.href}
              >
                {secondaryCta.label}
              </Link>
            ) : null}
          </div>

          {/* Capability pills */}
          <div className="flex flex-wrap gap-2">
            {module.capabilities.map((c) => (
              <span
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/80 backdrop-blur"
                key={c}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Stats row */}
          {stats?.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((stat) => (
                <div
                  className="rounded-2xl border border-white/8 bg-white/3 px-4 py-3 backdrop-blur"
                  key={stat.label}
                >
                  <p
                    className="bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl"
                    style={{
                      backgroundImage: `linear-gradient(120deg, ${module.hex}, ${module.hexSecondary})`,
                    }}
                  >
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[0.7rem] uppercase tracking-[0.15em] text-white/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </motion.div>

        {/* Scene column */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="relative mx-auto aspect-[5/4] w-full max-w-[820px]"
          initial={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.85, ease: EASE, delay: 0.15 }}
        >
          {scene}
        </motion.div>
      </div>
    </section>
  );
}
