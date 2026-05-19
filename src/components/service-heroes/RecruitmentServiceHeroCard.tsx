"use client";

import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  FileText,
  Handshake,
  Search,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Float, Podium, ServiceHeroCardShell } from "./hero-card-shared";

export function RecruitmentServiceHeroCard() {
  return (
    <ServiceHeroCardShell
      accent="violet"
      ctaLabel="Book a Discovery Call"
      description="Summit builds recruitment automation systems that screen CVs, organize candidates, verify documents, schedule follow-up steps, and simplify hiring workflows for busy teams."
      discoveryLine="Open the full service page and discovery path."
      features={[
        { icon: <Search className="h-5 w-5" />, label: "CV screening support" },
        { icon: <Users className="h-5 w-5" />, label: "Candidate tracking" },
        { icon: <CalendarCheck className="h-5 w-5" />, label: "Interview workflow automation" },
      ]}
      metrics={[
        { icon: <FileText className="h-6 w-6" />, label: "CV intake", value: "Auto" },
        { icon: <BarChart3 className="h-6 w-6" />, label: "Hiring stages", value: "Tracked" },
      ]}
      scene={<RecruitmentScene />}
      statusLabel="Open"
      title="Recruitment & HR Automation Services"
    />
  );
}

/* ---------------------------------------
   SCENE — CV folder (top) feeding a horizontal hiring pipeline.
--------------------------------------- */

function RecruitmentScene() {
  return (
    <>
      {/* CV folder — main hero element, top */}
      <Float amplitude={10} className="left-1/2 top-[4%] -translate-x-1/2 [transform:translateZ(60px)]" delay={0}>
        <CvFolder />
      </Float>

      {/* Verified check badge floating off the CV's top-right */}
      <Float
        amplitude={6}
        className="left-[68%] top-[8%] [transform:translateZ(110px)]"
        delay={1.2}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-400/40 bg-emerald-500/20 text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.55)] backdrop-blur">
          <CheckCircle2 className="h-7 w-7" />
        </div>
      </Float>

      {/* Horizontal hiring pipeline — sits in front of/below the CV folder */}
      <div className="absolute left-1/2 top-[42%] w-[88%] -translate-x-1/2 [transform:translateZ(40px)]">
        <HiringPipeline />
      </div>

      {/* Podium under everything */}
      <Podium accent="violet" />
    </>
  );
}

function CvFolder() {
  return (
    <div className="relative h-[230px] w-[290px]">
      {/* Back card (folder back) */}
      <div className="absolute inset-x-2 top-3 h-full rounded-[20px] border border-purple-400/25 bg-gradient-to-b from-[#1c1840] to-[#0b0a22] shadow-[0_30px_60px_rgba(124,82,255,0.35)]" />

      {/* Avatar slot (left) */}
      <div className="absolute left-4 top-6 flex h-[160px] w-[110px] flex-col items-center justify-center gap-2 rounded-[18px] border border-purple-400/30 bg-gradient-to-b from-purple-500/20 to-purple-500/5">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-purple-300/40 bg-purple-500/30 text-purple-100">
          <UserCheck className="h-7 w-7" />
        </div>
        <div className="h-1.5 w-14 rounded-full bg-purple-300/40" />
        <div className="h-1 w-10 rounded-full bg-purple-300/25" />
      </div>

      {/* CV sheet (right) */}
      <div className="absolute right-3 top-3 flex h-[185px] w-[150px] flex-col gap-1.5 rounded-[14px] border border-white/20 bg-gradient-to-b from-slate-100 to-slate-300 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.6)]">
        <div className="text-[18px] font-black tracking-tight text-slate-800">CV</div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-500/70" />
        <div className="h-1 w-[85%] rounded-full bg-slate-400/70" />
        <div className="h-1 w-[70%] rounded-full bg-slate-400/70" />
        <div className="mt-1 h-1 w-full rounded-full bg-slate-400/60" />
        <div className="h-1 w-[80%] rounded-full bg-slate-400/60" />
        <div className="h-1 w-[60%] rounded-full bg-slate-400/60" />
        <div className="mt-1 h-1 w-full rounded-full bg-slate-400/50" />
        <div className="h-1 w-[75%] rounded-full bg-slate-400/50" />
      </div>
    </div>
  );
}

function HiringPipeline() {
  const stages = [
    { label: "Screening", icon: <Search className="h-5 w-5" />, tone: "violet" as const },
    { label: "Interview", icon: <Users className="h-5 w-5" />, tone: "blue" as const },
    { label: "Offer", icon: <Handshake className="h-5 w-5" />, tone: "cyan" as const },
    { label: "Hired", icon: <UserPlus className="h-5 w-5" />, tone: "emerald" as const },
  ];
  return (
    <div className="flex items-center justify-between gap-1">
      {stages.map((stage, i) => (
        <div className="flex flex-1 items-center" key={stage.label}>
          <PipelineStage active={i === stages.length - 1} icon={stage.icon} label={stage.label} tone={stage.tone} />
          {i < stages.length - 1 ? (
            <ArrowRight className="mx-0.5 h-4 w-4 shrink-0 text-purple-300/70" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function PipelineStage({
  icon,
  label,
  tone,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "violet" | "blue" | "cyan" | "emerald";
  active?: boolean;
}) {
  const t =
    tone === "violet"
      ? "from-purple-500/30 to-purple-500/5 border-purple-400/40 text-purple-200"
      : tone === "blue"
        ? "from-blue-500/30 to-blue-500/5 border-blue-400/40 text-blue-200"
        : tone === "cyan"
          ? "from-cyan-500/30 to-cyan-500/5 border-cyan-400/40 text-cyan-200"
          : "from-emerald-500/30 to-emerald-500/5 border-emerald-400/40 text-emerald-200";
  return (
    <div
      className={`relative flex flex-1 flex-col items-center gap-2 rounded-2xl border bg-gradient-to-b ${t} px-2 py-3 backdrop-blur-xl shadow-[0_12px_28px_rgba(0,0,0,0.4)] ${active ? "shadow-[0_0_28px_rgba(52,211,153,0.55)]" : ""}`}
    >
      {active ? (
        <CheckCircle2 className="absolute -right-1 -top-1 h-5 w-5 text-emerald-300" />
      ) : null}
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.08]">
        {icon}
      </div>
      <div className="text-xs font-bold text-white">{label}</div>
    </div>
  );
}
