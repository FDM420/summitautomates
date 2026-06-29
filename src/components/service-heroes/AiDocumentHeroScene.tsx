"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  FilePen,
  FileText,
  ListChecks,
  ScrollText,
  Stamp,
} from "lucide-react";
import { SERVICE_MODULES_BY_SLUG, hexWithAlpha } from "@/lib/services-config";

const SLUG = "ai-document-generation";
const m = SERVICE_MODULES_BY_SLUG[SLUG]!;
const accent = m.hex;
const accent2 = m.hexSecondary;
const EASE = [0.22, 1, 0.36, 1] as const;

const OUTLINE = [
  { label: "Executive Summary", state: "done" },
  { label: "Market Analysis", state: "done" },
  { label: "Financials", state: "active" },
  { label: "Risks & Mitigation", state: "queued" },
  { label: "Appendix", state: "queued" },
] as const;

const REVIEW = [
  { who: "A. Rahman", role: "Approved", Icon: CheckCircle2, tint: accent2 },
  { who: "Editor AI", role: "12 edits", Icon: FilePen, tint: accent },
  { who: "Compliance", role: "Stamped", Icon: Stamp, tint: accent2 },
];

export function AiDocumentHeroScene() {
  return (
    <div className="relative h-full w-full">
      {/* Center: A4 document / PDF page */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
      >
        <div
          className="flex h-[330px] w-[232px] flex-col gap-3 rounded-2xl border bg-[#04101c] p-4"
          style={{
            borderColor: hexWithAlpha(accent, 0.45),
            boxShadow: `0 0 38px ${hexWithAlpha(accent, 0.35)}, inset 0 0 20px ${hexWithAlpha(accent, 0.08)}`,
          }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-lg border"
              style={{
                backgroundColor: hexWithAlpha(accent, 0.12),
                borderColor: hexWithAlpha(accent, 0.4),
              }}
            >
              <FileText className="h-3.5 w-3.5" style={{ color: accent }} />
            </span>
            <div className="flex flex-1 flex-col leading-tight">
              <span className="text-[0.62rem] font-semibold text-white">Business Plan 2026</span>
              <span className="font-mono text-[0.5rem] uppercase tracking-[0.18em] text-white/45">
                Draft · Page 1 of 24
              </span>
            </div>
            <span
              className="rounded border px-1.5 py-0.5 font-mono text-[0.5rem] uppercase tracking-wider"
              style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent }}
            >
              PDF
            </span>
          </div>

          <div className="h-px w-full" style={{ backgroundColor: hexWithAlpha(accent, 0.18) }} />

          {/* Heading + paragraph skeleton */}
          <div className="flex flex-col gap-1.5">
            <div className="h-2 w-2/5 rounded-full" style={{ backgroundColor: hexWithAlpha(accent, 0.7) }} />
            <div className="h-1.5 w-full rounded-full bg-white/12" />
            <div className="h-1.5 w-11/12 rounded-full bg-white/12" />
            <div className="h-1.5 w-4/5 rounded-full bg-white/12" />
          </div>

          {/* Mini chart / table block */}
          <div
            className="flex items-end gap-1.5 rounded-lg border p-2.5"
            style={{ borderColor: hexWithAlpha(accent, 0.25), backgroundColor: hexWithAlpha(accent, 0.05) }}
          >
            {[40, 64, 32, 80, 52, 68].map((h, i) => (
              <div
                className="flex-1 rounded-sm"
                key={i}
                style={{
                  height: `${h * 0.5}px`,
                  backgroundColor: i % 2 === 0 ? accent : accent2,
                  opacity: 0.55 + i * 0.06,
                }}
              />
            ))}
          </div>

          {/* Second paragraph skeleton */}
          <div className="flex flex-col gap-1.5">
            <div className="h-1.5 w-full rounded-full bg-white/12" />
            <div className="h-1.5 w-10/12 rounded-full bg-white/12" />
          </div>

          {/* Generating shimmer line */}
          <div className="mt-auto flex items-center gap-2">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              className="h-1.5 flex-1 rounded-full"
              style={{
                background: `linear-gradient(90deg, ${hexWithAlpha(accent, 0.15)}, ${accent2}, ${hexWithAlpha(accent, 0.15)})`,
              }}
              transition={{ duration: 1.6, ease: "easeInOut", repeat: Infinity }}
            />
            <span className="font-mono text-[0.5rem] uppercase tracking-[0.16em] text-white/55">
              Generating…
            </span>
          </div>

          {/* Footer page number */}
          <div className="flex items-center justify-between">
            <span className="text-[0.5rem] text-white/35">Summit Automates</span>
            <span className="text-[0.5rem] text-white/45">— 1 —</span>
          </div>
        </div>
      </motion.div>

      {/* Top-left: Brief -> Draft */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex left-0 top-[6%] w-[15rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: -16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.25 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <FilePen className="h-3 w-3" /> Brief → Draft
        </span>
        {[
          { step: "Short brief in", sub: "2 lines of context", done: true },
          { step: "AI drafts sections", sub: "24 pages structured", done: true },
          { step: "Human review", sub: "Editor sign-off", done: false },
        ].map((row, i) => (
          <div className="flex items-center gap-2" key={row.step}>
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.5rem] font-semibold"
              style={{
                backgroundColor: row.done ? accent : hexWithAlpha(accent, 0.12),
                borderColor: hexWithAlpha(accent, 0.4),
                color: row.done ? "rgb(2,6,23)" : accent2,
                borderWidth: row.done ? 0 : 1,
              }}
            >
              {i + 1}
            </span>
            <div className="flex flex-1 flex-col leading-tight">
              <span className="text-[0.65rem] font-medium text-white">{row.step}</span>
              <span className="text-[0.5rem] text-white/55">{row.sub}</span>
            </div>
            {row.done ? (
              <CheckCircle2 className="h-3.5 w-3.5" style={{ color: accent2 }} />
            ) : (
              <span className="text-[0.5rem] text-white/45">Next</span>
            )}
          </div>
        ))}
      </motion.div>

      {/* Top-right: Document Outline */}
      <motion.div
        animate={{ opacity: 1, x: 0 }}
        className="glass-card absolute hidden lg:flex right-0 top-[4%] w-[15rem] flex-col gap-1.5 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, x: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.32 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <ListChecks className="h-3 w-3" /> Document Outline
        </span>
        {OUTLINE.map((row) => (
          <div className="flex items-center gap-2 text-[0.65rem]" key={row.label}>
            {row.state === "done" ? (
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: accent2 }} />
            ) : row.state === "active" ? (
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: accent }}
                transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity }}
              />
            ) : (
              <span className="h-2.5 w-2.5 shrink-0 rounded-full border" style={{ borderColor: hexWithAlpha(accent, 0.4) }} />
            )}
            <span className={row.state === "queued" ? "flex-1 text-white/55" : "flex-1 text-white/85"}>
              {row.label}
            </span>
            {row.state === "active" && (
              <span className="font-mono text-[0.5rem] uppercase tracking-wider" style={{ color: accent }}>
                Writing
              </span>
            )}
          </div>
        ))}
      </motion.div>

      {/* Bottom-left: Export */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[4%] left-[3%] w-[16rem] flex-col gap-2 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.4 }}
      >
        <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
          <Download className="h-3 w-3" /> Export
        </span>
        <div className="flex flex-wrap gap-1.5">
          {["PDF", "DOCX"].map((fmt) => (
            <span
              className="flex items-center gap-1 rounded-md border px-2 py-0.5 text-[0.55rem] font-medium"
              key={fmt}
              style={{
                backgroundColor: hexWithAlpha(accent, 0.1),
                borderColor: hexWithAlpha(accent, 0.35),
                color: accent2,
              }}
            >
              <ScrollText className="h-3 w-3" /> {fmt}
            </span>
          ))}
          <span
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.55rem] font-semibold text-slate-950"
            style={{ backgroundColor: accent }}
          >
            <Stamp className="h-3 w-3" /> Brand template
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-white/8 pt-2 text-[0.6rem]">
          <span className="text-white/55">Pages</span>
          <span className="font-semibold text-white">24</span>
        </div>
      </motion.div>

      {/* Bottom-right: Review Status */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="glass-card absolute hidden lg:flex bottom-[2%] right-[2%] w-[16rem] flex-col gap-1.5 p-4"
        data-accent={m.accent}
        initial={{ opacity: 0, y: 16 }}
        style={{ borderRadius: "1rem" }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.48 }}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-white/55">
            <CheckCircle2 className="h-3 w-3" /> Review Status
          </span>
          <span
            className="rounded-full border px-2 py-0.5 text-[0.5rem] font-medium"
            style={{ borderColor: hexWithAlpha(accent, 0.4), color: accent2 }}
          >
            2 / 3
          </span>
        </div>
        {REVIEW.map((row) => (
          <div className="flex items-center gap-2" key={row.who}>
            <row.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: row.tint }} />
            <span className="flex-1 text-[0.65rem] text-white/85">{row.who}</span>
            <span className="text-[0.5rem]" style={{ color: row.tint }}>
              {row.role}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Pedestal glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-[78%] h-2 w-[220px] -translate-x-1/2 rounded-full blur-2xl"
        style={{ backgroundColor: hexWithAlpha(accent, 0.55) }}
      />
    </div>
  );
}
