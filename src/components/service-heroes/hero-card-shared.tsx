"use client";

import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/* =============================================================
   Accent system — each service has its own color theme.
   Tailwind 4 can't compile dynamic classes, so we statically map
   accent → utility class strings.
   ============================================================= */

export type Accent = "teal" | "violet" | "cyan" | "gold" | "sky" | "indigo" | "rose";

type AccentTheme = {
  articleBorder: string;
  articleGlow: string;
  bgRadials: string;
  pillBorder: string;
  pillBg: string;
  pillText: string;
  pillDot: string;
  pillGlow: string;
  metricA: string;
  metricB: string;
  featureIcon: string;
  ctaGradient: string;
  ctaShadow: string;
  ctaShadowHover: string;
  starBorder: string;
  starBg: string;
  starText: string;
};

const ACCENT_MAP: Record<Accent, AccentTheme> = {
  teal: {
    articleBorder: "border-cyan-400/25",
    articleGlow: "shadow-[0_0_80px_rgba(37,99,235,0.22)]",
    bgRadials:
      "bg-[radial-gradient(circle_at_30%_75%,rgba(34,197,94,0.16),transparent_28%),radial-gradient(circle_at_70%_25%,rgba(59,130,246,0.20),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(139,92,246,0.16),transparent_28%)]",
    pillBorder: "border-emerald-400/35",
    pillBg: "bg-emerald-400/10",
    pillText: "text-emerald-300",
    pillDot: "bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.95)]",
    pillGlow: "shadow-[0_0_24px_rgba(52,211,153,0.18)]",
    metricA: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300",
    metricB: "border-blue-400/25 bg-blue-400/[0.08] text-blue-300",
    featureIcon: "border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-300",
    ctaGradient: "from-blue-600 via-sky-500 to-cyan-400",
    ctaShadow: "shadow-[0_0_35px_rgba(56,189,248,0.38)]",
    ctaShadowHover: "hover:shadow-[0_0_55px_rgba(56,189,248,0.58)]",
    starBorder: "border-blue-400/25",
    starBg: "bg-blue-400/10",
    starText: "text-blue-300",
  },
  violet: {
    articleBorder: "border-purple-400/25",
    articleGlow: "shadow-[0_0_80px_rgba(124,82,255,0.22)]",
    bgRadials:
      "bg-[radial-gradient(circle_at_30%_75%,rgba(168,85,247,0.18),transparent_28%),radial-gradient(circle_at_70%_25%,rgba(124,82,255,0.20),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(59,130,246,0.14),transparent_28%)]",
    pillBorder: "border-purple-400/35",
    pillBg: "bg-purple-400/10",
    pillText: "text-purple-200",
    pillDot: "bg-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.95)]",
    pillGlow: "shadow-[0_0_24px_rgba(168,85,247,0.18)]",
    metricA: "border-purple-400/25 bg-purple-400/[0.08] text-purple-200",
    metricB: "border-fuchsia-400/25 bg-fuchsia-400/[0.08] text-fuchsia-200",
    featureIcon: "border-purple-300/20 bg-purple-400/[0.07] text-purple-200",
    ctaGradient: "from-purple-600 via-violet-500 to-fuchsia-400",
    ctaShadow: "shadow-[0_0_35px_rgba(168,85,247,0.38)]",
    ctaShadowHover: "hover:shadow-[0_0_55px_rgba(168,85,247,0.58)]",
    starBorder: "border-purple-400/25",
    starBg: "bg-purple-400/10",
    starText: "text-purple-200",
  },
  cyan: {
    articleBorder: "border-cyan-400/30",
    articleGlow: "shadow-[0_0_80px_rgba(34,211,238,0.22)]",
    bgRadials:
      "bg-[radial-gradient(circle_at_30%_75%,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_70%_25%,rgba(56,189,248,0.22),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(139,92,246,0.16),transparent_28%)]",
    pillBorder: "border-cyan-400/35",
    pillBg: "bg-cyan-400/10",
    pillText: "text-cyan-200",
    pillDot: "bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.95)]",
    pillGlow: "shadow-[0_0_24px_rgba(34,211,238,0.18)]",
    metricA: "border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-200",
    metricB: "border-sky-400/25 bg-sky-400/[0.08] text-sky-200",
    featureIcon: "border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-200",
    ctaGradient: "from-sky-600 via-cyan-500 to-teal-400",
    ctaShadow: "shadow-[0_0_35px_rgba(34,211,238,0.38)]",
    ctaShadowHover: "hover:shadow-[0_0_55px_rgba(34,211,238,0.58)]",
    starBorder: "border-cyan-400/25",
    starBg: "bg-cyan-400/10",
    starText: "text-cyan-200",
  },
  gold: {
    articleBorder: "border-amber-400/30",
    articleGlow: "shadow-[0_0_80px_rgba(245,196,107,0.22)]",
    bgRadials:
      "bg-[radial-gradient(circle_at_30%_75%,rgba(245,196,107,0.16),transparent_28%),radial-gradient(circle_at_70%_25%,rgba(252,211,77,0.18),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(59,130,246,0.14),transparent_28%)]",
    pillBorder: "border-amber-400/35",
    pillBg: "bg-amber-400/10",
    pillText: "text-amber-200",
    pillDot: "bg-amber-300 shadow-[0_0_14px_rgba(245,196,107,0.95)]",
    pillGlow: "shadow-[0_0_24px_rgba(245,196,107,0.18)]",
    metricA: "border-amber-400/25 bg-amber-400/[0.08] text-amber-200",
    metricB: "border-yellow-400/25 bg-yellow-400/[0.08] text-yellow-200",
    featureIcon: "border-amber-300/20 bg-amber-400/[0.07] text-amber-200",
    ctaGradient: "from-amber-500 via-yellow-400 to-orange-400",
    ctaShadow: "shadow-[0_0_35px_rgba(245,196,107,0.38)]",
    ctaShadowHover: "hover:shadow-[0_0_55px_rgba(245,196,107,0.58)]",
    starBorder: "border-amber-400/25",
    starBg: "bg-amber-400/10",
    starText: "text-amber-200",
  },
  sky: {
    articleBorder: "border-sky-400/25",
    articleGlow: "shadow-[0_0_80px_rgba(96,165,250,0.22)]",
    bgRadials:
      "bg-[radial-gradient(circle_at_30%_75%,rgba(96,165,250,0.16),transparent_28%),radial-gradient(circle_at_70%_25%,rgba(129,140,248,0.20),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(34,211,238,0.14),transparent_28%)]",
    pillBorder: "border-sky-400/35",
    pillBg: "bg-sky-400/10",
    pillText: "text-sky-200",
    pillDot: "bg-sky-300 shadow-[0_0_14px_rgba(96,165,250,0.95)]",
    pillGlow: "shadow-[0_0_24px_rgba(96,165,250,0.18)]",
    metricA: "border-sky-400/25 bg-sky-400/[0.08] text-sky-200",
    metricB: "border-indigo-400/25 bg-indigo-400/[0.08] text-indigo-200",
    featureIcon: "border-sky-300/20 bg-sky-400/[0.07] text-sky-200",
    ctaGradient: "from-sky-600 via-blue-500 to-indigo-400",
    ctaShadow: "shadow-[0_0_35px_rgba(96,165,250,0.38)]",
    ctaShadowHover: "hover:shadow-[0_0_55px_rgba(96,165,250,0.58)]",
    starBorder: "border-sky-400/25",
    starBg: "bg-sky-400/10",
    starText: "text-sky-200",
  },
  indigo: {
    articleBorder: "border-indigo-400/30",
    articleGlow: "shadow-[0_0_80px_rgba(129,140,248,0.22)]",
    bgRadials:
      "bg-[radial-gradient(circle_at_30%_75%,rgba(129,140,248,0.18),transparent_28%),radial-gradient(circle_at_70%_25%,rgba(99,102,241,0.22),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(34,211,238,0.14),transparent_28%)]",
    pillBorder: "border-indigo-400/35",
    pillBg: "bg-indigo-400/10",
    pillText: "text-indigo-200",
    pillDot: "bg-indigo-300 shadow-[0_0_14px_rgba(129,140,248,0.95)]",
    pillGlow: "shadow-[0_0_24px_rgba(129,140,248,0.18)]",
    metricA: "border-indigo-400/25 bg-indigo-400/[0.08] text-indigo-200",
    metricB: "border-purple-400/25 bg-purple-400/[0.08] text-purple-200",
    featureIcon: "border-indigo-300/20 bg-indigo-400/[0.07] text-indigo-200",
    ctaGradient: "from-indigo-600 via-violet-500 to-purple-500",
    ctaShadow: "shadow-[0_0_35px_rgba(129,140,248,0.38)]",
    ctaShadowHover: "hover:shadow-[0_0_55px_rgba(129,140,248,0.58)]",
    starBorder: "border-indigo-400/25",
    starBg: "bg-indigo-400/10",
    starText: "text-indigo-200",
  },
  rose: {
    articleBorder: "border-rose-400/30",
    articleGlow: "shadow-[0_0_80px_rgba(251,113,133,0.22)]",
    bgRadials:
      "bg-[radial-gradient(circle_at_30%_75%,rgba(251,113,133,0.16),transparent_28%),radial-gradient(circle_at_70%_25%,rgba(244,63,94,0.22),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(34,197,94,0.10),transparent_28%)]",
    pillBorder: "border-emerald-400/35",
    pillBg: "bg-emerald-400/10",
    pillText: "text-emerald-300",
    pillDot: "bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.95)]",
    pillGlow: "shadow-[0_0_24px_rgba(52,211,153,0.18)]",
    metricA: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300",
    metricB: "border-rose-400/25 bg-rose-400/[0.08] text-rose-200",
    featureIcon: "border-rose-300/20 bg-rose-400/[0.07] text-rose-200",
    ctaGradient: "from-rose-600 via-pink-500 to-orange-400",
    ctaShadow: "shadow-[0_0_35px_rgba(251,113,133,0.38)]",
    ctaShadowHover: "hover:shadow-[0_0_55px_rgba(251,113,133,0.58)]",
    starBorder: "border-rose-400/25",
    starBg: "bg-rose-400/10",
    starText: "text-rose-200",
  },
};

