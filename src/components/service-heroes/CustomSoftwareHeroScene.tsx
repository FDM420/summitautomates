"use client";

import { motion } from "framer-motion";
import {
  AppWindow,
  Blocks,
  CheckCircle2,
  Code2,
  Database,
  GitBranch,
  Rocket,
  Server,
} from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "custom-software-development";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

const KPIS = [
  { label: "MRR", value: "$48.2k", delta: "+12%" },
  { label: "Active Users", value: "9,412", delta: "+5.4%" },
  { label: "Uptime", value: "99.98%", delta: "30d" },
];

const BARS = [38, 56, 44, 72, 61, 88, 70];

const CODE_LINES = [
  { tok: "export", rest: " async function getUser(" },
  { tok: "  const", rest: " user = await db.find()" },
  { tok: "  return", rest: " Response.json(user)" },
  { tok: "}", rest: "" },
  { tok: "// deployed ✓", rest: "" },
];

const PIPELINE = [
  { stage: "Build", Icon: Blocks, state: "done" },
  { stage: "Test", Icon: CheckCircle2, state: "done" },
  { stage: "Deploy", Icon: Rocket, state: "active" },
];

const STACK = ["Next.js", "FastAPI", "Postgres", "Supabase", "TypeScript", "Docker"];

export function CustomSoftwareHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Center: browser/app window with mini dashboard */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 14 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
      >
        <div
          className="flex h-[330px] w-[320px] flex-col overflow-hidden rounded-xl border bg-[#04101c]"
          style={{
            borderColor: hexWithAlpha(accent, 0.45),
            boxShadow: `0 0 40px ${hexWithAlpha(accent, 0.3)}, 0 0 0 1px ${hexWithAlpha(accent, 0.12)}`,
          }}
        >
          {/* Top bar: 3 dots + URL pill */}
          <div
            className="flex items-center gap-2 border-b px-3 py-2"
            style={{ borderColor: hexWithAlpha(accent, 0.2) }}
          >
            <span className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-white/25" />
            </span>
            <span
              className="flex flex-1 items-center gap-1.5 rounded-md border px-2 py-0.5 text-[0.55rem] text-white/55"
              style={{
                backgroundColor: hexWithAlpha(accent, 0.08),
                borderColor: hexWithAlpha(accent, 0.25),
              }}
            >
              <AppWindow className="h-2.5 w-2.5" style={{ color: accent }} />
              app.yourcompany.com
            </span>
          </div>

          {/* Window body: KPI tiles + bar chart */}
          <div className="flex flex-1 flex-col gap-3 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[0.7rem] font-semibold text-white">Dashboard</span>
              <span className="text-[0.5rem] text-white/45">Last 7 days</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {KPIS.map((kpi) => (
                <div
                  className="flex flex-col gap-0.5 rounded-lg border p-2"
                  key={kpi.label}
                  style={{
                    backgroundColor: hexWithAlpha(accent, 0.06),
                    borderColor: hexWithAlpha(accent, 0.22),
                  }}
                >
                  <span className="text-[0.5rem] uppercase tracking-wider text-white/45">
                    {kpi.label}
                  </span>
                  <span className="text-[0.7rem] font-semibold text-white">{kpi.value}</span>
                  <span className="text-[0.5rem] font-medium" style={{ color: accent2 }}>
                    {kpi.delta}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="flex flex-1 flex-col gap-2 rounded-lg border p-2.5"
              style={{
                backgroundColor: "rgba(6,10,24,0.5)",
                borderColor: hexWithAlpha(accent, 0.2),
              }}
            >
              <span className="text-[0.55rem] text-white/55">Revenue</span>
              <div className="flex flex-1 items-end gap-1.5">
                {BARS.map((h, i) => (
                  <div
                    className="flex-1 rounded-t"
                    key={i}
                    style={{
                      height: `${h}%`,
                      background: `linear-gradient(to top, ${accent}, ${hexWithAlpha(accent2, 0.7)})`,
                      opacity: 0.55 + i * 0.06,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Top-left: Code editor snippet */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[6%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Code2 className="h-3 w-3" /> Code
        </span>
        <div
          className="flex flex-col gap-0.5 rounded-md border bg-[#050b1a] p-2 font-mono text-[0.55rem] leading-relaxed"
          style={{ borderColor: hexWithAlpha(accent, 0.25) }}
        >
          {CODE_LINES.map((line, i) => (
            <div className="flex gap-2" key={i}>
              <span className="w-3 select-none text-right text-white/30">{i + 1}</span>
              <span className="text-white/75">
                <span style={{ color: accent2 }}>{line.tok}</span>
                {line.rest}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top-right: Architecture diagram */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[4%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.32 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Blocks className="h-3 w-3" /> Architecture
        </span>
        <div className="flex flex-col gap-1.5">
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { name: "Web", Icon: AppWindow },
              { name: "API", Icon: Server },
              { name: "DB", Icon: Database },
              { name: "Queue", Icon: GitBranch },
            ].map((node) => (
              <div
                className="flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[0.6rem] text-white/85"
                key={node.name}
                style={{
                  backgroundColor: hexWithAlpha(accent, 0.08),
                  borderColor: hexWithAlpha(accent, 0.3),
                }}
              >
                <node.Icon className="h-3 w-3 shrink-0" style={{ color: accent }} />
                {node.name}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-1 text-[0.5rem] text-white/45">
            <span>Web</span>
            <span style={{ color: accent }}>→</span>
            <span>API</span>
            <span style={{ color: accent }}>→</span>
            <span>DB</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom-left: CI/CD pipeline */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[3%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <GitBranch className="h-3 w-3" /> Deploy
          </span>
          <span
            className="rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
            style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent }}
          >
            Live
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          {PIPELINE.map((step) => (
            <div className="flex items-center gap-2" key={step.stage}>
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: step.state === "active" ? accent2 : accent,
                  boxShadow:
                    step.state === "active"
                      ? `0 0 8px ${hexWithAlpha(accent2, 0.8)}`
                      : "none",
                }}
              />
              <step.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
              <span className="flex-1 text-[0.65rem] text-white/85">{step.stage}</span>
              <span
                className="text-[0.5rem] font-medium"
                style={{ color: step.state === "active" ? accent2 : "rgba(255,255,255,0.45)" }}
              >
                {step.state === "active" ? "running" : "passed"}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom-right: Tech stack chips */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[2%] right-[2%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.48 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Server className="h-3 w-3" /> Stack
        </span>
        <div className="flex flex-wrap gap-1.5">
          {STACK.map((tech, i) => (
            <span
              className="rounded-full border px-2 py-1 text-[0.55rem] font-medium text-white/85"
              key={tech}
              style={{
                backgroundColor: hexWithAlpha(i % 2 === 0 ? accent : accent2, 0.1),
                borderColor: hexWithAlpha(i % 2 === 0 ? accent : accent2, 0.35),
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Pedestal glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[78%] h-2 w-[220px] -translate-x-1/2 rounded-full blur-2xl"
        style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
      />
    </div>
  );
}
