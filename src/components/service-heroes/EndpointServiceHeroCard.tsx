"use client";

import {
  Activity,
  Battery,
  CheckCircle2,
  Cpu,
  Laptop,
  Lock,
  RefreshCw,
  ShieldCheck,
  Signal,
  Smartphone,
  Wifi,
} from "lucide-react";
import { Float, Podium, ServiceHeroCardShell } from "./hero-card-shared";

export function EndpointServiceHeroCard() {
  return (
    <ServiceHeroCardShell
      accent="indigo"
      ctaLabel="Book a Discovery Call"
      description="Phones, tablets, laptops, and desktops — Summit builds a single management layer that enrols devices, pushes security policies, automates patches, deploys apps, locks or wipes lost units, and gives IT a live fleet dashboard."
      discoveryLine="Open the full service page and discovery path."
      features={[
        { icon: <Smartphone className="h-5 w-5" />, label: "MDM for iOS and Android" },
        { icon: <Laptop className="h-5 w-5" />, label: "Laptop & desktop management" },
        { icon: <RefreshCw className="h-5 w-5" />, label: "Patch automation & rollback" },
      ]}
      metrics={[
        { icon: <Cpu className="h-6 w-6" />, label: "Devices live", value: "248" },
        { icon: <ShieldCheck className="h-6 w-6" />, label: "Compliant", value: "96%" },
      ]}
      scene={<EndpointScene />}
      statusLabel="Open"
      title="Endpoint & Device Management Automation"
    />
  );
}

/* ---------------------------------------
   SCENE — laptop + phone + fleet dashboard tiles
--------------------------------------- */

function EndpointScene() {
  return (
    <>
      {/* Laptop (centerpiece, top) */}
      <Float amplitude={8} className="left-1/2 top-[4%] -translate-x-1/2 [transform:translateZ(60px)]" delay={0}>
        <LaptopDevice />
      </Float>

      {/* Paired phone — left of laptop */}
      <Float amplitude={10} className="left-[2%] top-[14%] [transform:translateZ(95px)_rotateY(-12deg)]" delay={1.2}>
        <PhoneDevice />
      </Float>

      {/* Sync pulse beam between phone and laptop */}
      <SyncBeam />

      {/* Fleet status card — bottom-left */}
      <Float amplitude={6} className="left-[2%] top-[44%] [transform:translateZ(85px)_rotateY(-6deg)]" delay={2.2}>
        <FleetStatusCard />
      </Float>

      {/* Patch cycle card — bottom-right */}
      <Float amplitude={7} className="right-[2%] top-[44%] [transform:translateZ(95px)_rotateY(6deg)]" delay={0.8}>
        <PatchCycleCard />
      </Float>

      {/* Shield badge — floating top-right */}
      <Float amplitude={5} className="right-[6%] top-[6%] [transform:translateZ(120px)]" delay={3.1}>
        <ShieldBadge />
      </Float>

      {/* Podium */}
      <Podium accent="indigo" />
    </>
  );
}

/* ============================================================
   LAPTOP (centerpiece) — open laptop showing a fleet dashboard
   ============================================================ */
