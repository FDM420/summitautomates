"use client";

import {
  AlertCircle,
  BellRing,
  Check,
  CheckCircle2,
  FileSearch,
  ScanLine,
  ScrollText,
} from "lucide-react";
import { Float, Podium, ServiceHeroCardShell } from "./hero-card-shared";

export function DocSecurityServiceHeroCard() {
  return (
    <ServiceHeroCardShell
      accent="gold"
      ctaLabel="Book a Discovery Call"
      description="Summit builds document verification, security monitoring, and access control systems for OCR extraction, expiry tracking, compliance checks, audit trails, and staff access management."
      discoveryLine="Open the full service page and discovery path."
      features={[
        { icon: <FileSearch className="h-5 w-5" />, label: "OCR and data extraction" },
        { icon: <BellRing className="h-5 w-5" />, label: "Missing document alerts" },
        { icon: <AlertCircle className="h-5 w-5" />, label: "Expiry and compliance checks" },
      ]}
      metrics={[
        { icon: <ScanLine className="h-6 w-6" />, label: "Checks", value: "Automated" },
        { icon: <ScrollText className="h-6 w-6" />, label: "Logs", value: "Tracked" },
      ]}
      scene={<DocSecScene />}
      statusLabel="Open"
      title="Document Verification, Security & Access Control Automation"
    />
  );
}

/* ---------------------------------------
   SCENE — OCR document, shield, padlock on a glowing podium.
--------------------------------------- */

function DocSecScene() {
  return (
    <>
      {/* Corner brackets framing the scene (subtle scanner frame) */}
      <CornerBrackets />

      {/* Large OCR document — centerpiece, slightly back-left */}
      <Float amplitude={10} className="left-[12%] top-[6%] [transform:translateZ(40px)_rotateY(-6deg)]" delay={0}>
        <OcrDocument />
      </Float>

      {/* Shield with check — front-center */}
      <Float amplitude={8} className="left-[42%] top-[42%] [transform:translateZ(130px)]" delay={1.4}>
        <ShieldBadge />
      </Float>

      {/* Padlock — right side, smaller */}
      <Float amplitude={6} className="right-[10%] top-[34%] [transform:translateZ(95px)_rotateY(8deg)]" delay={2.6}>
        <Padlock />
      </Float>

      {/* ID scanner pad — small, top-right corner */}
      <Float amplitude={5} className="right-[5%] top-[8%] [transform:translateZ(70px)]" delay={0.9}>
        <ScannerPad />
      </Float>

      {/* Podium */}
      <Podium accent="gold" />
    </>
  );
}

function CornerBrackets() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full text-amber-300/60"
      fill="none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path d="M2 12 V2 H12" stroke="currentColor" strokeWidth="0.4" />
      <path d="M88 2 H98 V12" stroke="currentColor" strokeWidth="0.4" />
      <path d="M2 88 V98 H12" stroke="currentColor" strokeWidth="0.4" />
      <path d="M88 98 H98 V88" stroke="currentColor" strokeWidth="0.4" />
    </svg>
  );
}

