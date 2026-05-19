"use client";

import {
  BadgeCheck,
  ClipboardList,
  MapPin,
  Moon,
  Sun,
  Sunrise,
  UserCheck,
  Users,
} from "lucide-react";
import { Float, Podium, ServiceHeroCardShell } from "./hero-card-shared";

export function WorkforceServiceHeroCard() {
  return (
    <ServiceHeroCardShell
      accent="sky"
      ctaLabel="Book a Discovery Call"
      description="Summit builds workforce and operations tracking systems for attendance, GPS verification, shift management, productivity monitoring, daily reporting, and operational dashboards."
      discoveryLine="Open the full service page and discovery path."
      features={[
        { icon: <UserCheck className="h-5 w-5" />, label: "Attendance and shift tracking" },
        { icon: <MapPin className="h-5 w-5" />, label: "GPS and location checks" },
        { icon: <ClipboardList className="h-5 w-5" />, label: "Daily operations reports" },
      ]}
      metrics={[
        { icon: <BadgeCheck className="h-6 w-6" />, label: "Attendance", value: "Verified" },
        { icon: <ClipboardList className="h-6 w-6" />, label: "Reports", value: "Daily" },
      ]}
      scene={<WorkforceScene />}
      statusLabel="Open"
      title="Workforce, Attendance & Operations Tracking Automation"
    />
  );
}

/* ---------------------------------------
   SCENE — three dashboard tiles + GPS pin on a podium.
--------------------------------------- */

function WorkforceScene() {
  return (
    <>
      {/* Attendance Dashboard — top-left */}
      <Float amplitude={8} className="left-[4%] top-[4%] [transform:translateZ(80px)_rotateY(-4deg)]" delay={0}>
        <AttendanceDashboard />
      </Float>

      {/* GPS pin + mini map — top-right */}
      <Float amplitude={10} className="right-[4%] top-[2%] [transform:translateZ(110px)_rotateY(6deg)]" delay={1.2}>
        <GpsPin />
      </Float>

      {/* Shift Management — center, slightly forward */}
      <Float amplitude={6} className="left-[6%] top-[40%] [transform:translateZ(95px)]" delay={2.4}>
        <ShiftManagement />
      </Float>

      {/* Daily Report — right, mid */}
      <Float amplitude={7} className="right-[3%] top-[42%] [transform:translateZ(85px)_rotateY(6deg)]" delay={3.2}>
        <DailyReport />
      </Float>

      {/* Podium */}
      <Podium accent="sky" />
    </>
  );
}

function AttendanceDashboard() {
  return (
    <div className="h-[150px] w-[260px] rounded-2xl border border-sky-400/30 bg-[#0a1530]/95 p-4 shadow-[0_20px_50px_rgba(96,165,250,0.35),0_0_30px_rgba(96,165,250,0.25)] backdrop-blur-xl">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
        Attendance Dashboard
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" fill="none" r="15" stroke="rgba(52,211,153,0.15)" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              fill="none"
              r="15"
              stroke="#34d399"
              strokeDasharray="94 100"
              strokeDashoffset="0"
              strokeLinecap="round"
              strokeWidth="3"
              style={{ filter: "drop-shadow(0 0 8px rgba(52,211,153,0.85))" }}
            />
          </svg>
          <UserCheck className="h-7 w-7 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
        </div>
        <div className="flex-1">
          <div className="text-2xl font-bold text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]">
            Verified
          </div>
          <div className="mt-0.5 text-xs text-slate-400">All records verified</div>
        </div>
      </div>
      {/* Bottom progress strip */}
      <div className="mt-3 h-1 rounded-full bg-white/10">
        <div className="h-1 w-[94%] rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
      </div>
    </div>
  );
}