export const accentTheme = (a: Accent): AccentTheme => ACCENT_MAP[a];

/* =============================================================
   Shell — wraps the left marketing column + right scene.
   ============================================================= */

export type ShellMetric = { icon: ReactNode; label: string; value: string };
export type ShellFeature = { icon: ReactNode; label: string };

export function ServiceHeroCardShell({
  accent,
  statusLabel,
  title,
  description,
  metrics,
  features,
  discoveryLine,
  ctaHref = "#contact",
  ctaLabel = "Book a Discovery Call",
  scene,
}: {
  accent: Accent;
  statusLabel: string;
  title: string;
  description: string;
  metrics: [ShellMetric, ShellMetric];
  features: [ShellFeature, ShellFeature, ShellFeature];
  discoveryLine: string;
  ctaHref?: string;
  ctaLabel?: string;
  scene: ReactNode;
}) {
  const t = accentTheme(accent);
  return (
    <section className="section-shell pt-10 sm:pt-14 lg:pt-20">
      <article
        className={`group relative overflow-hidden rounded-[34px] border ${t.articleBorder} bg-[#040d1d] p-6 ${t.articleGlow} md:p-10`}
      >
        <div className={`pointer-events-none absolute inset-0 ${t.bgRadials}`} />
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(125,211,252,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.5)_1px,transparent_1px)] [background-size:36px_36px]" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:items-center">
          {/* LEFT */}
          <div>
            <SummitLogo />

            <div
              className={`mt-8 inline-flex items-center gap-2 rounded-full border ${t.pillBorder} ${t.pillBg} px-5 py-2 text-lg font-semibold ${t.pillText} ${t.pillGlow}`}
            >
              <span className={`h-3 w-3 rounded-full ${t.pillDot}`} />
              {statusLabel}
            </div>

            <h1 className="mt-8 max-w-xl text-4xl font-bold leading-tight tracking-[-0.045em] text-white md:text-5xl xl:text-[56px]">
              {title}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{description}</p>

            <div className="mt-8 grid max-w-[500px] grid-cols-2 gap-4">
              <ShellMetricBox metric={metrics[0]} toneClass={t.metricA} />
              <ShellMetricBox metric={metrics[1]} toneClass={t.metricB} />
            </div>

            <ul className="mt-8 space-y-5 border-t border-white/10 pt-6 text-lg">
              {features.map((f) => (
                <li className="flex items-center gap-4 text-white" key={f.label}>
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${t.featureIcon}`}
                  >
                    {f.icon}
                  </div>
                  <span>{f.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-center gap-4 border-t border-white/10 pt-6 text-base text-slate-300 md:text-lg">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${t.starBorder} ${t.starBg} ${t.starText}`}
              >
                <Star className="h-5 w-5 fill-current" />
              </div>
              <span>{discoveryLine}</span>
            </div>

            <Link
              className={`mt-8 inline-flex h-16 w-full items-center justify-between rounded-2xl border ${t.starBorder} bg-gradient-to-r ${t.ctaGradient} px-7 text-xl font-bold text-white ${t.ctaShadow} transition-all duration-300 ${t.ctaShadowHover} md:w-[330px]`}
              href={ctaHref}
            >
              {ctaLabel}
              <ArrowRight className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>

          {/* RIGHT 3D SCENE */}
          <div className="relative min-h-[640px] overflow-visible [perspective:1400px]">
            <div className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateX(2deg)_rotateY(-2deg)]">
              {scene}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

/* =============================================================
   Logo + Metric
   ============================================================= */

function SummitLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-12">
        <span className="absolute left-0 top-6 h-[4px] w-7 rotate-[-42deg] rounded-full bg-sky-500" />
        <span className="absolute left-4 top-6 h-[4px] w-8 rotate-[42deg] rounded-full bg-cyan-300" />
        <span className="absolute left-5 top-3 h-[4px] w-6 rotate-[45deg] rounded-full bg-blue-500" />
      </div>
      <div>
        <div className="text-[15px] font-bold uppercase tracking-[0.24em] text-white">Summit</div>
        <div className="text-[11px] font-semibold uppercase tracking-[0.38em] text-white/75">
          Automates
        </div>
      </div>
    </div>
  );
}

