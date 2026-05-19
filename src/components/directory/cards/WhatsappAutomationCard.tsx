"use client";

import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  Headphones,
  Inbox,
  MessageCircle,
  Mic,
  Phone,
  Star,
  Tags,
  UserRound,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function WhatsappAutomationCard() {
  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-cyan-400/25 bg-[#040d1d] p-5 shadow-[0_0_80px_rgba(37,99,235,0.22)] md:p-8">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_74%,rgba(34,197,94,0.16),transparent_26%),radial-gradient(circle_at_68%_30%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_92%_74%,rgba(139,92,246,0.18),transparent_28%)]" />

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(125,211,252,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.5)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
        {/* LEFT CONTENT */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.20)]">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.95)]" />
            Open
          </div>

          <h2 className="mt-5 max-w-md text-2xl font-bold leading-[1.1] tracking-[-0.04em] text-white sm:text-3xl xl:text-[2.4rem]">
            WhatsApp Automation Services
          </h2>

          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Summit builds WhatsApp automation systems that reply faster, sort serious leads,
            transcribe voice notes, share conversations with teams, and keep customer handling
            organized.
          </p>

          <div className="mt-5 grid max-w-md grid-cols-2 gap-3">
            <MetricBox
              icon={<MessageCircle className="h-4 w-4" />}
              label="Reply Coverage"
              tone="green"
              value="24/7"
            />
            <MetricBox icon={<Inbox className="h-4 w-4" />} label="Inbox View" tone="blue" value="1" />
          </div>

          <ul className="mt-5 space-y-3 border-t border-white/10 pt-4 text-sm">
            <Feature icon={<Bot className="h-4 w-4" />}>Auto replies for common questions</Feature>
            <Feature icon={<Users className="h-4 w-4" />}>Shared team inbox</Feature>
            <Feature icon={<Workflow className="h-4 w-4" />}>Lead sorting and routing</Feature>
          </ul>

          <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4 text-xs text-slate-300">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-blue-400/25 bg-blue-400/10 text-blue-300">
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
            <span>Open the full service page and discovery path.</span>
          </div>

          <Link
            className="mt-5 inline-flex h-12 w-full items-center justify-between rounded-xl border border-blue-400/25 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-5 text-sm font-bold text-white shadow-[0_0_25px_rgba(56,189,248,0.38)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(56,189,248,0.58)] md:w-[260px]"
            href="/services/whatsapp-automation"
          >
            View service
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* RIGHT 3D SCENE */}
        <div className="relative h-[600px] [perspective:1100px]">
          <div className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateX(2deg)_rotateY(-3deg)]">
            {/* Floor glow */}
            <div className="absolute bottom-[20px] left-[12%] h-[40px] w-[76%] rounded-[50%] bg-emerald-400/10 blur-2xl" />
            <div className="absolute bottom-[32px] left-1/2 h-[18px] w-[44%] -translate-x-1/2 rounded-[50%] border border-cyan-300/40 bg-cyan-300/[0.06] shadow-[0_0_25px_rgba(34,211,238,0.35)]" />

            {/* Connection lines (above panels for visibility) */}
            <svg
              className="pointer-events-none absolute inset-0 z-20 h-full w-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient id="wa-line-cy" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="wa-line-gr" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="wa-line-bl" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="wa-line-pu" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0.95" />
                </linearGradient>
                <filter height="200%" id="wa-glow-filter" width="200%" x="-50%" y="-50%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Phone screen (right side ~x=28) → Workflow top-left (x=38, y=32) */}
              <path
                d="M 26 40 Q 32 36 38 32"
                filter="url(#wa-glow-filter)"
                stroke="url(#wa-line-cy)"
                strokeDasharray="0.8 1.4"
                strokeLinecap="round"
                strokeWidth="0.55"
              >
                <animate attributeName="stroke-dashoffset" dur="2s" from="0" repeatCount="indefinite" to="-12" />
              </path>
              {/* Workflow top-right (x=68, y=32) → Team Inbox left (x=78, y=22) */}
              <path
                d="M 68 32 Q 73 27 78 22"
                filter="url(#wa-glow-filter)"
                stroke="url(#wa-line-cy)"
                strokeDasharray="0.8 1.4"
                strokeLinecap="round"
                strokeWidth="0.55"
              >
                <animate attributeName="stroke-dashoffset" dur="2s" from="0" repeatCount="indefinite" to="-10" />
              </path>

              {/* AUTO REPLY (workflow bottom ~y=60) → Sales (15%, 78%) */}
              <path
                d="M 48 60 Q 30 70 15 78"
                filter="url(#wa-glow-filter)"
                stroke="url(#wa-line-gr)"
                strokeDasharray="0.8 1.4"
                strokeLinecap="round"
                strokeWidth="0.6"
              >
                <animate attributeName="stroke-dashoffset" dur="2.2s" from="0" repeatCount="indefinite" to="-12" />
              </path>
              {/* AUTO REPLY → Support (50%, 78%) — short straight drop */}
              <path
                d="M 52 60 Q 51 69 50 78"
                filter="url(#wa-glow-filter)"
                stroke="url(#wa-line-bl)"
                strokeDasharray="0.8 1.4"
                strokeLinecap="round"
                strokeWidth="0.6"
              >
                <animate attributeName="stroke-dashoffset" dur="2.2s" from="0" repeatCount="indefinite" to="-12" />
              </path>
              {/* AUTO REPLY → Onboarding (85%, 78%) */}
              <path
                d="M 58 60 Q 75 70 85 78"
                filter="url(#wa-glow-filter)"
                stroke="url(#wa-line-pu)"
                strokeDasharray="0.8 1.4"
                strokeLinecap="round"
                strokeWidth="0.6"
              >
                <animate attributeName="stroke-dashoffset" dur="2.2s" from="0" repeatCount="indefinite" to="-12" />
              </path>
            </svg>

            <PhoneMockup />
            <WorkflowPanel />
            <TeamInboxPanel />
            <RoutingCards />
          </div>
        </div>
      </div>
    </article>
  );
}