function ShiftManagement() {
  const shifts = [
    { icon: <Sun className="h-4 w-4 text-amber-300" />, name: "Morning Shift", time: "06:00 AM – 02:00 PM", count: 128 },
    { icon: <Sunrise className="h-4 w-4 text-orange-300" />, name: "Evening Shift", time: "02:00 PM – 10:00 PM", count: 96 },
    { icon: <Moon className="h-4 w-4 text-indigo-300" />, name: "Night Shift", time: "10:00 PM – 06:00 AM", count: 72 },
  ];
  return (
    <div className="w-[290px] rounded-2xl border border-sky-400/25 bg-[#0a1530]/95 p-4 shadow-[0_20px_50px_rgba(96,165,250,0.35),0_0_30px_rgba(96,165,250,0.18)] backdrop-blur-xl">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
        Shift Management
      </div>
      <div className="mt-3 space-y-2.5">
        {shifts.map((shift) => (
          <div className="flex items-center gap-3" key={shift.name}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
              {shift.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-white">{shift.name}</div>
              <div className="text-[10px] text-slate-400">{shift.time}</div>
            </div>
            <div className="flex items-center gap-1 text-sm font-bold text-sky-200">
              <Users className="h-3.5 w-3.5 text-sky-300" />
              {shift.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DailyReport() {
  const bars = [40, 55, 48, 68, 62, 78, 88];
  return (
    <div className="w-[210px] rounded-2xl border border-sky-400/25 bg-[#0a1530]/95 p-4 shadow-[0_20px_50px_rgba(96,165,250,0.35),0_0_30px_rgba(96,165,250,0.18)] backdrop-blur-xl">
      <div className="flex items-start justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
          Daily Report
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-emerald-300 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]">
            +12.5%
          </div>
          <div className="text-[9px] text-slate-400">vs yesterday</div>
        </div>
      </div>
      <div className="mt-4 flex h-[68px] items-end justify-between gap-1">
        {bars.map((h, i) => (
          <div
            className="flex-1 rounded-t-sm bg-gradient-to-t from-sky-500 to-indigo-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
            key={i}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function GpsPin() {
  return (
    <div className="relative h-[170px] w-[150px]">
      {/* Mini map (behind) */}
      <div className="absolute bottom-0 right-0 h-[100px] w-[140px] overflow-hidden rounded-[14px] border border-sky-400/40 bg-[radial-gradient(circle_at_30%_40%,rgba(96,165,250,0.25),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(129,140,248,0.22),transparent_55%),linear-gradient(180deg,#091b3a,#0b1228)] shadow-[0_15px_30px_rgba(96,165,250,0.35)]">
        {/* Grid */}
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(96,165,250,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.3)_1px,transparent_1px)] [background-size:18px_18px]" />
        {/* Roads */}
        <svg className="absolute inset-0 h-full w-full" fill="none" viewBox="0 0 140 100">
          <path d="M0 60 C30 40 60 75 90 55 S130 30 140 50" stroke="rgba(148,163,184,0.4)" strokeWidth="1.5" />
          <path d="M20 0 C30 30 60 50 50 100" stroke="rgba(148,163,184,0.35)" strokeWidth="1.2" />
          <path d="M10 80 L40 65 L70 75 L110 60 L135 70" stroke="#60a5fa" strokeDasharray="3 3" strokeWidth="2" />
        </svg>
        {/* Endpoint dots */}
        <div className="absolute left-[6%] top-[78%] h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(96,165,250,0.95)]" />
        <div className="absolute right-[5%] top-[65%] h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_10px_rgba(96,165,250,0.95)]" />
      </div>

      {/* Big pin (in front) */}
      <div className="absolute left-[12%] top-0">
        <div
          className="relative flex h-[110px] w-[80px] items-start justify-center pt-3 text-sky-100"
          style={{
            background: "linear-gradient(180deg, #60a5fa 0%, #4f46e5 100%)",
            clipPath: "path('M40 0 C18 0 0 18 0 40 C0 70 40 110 40 110 C40 110 80 70 80 40 C80 18 62 0 40 0 Z')",
            boxShadow: "0 0 40px rgba(96,165,250,0.7)",
          }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)]">
            <MapPin className="h-4.5 w-4.5 text-sky-600" />
          </div>
        </div>
        {/* Pulse beneath the pin */}
        <div className="ml-[15%] mt-[-6px] h-2 w-14 rounded-full bg-sky-400/70 blur-md" />
      </div>
    </div>
  );
}