/* Large paper-style document with green "OCR" badge stamped over it. */
function OcrDocument() {
  return (
    <div className="relative h-[280px] w-[220px]">
      {/* Document body */}
      <div className="absolute inset-0 rounded-[10px] border border-amber-200/30 bg-gradient-to-b from-slate-50 to-slate-200 p-5 shadow-[0_30px_60px_rgba(245,196,107,0.35),0_0_40px_rgba(252,211,77,0.25)]">
        {/* Folded top-right corner */}
        <div className="absolute right-0 top-0 h-9 w-9 bg-[linear-gradient(225deg,#0a0a1e_50%,rgba(0,0,0,0)_50%)]" />
        <div className="absolute right-0 top-0 h-9 w-9 border-b-2 border-l-2 border-amber-200/40" />

        {/* Lines of text */}
        <div className="mt-1 space-y-2">
          <div className="h-2 w-[78%] rounded-full bg-slate-400/70" />
          <div className="h-1.5 w-full rounded-full bg-slate-400/50" />
          <div className="h-1.5 w-[88%] rounded-full bg-slate-400/50" />
          <div className="h-1.5 w-[92%] rounded-full bg-slate-400/50" />
          <div className="h-1.5 w-[70%] rounded-full bg-slate-400/50" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-400/40" />
          <div className="h-1.5 w-[80%] rounded-full bg-slate-400/40" />
          <div className="h-1.5 w-[90%] rounded-full bg-slate-400/40" />
          <div className="h-1.5 w-[65%] rounded-full bg-slate-400/40" />
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-400/30" />
          <div className="h-1.5 w-[85%] rounded-full bg-slate-400/30" />
        </div>
      </div>

      {/* Green OCR badge stamped over the document */}
      <div className="absolute left-[22%] top-[28%] flex h-16 w-24 -rotate-[6deg] items-center justify-center rounded-lg border-2 border-emerald-300 bg-emerald-500/25 px-3 py-2 shadow-[0_0_30px_rgba(52,211,153,0.7)] backdrop-blur">
        <span className="text-[22px] font-black tracking-wider text-emerald-100 drop-shadow-[0_0_12px_rgba(52,211,153,0.95)]">
          OCR
        </span>
      </div>

      {/* Scanning sweep line */}
      <div className="absolute inset-x-3 top-[60%] h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_18px_rgba(245,196,107,0.95)]" />
    </div>
  );
}

/* Shield with green check at the bottom — front-center, large. */
function ShieldBadge() {
  return (
    <div className="relative">
      <div
        className="relative flex h-[140px] w-[130px] items-end justify-center rounded-[14px] border border-emerald-300/40 bg-gradient-to-b from-emerald-500/35 via-teal-500/25 to-cyan-500/30 pb-3 backdrop-blur"
        style={{
          clipPath: "polygon(50% 0%, 100% 18%, 100% 70%, 50% 100%, 0% 70%, 0% 18%)",
          boxShadow: "0 0 60px rgba(52,211,153,0.65), inset 0 0 30px rgba(34,211,238,0.35)",
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-200 bg-emerald-500/40 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.95)]">
          <Check className="h-7 w-7" strokeWidth={3.5} />
        </div>
      </div>
      {/* Glow underside */}
      <div className="absolute inset-x-4 -bottom-2 h-3 rounded-full bg-emerald-400/60 blur-md" />
    </div>
  );
}

/* Metallic padlock — to the right. */
function Padlock() {
  return (
    <div className="relative h-[120px] w-[88px]">
      {/* Shackle */}
      <div className="absolute left-1/2 top-0 h-[52px] w-[56px] -translate-x-1/2 rounded-t-full border-[7px] border-slate-400 border-b-0 bg-transparent shadow-[inset_2px_0_4px_rgba(255,255,255,0.4),inset_-2px_0_4px_rgba(0,0,0,0.6)]" />
      {/* Body */}
      <div className="absolute bottom-0 left-1/2 h-[72px] w-[80px] -translate-x-1/2 rounded-[12px] border border-slate-500 bg-gradient-to-b from-slate-300 via-slate-400 to-slate-600 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.5)]">
        {/* Keyhole */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-3 w-3 rounded-full bg-slate-800" />
          <div className="mx-auto -mt-1 h-4 w-1.5 bg-slate-800" />
        </div>
      </div>
      {/* Glow */}
      <div className="absolute inset-x-2 -bottom-3 h-3 rounded-full bg-amber-300/40 blur-md" />
    </div>
  );
}

/* Small access-control scanner pad with a user silhouette. */
function ScannerPad() {
  return (
    <div className="relative h-[110px] w-[90px] rounded-[14px] border border-slate-500 bg-gradient-to-b from-slate-700 to-slate-900 p-2.5 shadow-[0_18px_36px_rgba(0,0,0,0.55)]">
      {/* Screen */}
      <div className="flex h-9 items-center justify-center rounded-[8px] border border-sky-400/40 bg-sky-500/15">
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-400/30 text-sky-100">
          <CheckCircle2 className="h-3.5 w-3.5" />
        </div>
      </div>
      {/* Keypad grid */}
      <div className="mt-2 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="h-3.5 rounded-sm bg-slate-600/70" key={i} />
        ))}
      </div>
    </div>
  );
}