function PhoneMockup() {
  // iPhone 14 Pro — Space Black
  // Frame technique adapted from https://github.com/ItzBlueSword/iPhone14-Dynamic-Island
  // Key insight: a DOUBLE box-shadow creates the metallic frame thickness with no extra divs.
  //   - inner shadow = the dark inset bezel between screen and steel
  //   - outer shadow = the bright polished stainless steel frame ring
  // Buttons protrude OUTSIDE this frame via negative-inset positioning.
  // Space Black HSL: 215° hue → outer steel hsl(215,28%,72%), inner bezel hsl(215,18%,18%)
  const STEEL_OUTER = "hsl(215,28%,72%)";
  const STEEL_INNER = "hsl(215,18%,16%)";
  const BORDER_W = 5; // px — thickness of the steel frame
  const BUTTON_W = 4; // px — thickness of protruding buttons
  const BG_COLOR = "#0b0e16";

  return (
    <div
      className="absolute left-[-2%] top-[3%]"
      style={{
        width: 196,
        height: 402,
        transform:
          "perspective(950px) rotateY(22deg) rotateX(3deg) rotateZ(1.5deg) translateZ(60px)",
      }}
    >
      {/* ─── PHONE BODY ─── */}
      <div
        className="relative h-full w-full"
        style={{
          background: BG_COLOR,
          borderRadius: 48,
          boxShadow: `
            0 0 0 1px ${STEEL_INNER},
            0 0 0 ${BORDER_W}px ${STEEL_OUTER},
            0 0 0 ${BORDER_W + 1}px ${STEEL_INNER},
            inset 0 0 0 1px rgba(255,255,255,0.05),
            0 50px 90px rgba(0,0,0,0.85),
            0 0 60px rgba(34,211,238,0.28)
          `,
        }}
      >
        {/* SIDE BUTTONS — protrude beyond the steel frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{ inset: -(BORDER_W + 1) }}
        >
          {/* LEFT side: silent switch, volume up, volume down */}
          <div
            style={{
              position: "absolute",
              left: -BUTTON_W,
              top: 76,
              width: BUTTON_W,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {/* Silent switch (small) */}
            <div
              style={{
                width: BUTTON_W,
                height: 16,
                background: STEEL_OUTER,
                borderTopLeftRadius: 2,
                borderBottomLeftRadius: 2,
                boxShadow:
                  "inset -1px 0 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.4), inset -1px 1px 0.5px rgba(0,0,0,0.4)",
                marginBottom: 4,
              }}
            />
            {/* Volume up */}
            <div
              style={{
                width: BUTTON_W,
                height: 36,
                background: STEEL_OUTER,
                borderTopLeftRadius: 2,
                borderBottomLeftRadius: 2,
                boxShadow:
                  "inset -1px 0 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.4), inset -1px 1px 0.5px rgba(0,0,0,0.4)",
              }}
            />
            {/* Volume down */}
            <div
              style={{
                width: BUTTON_W,
                height: 36,
                background: STEEL_OUTER,
                borderTopLeftRadius: 2,
                borderBottomLeftRadius: 2,
                boxShadow:
                  "inset -1px 0 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.4), inset -1px 1px 0.5px rgba(0,0,0,0.4)",
              }}
            />
          </div>

          {/* RIGHT side: power button (longer on 14 Pro) */}
          <div
            style={{
              position: "absolute",
              right: -BUTTON_W,
              top: 108,
              width: BUTTON_W,
              height: 58,
              background: STEEL_OUTER,
              borderTopRightRadius: 2,
              borderBottomRightRadius: 2,
              boxShadow:
                "inset 1px 0 0 rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.4), inset 1px 1px 0.5px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        {/* Antenna lines along the steel frame (top + bottom) */}
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            top: -BORDER_W,
            left: 32,
            right: 32,
            height: 1,
            background: STEEL_INNER,
            zIndex: 2,
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            bottom: -BORDER_W,
            left: 32,
            right: 32,
            height: 1,
            background: STEEL_INNER,
            zIndex: 2,
          }}
        />

        {/* INNER SCREEN AREA */}
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            borderRadius: 44,
            background: "#000",
          }}
        >
          {/* Top antenna line */}
          <div
            className="pointer-events-none absolute left-[10%] right-[10%] top-[1px] z-[2] h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(160,170,185,0.55) 50%, transparent 100%)",
            }}
          />
          {/* Bottom antenna line */}
          <div
            className="pointer-events-none absolute bottom-[1px] left-[10%] right-[10%] z-[2] h-[1px]"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(160,170,185,0.55) 50%, transparent 100%)",
            }}
          />

          {/* SCREEN (Ceramic Shield) */}
          <div
            className="relative m-[5px] h-[calc(100%-10px)] overflow-hidden rounded-[34px]"
            style={{
              background: "#000",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 0 14px rgba(0,0,0,0.65)",
            }}
          >
          {/* Dynamic Island — pill, properly proportioned (~36px tall, 126px wide on real device → here 14×70 for our 200px wide mockup) */}
          <div className="absolute left-1/2 top-[7px] z-20 flex h-[16px] w-[72px] -translate-x-1/2 items-center justify-between rounded-full bg-black px-2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.6)]">
            {/* Front camera (left) — glass lens look */}
            <span
              className="h-[6px] w-[6px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #3a4a66 0%, #0e1420 65%, #030610 100%)",
                boxShadow: "inset 0 0 1px rgba(255,255,255,0.5)",
              }}
            />
            {/* TrueDepth sensor (right) — tiny */}
            <span className="h-[3.5px] w-[3.5px] rounded-full bg-[#0a1018]" />
          </div>

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 pt-3 pb-1.5 text-[0.5rem] font-medium text-white">
            <span>9:41</span>
            <div className="flex items-center gap-0.5 opacity-90">
              <span className="h-[5px] w-[5px] rounded-full bg-white" />
              <span className="h-[5px] w-[5px] rounded-full bg-white" />
              <span className="h-[6px] w-[2px] rounded-sm bg-white" />
              <span className="ml-0.5 flex h-[7px] w-[12px] items-center justify-end rounded-[2px] border border-white/80 px-[1px]">
                <span className="h-full w-[7px] rounded-[1px] bg-white" />
              </span>
            </div>
          </div>

          {/* Account header */}
          <div className="flex items-center gap-2 border-b border-white/8 px-3 pb-2.5 pt-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/25 text-emerald-300">
              <Phone className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-[0.65rem] font-semibold text-white">Business Account</div>
              <div className="text-[0.5rem] text-emerald-300">Online</div>
            </div>
          </div>

          {/* Chat */}
          <div className="space-y-2 px-3 py-3">
            <div className="max-w-[140px] rounded-xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-2.5 py-1.5 text-[0.55rem] leading-4 text-slate-100">
              Hi, I&apos;m interested in your services.
              <div className="mt-0.5 text-right text-[0.45rem] text-slate-400">09:41 AM</div>
            </div>

            <div className="ml-auto max-w-[140px] rounded-xl rounded-tr-sm border border-emerald-400/20 bg-emerald-500/25 px-2.5 py-1.5 text-[0.55rem] leading-4 text-white">
              Thanks! How can we help?
              <div className="mt-0.5 text-right text-[0.45rem] text-emerald-200">09:41 AM ✓✓</div>
            </div>

            <QuickButton icon={<CalendarDays className="h-3 w-3" />} text="Book a Demo" />
            <QuickButton icon={<Tags className="h-3 w-3" />} text="View Pricing" />
          </div>

          {/* Input bar */}
          <div className="absolute bottom-4 left-3 right-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1.5 text-[0.5rem] text-slate-400">
            Type a message...
            <Mic className="ml-auto h-2.5 w-2.5 text-emerald-300" />
          </div>

          {/* Home indicator bar */}
          <div className="absolute bottom-1 left-1/2 h-[3px] w-[50px] -translate-x-1/2 rounded-full bg-white/40" />
        </div>
        </div>
      </div>
    </div>
  );
}