function LaptopDevice() {
  return (
    <div className="relative h-[230px] w-[300px]">
      {/* Screen */}
      <div className="absolute inset-x-0 top-0 h-[180px] rounded-[12px] border border-indigo-400/30 bg-gradient-to-b from-[#1a1a3e] to-[#0a0a26] p-2.5 shadow-[0_20px_50px_rgba(129,140,248,0.35)]">
        {/* Screen bezel notch */}
        <div className="absolute left-1/2 top-1.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/40" />

        {/* Display content */}
        <div className="mt-3 h-full overflow-hidden rounded-md border border-white/10 bg-[#0c1024] p-3">
          {/* Top bar */}
          <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.18em] text-indigo-200">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
              FLEET CONSOLE
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Wifi className="h-2.5 w-2.5" />
              <Battery className="h-2.5 w-2.5" />
              <Signal className="h-2.5 w-2.5" />
            </span>
          </div>

          {/* Stat row */}
          <div className="mt-2.5 grid grid-cols-4 gap-1.5">
            {[
              { label: "Total", value: "248", color: "text-white" },
              { label: "Live", value: "236", color: "text-emerald-300" },
              { label: "Patch", value: "9", color: "text-amber-300" },
              { label: "Risk", value: "3", color: "text-rose-300" },
            ].map((stat) => (
              <div
                className="rounded border border-white/10 bg-white/[0.04] p-1.5 text-center"
                key={stat.label}
              >
                <div className={`text-sm font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-[6px] uppercase tracking-wider text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Device list rows */}
          <div className="mt-2 space-y-1">
            {[
              { name: "MBP-072", os: "macOS 14", state: "ok", val: "v14.4" },
              { name: "iPhone-194", os: "iOS 17", state: "ok", val: "v17.3" },
              { name: "Tablet-039", os: "iPadOS", state: "wipe", val: "WIPED" },
              { name: "Win-281", os: "Win 11", state: "patch", val: "Patching" },
            ].map((d) => (
              <div
                className="flex items-center justify-between rounded border border-white/5 bg-white/[0.02] px-1.5 py-1"
                key={d.name}
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      d.state === "ok"
                        ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
                        : d.state === "patch"
                          ? "bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]"
                          : "bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]"
                    }`}
                  />
                  <span className="text-[8px] font-semibold text-white">{d.name}</span>
                  <span className="text-[7px] text-slate-400">{d.os}</span>
                </div>
                <span
                  className={`text-[7px] font-bold ${
                    d.state === "ok"
                      ? "text-emerald-300"
                      : d.state === "patch"
                        ? "text-amber-300"
                        : "text-rose-300"
                  }`}
                >
                  {d.val}
                </span>
              </div>
            ))}
          </div>

          {/* Scan sweep */}
          <div className="absolute inset-x-3 top-[50%] h-px bg-gradient-to-r from-transparent via-indigo-300/70 to-transparent shadow-[0_0_12px_rgba(129,140,248,0.85)]" />
        </div>
      </div>

      {/* Laptop base */}
      <div className="absolute -bottom-1 left-1/2 h-[10px] w-[330px] -translate-x-1/2 rounded-b-[18px] bg-gradient-to-b from-[#2a2a4e] to-[#161628] shadow-[0_18px_40px_rgba(0,0,0,0.55)]" />
      {/* Track point */}
      <div className="absolute left-1/2 top-[176px] h-1.5 w-14 -translate-x-1/2 rounded-full bg-black/35" />
    </div>
  );
}

/* ============================================================
   PHONE (paired device) — vertical phone with security icons
   ============================================================ */
function PhoneDevice() {
  return (
    <div className="relative h-[200px] w-[110px] rounded-[20px] border border-indigo-400/35 bg-[#08081e] p-2 shadow-[0_18px_45px_rgba(129,140,248,0.4)]">
      {/* Notch */}
      <div className="absolute left-1/2 top-2.5 h-3.5 w-14 -translate-x-1/2 rounded-b-xl bg-black/70" />

      <div className="relative mt-1 h-full overflow-hidden rounded-[14px] border border-white/10 bg-[#0c0c28]">
        {/* Status bar */}
        <div className="flex items-center justify-between px-2.5 pt-2 text-[7px] text-white">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <Signal className="h-2 w-2" />
            <Wifi className="h-2 w-2" />
            <Battery className="h-2 w-2" />
          </span>
        </div>

        {/* MDM Profile badge */}
        <div className="mx-2 mt-3 rounded-md border border-emerald-400/40 bg-emerald-500/15 px-1.5 py-1">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-2.5 w-2.5 text-emerald-300" />
            <span className="text-[7px] font-bold text-emerald-200">MDM ENROLLED</span>
          </div>
          <div className="mt-0.5 text-[6px] text-slate-400">Summit IT Policy v3.2</div>
        </div>

        {/* App grid (managed apps) */}
        <div className="mx-2 mt-2 grid grid-cols-3 gap-1.5">
          {[
            { c: "from-emerald-500 to-teal-500", l: "M" },
            { c: "from-blue-500 to-indigo-500", l: "S" },
            { c: "from-purple-500 to-violet-500", l: "T" },
            { c: "from-amber-500 to-orange-500", l: "C" },
            { c: "from-rose-500 to-pink-500", l: "F" },
            { c: "from-cyan-500 to-sky-500", l: "Z" },
          ].map((app, i) => (
            <div
              className={`flex aspect-square items-center justify-center rounded-md bg-gradient-to-br ${app.c} text-[8px] font-black text-white`}
              key={i}
            >
              {app.l}
            </div>
          ))}
        </div>

        {/* Encryption pill */}
        <div className="mx-2 mt-2 flex items-center justify-between rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-1">
          <div className="flex items-center gap-1">
            <Lock className="h-2.5 w-2.5 text-indigo-300" />
            <span className="text-[7px] text-slate-200">Encrypted</span>
          </div>
          <span className="text-[6px] font-bold text-emerald-300">ON</span>
        </div>

        {/* Last check-in */}
        <div className="absolute bottom-2 left-2 right-2 text-center text-[6px] text-slate-500">
          Last check-in · 2m ago
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SYNC BEAM — animated dotted line between phone and laptop
   ============================================================ */
function SyncBeam() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 1000 640"
    >
      <defs>
        <linearGradient id="ep-sync" x1="0" x2="1">
          <stop stopColor="#818cf8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#818cf8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M 200 200 Q 350 130 500 130"
        stroke="url(#ep-sync)"
        strokeDasharray="6 6"
        strokeLinecap="round"
        strokeWidth="2"
      >
        <animate
          attributeName="stroke-dashoffset"
          dur="1.4s"
          from="0"
          repeatCount="indefinite"
          to="-24"
        />
      </path>
    </svg>
  );
}

