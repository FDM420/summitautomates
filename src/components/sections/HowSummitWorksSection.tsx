"use client";

import { motion } from "framer-motion";
import { Activity, Compass, Cpu, LineChart, Workflow, type LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Step = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

const STEPS: Step[] = [
  {
    title: "Discover",
    description:
      "We map your current workflow, listening for the steps that cost time, get forgotten, or run inconsistently.",
    Icon: Compass,
  },
  {
    title: "Design",
    description:
      "We design the automation around your tools and people — not the other way around. Each step has clear owners.",
    Icon: Workflow,
  },
  {
    title: "Build",
    description:
      "We ship the connected systems: AI flows, dashboards, integrations, and the data model behind them.",
    Icon: Cpu,
  },
  {
    title: "Automate",
    description:
      "We replace the manual loops — replies, sorting, follow-up, document checks, attendance — with reliable software.",
    Icon: Activity,
  },
  {
    title: "Monitor",
    description:
      "We keep eyes on the live numbers, exceptions, and outcomes. The system improves quarter over quarter.",
    Icon: LineChart,
  },
];

export function HowSummitWorksSection() {
  return (
    <section className="section-shell py-20 sm:py-24" id="how">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <span className="eyebrow">How Summit Works</span>
        <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
          Discover → Design → Build → Automate → Monitor.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          We are an automation partner, not a tool vendor. The engagement starts with your
          messy reality and ends with a system that runs without you watching it.
        </p>
      </div>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent lg:block" />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step, i) => (
            <motion.li
              className="relative"
              initial={{ opacity: 0, y: 24 }}
              key={step.title}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
              viewport={{ once: true, amount: 0.3 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <div className="glass-card flex h-full flex-col gap-4 p-6" data-accent="cyan" style={{ borderRadius: "1.5rem" }}>
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-cyan-200">
                    <step.Icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-white/55">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-6 text-slate-300">{step.description}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