function ShellMetricBox({ metric, toneClass }: { metric: ShellMetric; toneClass: string }) {
  return (
    <div className={`rounded-[18px] border px-5 py-4 ${toneClass}`}>
      <div className="mb-3 flex items-center gap-3 text-slate-300">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05]">
          {metric.icon}
        </div>
        <span className="text-base">{metric.label}</span>
      </div>
      <div className="text-3xl font-bold tracking-[-0.03em] text-white">{metric.value}</div>
    </div>
  );
}

/* =============================================================
   Scene primitives — reusable building blocks for each service.
   ============================================================= */

export function GlassPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute rounded-[26px] border bg-[#071527]/88 p-5 shadow-[0_0_45px_rgba(59,130,246,0.16)] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

export function PanelTitle({
  icon,
  title,
  iconTone = "blue",
}: {
  icon: ReactNode;
  title: string;
  iconTone?: "blue" | "violet" | "cyan" | "amber" | "sky";
}) {
  const tone =
    iconTone === "violet"
      ? "border-purple-400/25 bg-purple-500/20 text-purple-300"
      : iconTone === "cyan"
        ? "border-cyan-400/25 bg-cyan-500/20 text-cyan-300"
        : iconTone === "amber"
          ? "border-amber-400/25 bg-amber-500/20 text-amber-300"
          : iconTone === "sky"
            ? "border-sky-400/25 bg-sky-500/20 text-sky-300"
            : "border-blue-400/25 bg-blue-500/20 text-blue-300";
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tone}`}>
        {icon}
      </div>
      <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-100">{title}</div>
    </div>
  );
}

export function FlowBox({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "green" | "purple" | "blue" | "amber" | "sky";
}) {
  const style =
    tone === "green"
      ? "border-emerald-400/30 bg-emerald-500/10"
      : tone === "purple"
        ? "border-purple-400/30 bg-purple-500/10"
        : tone === "blue"
          ? "border-blue-400/30 bg-blue-500/10"
          : tone === "amber"
            ? "border-amber-400/30 bg-amber-500/10"
            : "border-sky-400/30 bg-sky-500/10";
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-semibold text-white ${style}`}>
      {children}
    </div>
  );
}