/* ============================================================
   FLEET STATUS CARD — donut chart + key stats
   ============================================================ */
function FleetStatusCard() {
  return (
    <div className="w-[210px] rounded-2xl border border-indigo-400/30 bg-[#0a0a26]/95 p-4 shadow-[0_20px_50px_rgba(129,140,248,0.35)] backdrop-blur-xl">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
        Fleet Compliance
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="relative h-16 w-16">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="none" r="15" stroke="rgba(129,140,248,0.15)" strokeWidth="3.5" />
            <circle
              cx="18"
              cy="18"
              fill="none"
              r="15"
              stroke="#a78bfa"
              strokeDasharray="90 100"
              strokeDashoffset="0"
              strokeLinecap="round"
              strokeWidth="3.5"
              style={{ filter: "drop-shadow(0 0 6px rgba(167,139,250,0.85))" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-xl font-bold text-white">96%</span>
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Compliant</span>
            <span className="font-bold text-emerald-300">238</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">Patching</span>
            <span className="font-bold text-amber-300">9</span>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-400">At risk</span>
            <span className="font-bold text-rose-300">1</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px]">
        <span className="flex items-center gap-1 text-slate-300">
          <Activity className="h-3 w-3 text-emerald-300" />
          Live · auto-remediate
        </span>
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" />
      </div>
    </div>
  );
}

/* ============================================================
   PATCH CYCLE CARD — staged rollout visualisation
   ============================================================ */
function PatchCycleCard() {
  const stages = [
    { name: "Pilot", count: "12", complete: true, tone: "from-emerald-500/30 to-emerald-500/5 border-emerald-400/40" },
    { name: "Broad", count: "94", complete: true, tone: "from-indigo-500/30 to-indigo-500/5 border-indigo-400/40" },
    { name: "All", count: "186", complete: false, tone: "from-amber-500/30 to-amber-500/5 border-amber-400/40" },
    { name: "Verify", count: "—", complete: false, tone: "from-slate-500/15 to-slate-500/5 border-slate-500/30" },
  ];
  return (
    <div className="w-[210px] rounded-2xl border border-indigo-400/30 bg-[#0a0a26]/95 p-4 shadow-[0_20px_50px_rgba(129,140,248,0.32)] backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
          Patch Cycle
        </div>
        <RefreshCw className="h-3.5 w-3.5 text-indigo-300" />
      </div>

      <div className="mt-3 space-y-1.5">
        {stages.map((stage) => (
          <div
            className={`flex items-center justify-between rounded-lg border bg-gradient-to-r ${stage.tone} px-2.5 py-1.5`}
            key={stage.name}
          >
            <div className="flex items-center gap-1.5">
              {stage.complete ? (
                <CheckCircle2 className="h-3 w-3 text-emerald-300" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.85)]" />
              )}
              <span className="text-xs text-white">{stage.name}</span>
            </div>
            <span className="text-xs font-bold text-white">{stage.count}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[10px] text-slate-300">
        <span>macOS 14.4 security</span>
        <span className="text-emerald-300">0 rollbacks</span>
      </div>
    </div>
  );
}

/* ============================================================
   SHIELD BADGE — floating verification badge
   ============================================================ */
function ShieldBadge() {
  return (
    <div className="relative">
      <div
        className="relative flex h-[120px] w-[110px] items-center justify-center rounded-[14px] border border-emerald-300/50 bg-gradient-to-b from-emerald-500/30 via-indigo-500/20 to-indigo-500/30 backdrop-blur"
        style={{
          clipPath: "polygon(50% 0%, 100% 18%, 100% 70%, 50% 100%, 0% 70%, 0% 18%)",
          boxShadow:
            "0 0 50px rgba(52,211,153,0.55), inset 0 0 25px rgba(129,140,248,0.35)",
        }}
      >
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="h-10 w-10 text-emerald-200 drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          <span className="text-[8px] font-black uppercase tracking-[0.18em] text-emerald-100">
            VERIFIED
          </span>
        </div>
      </div>
      {/* Glow underside */}
      <div className="absolute inset-x-3 -bottom-2 h-3 rounded-full bg-emerald-400/55 blur-md" />
    </div>
  );
}