function QuickButton({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1.5 text-[0.55rem] text-slate-100">
      <span className="text-emerald-300">{icon}</span>
      <span>{text}</span>
      <ArrowRight className="ml-auto h-2.5 w-2.5 text-slate-500" />
    </div>
  );
}

function WorkflowPanel() {
  return (
    <Panel className="left-[42%] top-[28%] w-[200px] border-blue-400/30 [transform:rotateY(-3deg)]">
      <PanelTitle icon={<Bot className="h-3.5 w-3.5" />} title="Automation Workflow" />

      <div className="mt-2.5 space-y-1.5 text-center">
        <FlowBox color="green">New Message Received</FlowBox>
        <FlowBox color="purple">Intent Detection</FlowBox>

        <div className="grid grid-cols-3 gap-1">
          <SmallFlow color="blue">Support</SmallFlow>
          <SmallFlow color="green">Sales</SmallFlow>
          <SmallFlow color="purple">General</SmallFlow>
        </div>

        <FlowBox color="green">
          <span className="inline-flex items-center justify-center gap-1">
            Auto Reply or Route <CheckCircle2 className="h-3 w-3" />
          </span>
        </FlowBox>
      </div>
    </Panel>
  );
}

function TeamInboxPanel() {
  return (
    <Panel className="right-[1%] top-[5%] w-[180px] border-blue-400/30 [transform:rotateY(8deg)_translateZ(75px)]">
      <PanelTitle icon={<MessageCircle className="h-3.5 w-3.5" />} title="Team Inbox" />

      <div className="mt-2 space-y-1">
        <InboxRow badge="2" name="Rohan M." text="Hi, interested in..." time="09:41" />
        <InboxRow badge="1" name="Neha S." text="Pricing details?" time="09:40" />
        <InboxRow name="Amit V." tag="Assigned" text="Integration help" time="09:38" />
      </div>
    </Panel>
  );
}