export function SmallFlow({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "blue" | "green" | "purple" | "amber" | "sky";
}) {
  const style =
    tone === "blue"
      ? "border-cyan-400/30 bg-cyan-500/10"
      : tone === "green"
        ? "border-emerald-400/30 bg-emerald-500/10"
        : tone === "purple"
          ? "border-purple-400/30 bg-purple-500/10"
          : tone === "amber"
            ? "border-amber-400/30 bg-amber-500/10"
            : "border-sky-400/30 bg-sky-500/10";
  return (
    <div className={`rounded-xl border px-2 py-3 text-xs leading-5 text-slate-100 ${style}`}>
      {children}
    </div>
  );
}

export function RoutingLabel({ icon, title, tone = "purple" }: { icon: ReactNode; title: string; tone?: "purple" | "amber" | "cyan" | "sky" | "green" }) {
  const style =
    tone === "amber"
      ? "border-amber-400/25 bg-amber-500/20 text-amber-300"
      : tone === "cyan"
        ? "border-cyan-400/25 bg-cyan-500/20 text-cyan-300"
        : tone === "sky"
          ? "border-sky-400/25 bg-sky-500/20 text-sky-300"
          : tone === "green"
            ? "border-emerald-400/25 bg-emerald-500/20 text-emerald-300"
            : "border-purple-400/25 bg-purple-500/20 text-purple-300";
  return (
    <div className="absolute left-0 right-0 top-[66%] flex items-center justify-center gap-3 [transform:translateZ(50px)]">
      <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${style}`}>
        {icon}
      </div>
      <div className="text-sm font-bold uppercase tracking-[0.22em] text-slate-100">{title}</div>
    </div>
  );
}

export function RouteCard({
  className,
  icon,
  title,
  subtitle,
  label,
  value,
  tone,
}: {
  className: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  label: string;
  value: string;
  tone: "green" | "blue" | "purple" | "amber" | "sky";
}) {
  const style =
    tone === "green"
      ? "text-emerald-300 bg-emerald-500/15"
      : tone === "blue"
        ? "text-blue-300 bg-blue-500/15"
        : tone === "purple"
          ? "text-purple-300 bg-purple-500/15"
          : tone === "amber"
            ? "text-amber-300 bg-amber-500/15"
            : "text-sky-300 bg-sky-500/15";
  return (
    <div
      className={`absolute w-[31%] rounded-[22px] border bg-[#071527]/90 p-3.5 shadow-[0_0_35px_rgba(59,130,246,0.14)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style}`}>
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">{title}</div>
          <div className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
        <span className="text-xs text-slate-300">{label}</span>
        <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${style}`}>{value}</span>
      </div>
    </div>
  );
}

/* =============================================================
   Podium — the glowing elliptical stage all "floating" scene
   elements stand on. Same visual idiom across services, color
   driven by accent.
   ============================================================= */

const PODIUM_COLORS: Record<
  Accent,
  { disc: string; outerGlow: string; ringSolid: string; ringSoft: string }
> = {
  teal: {
    disc: "linear-gradient(180deg,#0a1f2e 0%,#03101c 100%)",
    outerGlow: "rgba(34,211,238,0.55)",
    ringSolid: "rgba(94,234,212,0.85)",
    ringSoft: "rgba(34,211,238,0.45)",
  },
  violet: {
    disc: "linear-gradient(180deg,#16133a 0%,#0a081c 100%)",
    outerGlow: "rgba(124,82,255,0.55)",
    ringSolid: "rgba(168,85,247,0.85)",
    ringSoft: "rgba(124,82,255,0.45)",
  },
  cyan: {
    disc: "linear-gradient(180deg,#0a2138 0%,#04121e 100%)",
    outerGlow: "rgba(34,211,238,0.6)",
    ringSolid: "rgba(94,234,212,0.9)",
    ringSoft: "rgba(34,211,238,0.5)",
  },
  gold: {
    disc: "linear-gradient(180deg,#1d1a0e 0%,#0e0a02 100%)",
    outerGlow: "rgba(245,196,107,0.5)",
    ringSolid: "rgba(252,211,77,0.85)",
    ringSoft: "rgba(245,196,107,0.45)",
  },
  sky: {
    disc: "linear-gradient(180deg,#0a1530 0%,#040a1e 100%)",
    outerGlow: "rgba(96,165,250,0.55)",
    ringSolid: "rgba(129,140,248,0.85)",
    ringSoft: "rgba(96,165,250,0.45)",
  },
  indigo: {
    disc: "linear-gradient(180deg,#11103a 0%,#06061a 100%)",
    outerGlow: "rgba(129,140,248,0.55)",
    ringSolid: "rgba(167,139,250,0.85)",
    ringSoft: "rgba(129,140,248,0.45)",
  },
  rose: {
    disc: "linear-gradient(180deg,#2a0a18 0%,#0e0410 100%)",
    outerGlow: "rgba(251,113,133,0.55)",
    ringSolid: "rgba(244,63,94,0.85)",
    ringSoft: "rgba(251,113,133,0.45)",
  },
};

export function Podium({ accent }: { accent: Accent }) {
  const c = PODIUM_COLORS[accent];
  return (
    <div className="pointer-events-none absolute bottom-[3%] left-1/2 -translate-x-1/2 [transform-style:preserve-3d] [transform:translateZ(0)]">
      {/* Outer halo blur */}
      <div
        className="absolute left-1/2 top-1/2 h-[120px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: c.outerGlow }}
      />
      {/* Disc body */}
      <div
        className="relative h-[60px] w-[460px] rounded-full border border-white/10"
        style={{
          background: c.disc,
          boxShadow: `0 12px 60px ${c.outerGlow}, inset 0 6px 18px rgba(0,0,0,0.6), inset 0 -2px 8px rgba(255,255,255,0.04)`,
        }}
      />
      {/* Top edge highlight ring */}
      <div
        className="absolute left-1/2 top-0 h-[6px] w-[460px] -translate-x-1/2 rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${c.ringSolid} 50%, transparent 100%)`,
          boxShadow: `0 0 30px ${c.ringSolid}`,
        }}
      />
      {/* Mid soft ring */}
      <div
        className="absolute left-1/2 top-1/2 h-[3px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${c.ringSoft} 50%, transparent 100%)`,
          boxShadow: `0 0 16px ${c.ringSoft}`,
        }}
      />
      {/* Bottom faint ring */}
      <div
        className="absolute left-1/2 bottom-0 h-[2px] w-[300px] -translate-x-1/2 rounded-full opacity-50"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${c.ringSoft} 50%, transparent 100%)`,
        }}
      />
    </div>
  );
}

/* =============================================================
   Float — wraps a scene element to gently bob in place. Use
   a different delay per element to avoid lockstep motion.
   ============================================================= */

export function Float({
  children,
  className = "",
  delay = 0,
  duration = 6,
  amplitude = 8,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  amplitude?: number;
}) {
  return (
    <div
      className={`absolute ${className}`}
      style={{
        animation: `hero-float ${duration}s ease-in-out ${delay}s infinite`,
        ["--float-amp" as string]: `${amplitude}px`,
      }}
    >
      {children}
    </div>
  );
}

export function ListRow({
  avatar,
  name,
  text,
  meta,
  badge,
  tag,
}: {
  avatar: string;
  name: string;
  text: string;
  meta: string;
  badge?: string;
  tag?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-800 text-sm font-bold text-white">
        {avatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-semibold text-white">{name}</div>
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
        </div>
        <div className="truncate text-xs text-slate-400">{text}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-slate-400">{meta}</div>
        {badge ? (
          <div className="ml-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
            {badge}
          </div>
        ) : null}
        {tag ? (
          <div className="mt-1 rounded-md bg-slate-700 px-2 py-1 text-xs text-slate-200">{tag}</div>
        ) : null}
      </div>
    </div>
  );
}
