"use client";

import {
  ArrowUpRight,
  Filter,
  Mail,
  Send,
  Target,
  TrendingUp,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { Float, Podium, ServiceHeroCardShell } from "./hero-card-shared";

export function CrmMarketingServiceHeroCard() {
  return (
    <ServiceHeroCardShell
      accent="cyan"
      ctaLabel="Book a Discovery Call"
      description="Summit builds CRM, lead management, and AI marketing systems that capture every lead, score and segment them, run cross-channel campaigns, and push the hottest deals to your sales team — with live reporting end-to-end."
      discoveryLine="Open the full service page and discovery path."
      features={[
        { icon: <Filter className="h-5 w-5" />, label: "Lead capture and routing" },
        { icon: <Send className="h-5 w-5" />, label: "Multi-channel campaigns" },
        { icon: <TrendingUp className="h-5 w-5" />, label: "Pipeline and campaign reports" },
      ]}
      metrics={[
        { icon: <Users className="h-6 w-6" />, label: "Leads", value: "Captured" },
        { icon: <Target className="h-6 w-6" />, label: "Pipeline", value: "Live" },
      ]}
      scene={<CrmScene />}
      statusLabel="Open"
      title="CRM, Lead Management & AI Marketing Automation"
    />
  );
}

/* ---------------------------------------
   SCENE — 3D funnel centerpiece, pipeline, growth chart, contact card.
--------------------------------------- */

function CrmScene() {
  return (
    <>
      {/* Funnel — centerpiece, dropping lead-dots */}
      <Float amplitude={10} className="left-1/2 top-[4%] -translate-x-1/2 [transform:translateZ(60px)]" delay={0}>
        <LeadFunnel />
      </Float>

      {/* Contact card — top-left, behind funnel */}
      <Float amplitude={6} className="left-[2%] top-[6%] [transform:translateZ(30px)_rotateY(-8deg)]" delay={1.4}>
        <ContactCard />
      </Float>

      {/* Pipeline kanban — right, mid */}
      <Float amplitude={8} className="right-[2%] top-[38%] [transform:translateZ(95px)_rotateY(6deg)]" delay={0.8}>
        <PipelineMini />
      </Float>

      {/* Growth chart — bottom-left */}
      <Float amplitude={7} className="left-[2%] top-[44%] [transform:translateZ(85px)_rotateY(-6deg)]" delay={2.2}>
        <GrowthChart />
      </Float>

      {/* Email packet — small floating bubble top-right */}
      <Float amplitude={5} className="right-[6%] top-[6%] [transform:translateZ(120px)]" delay={3.1}>
        <EmailPing />
      </Float>

      {/* Podium */}
      <Podium accent="cyan" />
    </>
  );
}

/* 3D-style funnel — trapezoid stages with lead-dots dropping in. */
function LeadFunnel() {
  const stages = [
    { label: "Leads", value: "8.4k", width: 220, gradient: "from-cyan-400/35 via-cyan-400/20 to-cyan-400/5" },
    { label: "Qualified", value: "2.1k", width: 180, gradient: "from-sky-400/40 via-sky-400/20 to-sky-400/5" },
    { label: "Proposal", value: "640", width: 140, gradient: "from-teal-400/45 via-teal-400/25 to-teal-400/5" },
    { label: "Won", value: "180", width: 100, gradient: "from-emerald-400/55 via-emerald-400/30 to-emerald-400/10" },
  ];
  return (
    <div className="relative flex w-[260px] flex-col items-center">
      {/* Dropping dots */}
      <div className="relative mb-1 flex h-8 w-full items-end justify-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.95)]"
            key={i}
            style={{ opacity: 0.4 + i * 0.12 }}
          />
        ))}
      </div>

      {/* Funnel layers */}
      <div className="flex flex-col items-center gap-1.5">
        {stages.map((s) => (
          <div
            className={`flex items-center justify-between rounded-md border border-cyan-300/30 bg-gradient-to-b ${s.gradient} px-3 py-2 text-[11px] text-white shadow-[0_8px_20px_rgba(34,211,238,0.18)] backdrop-blur`}
            key={s.label}
            style={{ width: `${s.width}px` }}
          >
            <span className="font-semibold text-slate-100">{s.label}</span>
            <span className="font-bold text-cyan-100 drop-shadow-[0_0_6px_rgba(34,211,238,0.85)]">
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* Win-rate plinth */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/15 px-3 py-1.5 shadow-[0_0_22px_rgba(52,211,153,0.45)] backdrop-blur">
        <Target className="h-3.5 w-3.5 text-emerald-300" />
        <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-200">Win rate</span>
        <span className="text-sm font-black text-white drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]">
          2.1%
        </span>
      </div>
    </div>
  );
}

/* Pipeline mini — 4 stacked deal cards. */
function PipelineMini() {
  const deals = [
    { stage: "Prospect", count: 24, tone: "border-cyan-400/30 bg-cyan-500/15" },
    { stage: "Qualified", count: 12, tone: "border-sky-400/30 bg-sky-500/15" },
    { stage: "Proposal", count: 5, tone: "border-blue-400/30 bg-blue-500/15" },
    { stage: "Won", count: 3, tone: "border-emerald-400/30 bg-emerald-500/15" },
  ];
  return (
    <div className="w-[180px] rounded-2xl border border-cyan-400/30 bg-[#071527]/95 p-3.5 shadow-[0_20px_50px_rgba(34,211,238,0.35),0_0_30px_rgba(34,211,238,0.2)] backdrop-blur-xl">
      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">
        <span>Pipeline</span>
        <ArrowUpRight className="h-3 w-3 text-cyan-300" />
      </div>
      <div className="mt-3 space-y-1.5">
        {deals.map((d) => (
          <div
            className={`flex items-center justify-between rounded-lg border px-2.5 py-2 ${d.tone}`}
            key={d.stage}
          >
            <span className="text-xs text-white">{d.stage}</span>
            <span className="text-xs font-bold text-cyan-100">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Growth chart — line graph rising, with +38% label. */
function GrowthChart() {
  return (
    <div className="w-[200px] rounded-2xl border border-cyan-400/30 bg-[#071527]/95 p-3.5 shadow-[0_20px_50px_rgba(34,211,238,0.32),0_0_30px_rgba(34,211,238,0.18)] backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300">Win rate</div>
          <div className="mt-1 text-xl font-black text-white drop-shadow-[0_0_10px_rgba(34,211,238,0.55)]">
            +38%
          </div>
        </div>
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/35 bg-emerald-500/20 text-emerald-300">
          <TrendingUp className="h-4 w-4" />
        </div>
      </div>
      <svg className="mt-3 h-[58px] w-full" fill="none" viewBox="0 0 180 60">
        <defs>
          <linearGradient id="crm-line" x1="0" x2="1">
            <stop stopColor="#22d3ee" />
            <stop offset="1" stopColor="#5eead4" />
          </linearGradient>
          <linearGradient id="crm-fill" x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="rgba(34,211,238,0.5)" />
            <stop offset="1" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
        </defs>
        <path
          d="M0 50 L25 42 L55 46 L85 34 L115 28 L145 18 L180 10 L180 60 L0 60 Z"
          fill="url(#crm-fill)"
        />
        <path
          d="M0 50 L25 42 L55 46 L85 34 L115 28 L145 18 L180 10"
          stroke="url(#crm-line)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
        />
        {[
          [25, 42],
          [85, 34],
          [145, 18],
          [180, 10],
        ].map(([x, y]) => (
          <circle cx={x} cy={y} fill="#5eead4" key={`${x}-${y}`} r="2.5" style={{ filter: "drop-shadow(0 0 4px rgba(94,234,212,0.95))" }} />
        ))}
      </svg>
    </div>
  );
}

/* Contact card — left, behind funnel. Shows lead profile. */
function ContactCard() {
  return (
    <div className="w-[180px] rounded-2xl border border-cyan-400/25 bg-[#071527]/95 p-3.5 shadow-[0_20px_50px_rgba(34,211,238,0.28)] backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 text-white">
          <UserRound className="h-4.5 w-4.5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">Rohan Khanna</div>
          <div className="text-[10px] text-slate-400">Hot lead · Score 92</div>
        </div>
      </div>
      <div className="mt-2.5 flex items-center justify-between rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1.5">
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-200">
          <Zap className="h-3 w-3" />
          Auto-routed
        </span>
        <span className="text-[10px] font-bold text-emerald-100">Sales</span>
      </div>
    </div>
  );
}

/* Email ping — small notification bubble. */
function EmailPing() {
  return (
    <div className="relative">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/40 bg-gradient-to-br from-cyan-500/30 to-teal-500/30 text-cyan-100 shadow-[0_0_25px_rgba(34,211,238,0.65)] backdrop-blur">
        <Mail className="h-7 w-7" />
      </div>
      <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-400 px-1 text-[10px] font-black text-slate-950 shadow-[0_0_10px_rgba(52,211,153,0.95)]">
        12
      </span>
    </div>
  );
}