function RoutingCards() {
  return (
    <>
      <SmallRouteCard
        className="left-[2%] bottom-[14%] border-emerald-400/30"
        footerLabel="Lead score"
        footerValue="92"
        icon={<UserRound className="h-3.5 w-3.5" />}
        line1="New lead assigned"
        title="Sales Team"
        tone="green"
      />
      <SmallRouteCard
        className="left-1/2 bottom-[14%] -translate-x-1/2 border-blue-400/30"
        footerLabel="Priority"
        footerValue="High"
        icon={<Headphones className="h-3.5 w-3.5" />}
        line1="Ticket created"
        title="Support"
        tone="blue"
      />
      <SmallRouteCard
        className="right-[1%] bottom-[14%] border-purple-400/30"
        footerLabel="Priority"
        footerValue="Medium"
        icon={<Users className="h-3.5 w-3.5" />}
        line1="New customer"
        title="Onboarding"
        tone="purple"
      />
    </>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute rounded-2xl border bg-[#071527]/92 p-3 shadow-[0_24px_50px_rgba(0,0,0,0.55),0_0_30px_rgba(59,130,246,0.18)] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  );
}

function PanelTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-400/30 bg-blue-500/20 text-blue-300">
        {icon}
      </div>
      <div className="text-[0.6rem] font-bold uppercase tracking-[0.16em] text-slate-100">
        {title}
      </div>
    </div>
  );
}

function FlowBox({ children, color }: { children: ReactNode; color: "green" | "purple" }) {
  const cls =
    color === "green"
      ? "border-emerald-400/40 bg-emerald-500/12 text-white"
      : "border-purple-400/40 bg-purple-500/12 text-white";
  return (
    <div className={`rounded-lg border px-2 py-1.5 text-[0.6rem] font-semibold ${cls}`}>{children}</div>
  );
}

function SmallFlow({
  children,
  color,
}: {
  children: ReactNode;
  color: "blue" | "green" | "purple";
}) {
  const cls =
    color === "blue"
      ? "border-cyan-400/40 bg-cyan-500/12"
      : color === "green"
        ? "border-emerald-400/40 bg-emerald-500/12"
        : "border-purple-400/40 bg-purple-500/12";
  return (
    <div className={`rounded-lg border px-1 py-1.5 text-[0.55rem] leading-3 text-slate-100 ${cls}`}>
      {children}
    </div>
  );
}

function InboxRow({
  name,
  text,
  time,
  badge,
  tag,
  done,
}: {
  name: string;
  text: string;
  time: string;
  badge?: string;
  tag?: string;
  done?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1.5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-800 text-[0.5rem] font-bold text-white">
        {name
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <div className="truncate text-[0.6rem] font-semibold text-white">{name}</div>
          <span className="h-1 w-1 rounded-full bg-emerald-300" />
        </div>
        <div className="truncate text-[0.5rem] text-slate-400">{text}</div>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <div className="text-[0.45rem] text-slate-400">{time}</div>
        {badge ? (
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 text-[0.5rem] font-bold text-white">
            {badge}
          </span>
        ) : null}
        {tag ? (
          <span className="rounded bg-slate-700 px-1 py-0.5 text-[0.45rem] text-slate-200">{tag}</span>
        ) : null}
        {done ? <CheckCircle2 className="h-3 w-3 text-slate-400" /> : null}
      </div>
    </div>
  );
}

function SmallRouteCard({
  className,
  icon,
  title,
  line1,
  footerLabel,
  footerValue,
  tone,
}: {
  className: string;
  icon: ReactNode;
  title: string;
  line1: string;
  footerLabel: string;
  footerValue: string;
  tone: "green" | "blue" | "purple";
}) {
  const color =
    tone === "green"
      ? "text-emerald-300 bg-emerald-500/15"
      : tone === "blue"
        ? "text-blue-300 bg-blue-500/15"
        : "text-purple-300 bg-purple-500/15";

  return (
    <div
      className={`absolute w-[150px] rounded-xl border bg-[#071527]/92 p-2 shadow-[0_18px_36px_rgba(0,0,0,0.5),0_0_22px_rgba(59,130,246,0.18)] backdrop-blur-xl [transform:translateZ(40px)] ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${color}`}>{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[0.6rem] font-bold text-white">{title}</div>
          <div className="truncate text-[0.5rem] text-slate-400">{line1}</div>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between border-t border-white/10 pt-1.5">
        <span className="text-[0.5rem] text-slate-300">{footerLabel}</span>
        <span className={`rounded-md px-1.5 py-0.5 text-[0.55rem] font-bold ${color}`}>
          {footerValue}
        </span>
      </div>
    </div>
  );
}

function MetricBox({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "green" | "blue";
}) {
  const styles =
    tone === "green"
      ? "border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-300"
      : "border-blue-400/30 bg-blue-400/[0.08] text-blue-300";
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${styles}`}>
      <div className="mb-1.5 flex items-center gap-2 text-slate-300">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/[0.05]">
          {icon}
        </div>
        <span className="text-[0.65rem]">{label}</span>
      </div>
      <div className="text-xl font-bold tracking-[-0.03em]">{value}</div>
    </div>
  );
}

function Feature({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-3 text-slate-200">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/[0.07] text-cyan-300">
        {icon}
      </div>
      <span>{children}</span>
    </li>
  );
}
