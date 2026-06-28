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
  Tag,
  UserRound,
  Users,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function WhatsappServiceHeroCard() {
  return (
    <section className="section-shell pt-10 sm:pt-14 lg:pt-20">
      <article className="group relative overflow-hidden rounded-[34px] border border-cyan-400/25 bg-[#040d1d] p-6 shadow-[0_0_80px_rgba(37,99,235,0.22)] md:p-10">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_75%,rgba(34,197,94,0.16),transparent_28%),radial-gradient(circle_at_70%_25%,rgba(59,130,246,0.20),transparent_30%),radial-gradient(circle_at_92%_75%,rgba(139,92,246,0.16),transparent_28%)]" />

        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(125,211,252,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(125,211,252,0.5)_1px,transparent_1px)] [background-size:36px_36px]" />

        <div className="relative z-10 grid gap-12 lg:grid-cols-[0.36fr_0.64fr] lg:items-center">
          {/* LEFT SERVICE CONTENT */}
          <div>
            <SummitLogo />

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/35 bg-emerald-400/10 px-5 py-2 text-lg font-semibold text-emerald-300 shadow-[0_0_24px_rgba(52,211,153,0.18)]">
              <span className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,0.95)]" />
              Open
            </div>

            <h1 className="mt-8 max-w-xl text-4xl font-bold leading-tight tracking-[-0.045em] text-white md:text-5xl xl:text-[56px]">
              WhatsApp Automation Services
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Summit builds WhatsApp automation systems that reply faster, sort serious leads,
              transcribe voice notes, share conversations with teams, and keep customer handling
              organized.
            </p>

            <div className="mt-8 grid max-w-[500px] grid-cols-2 gap-4">
              <MetricBox
                icon={<MessageCircle className="h-6 w-6" />}
                label="Reply Coverage"
                tone="green"
                value="24/7"
              />
              <MetricBox
                icon={<Inbox className="h-6 w-6" />}
                label="Inbox View"
                tone="blue"
                value="1"
              />
            </div>

            <ul className="mt-8 space-y-5 border-t border-white/10 pt-6 text-lg">
              <Feature icon={<Bot className="h-5 w-5" />}>
                Auto replies for common questions
              </Feature>
              <Feature icon={<Users className="h-5 w-5" />}>Shared team inbox</Feature>
              <Feature icon={<Workflow className="h-5 w-5" />}>Lead sorting and routing</Feature>
            </ul>

            <div className="mt-7 flex items-center gap-4 border-t border-white/10 pt-6 text-base text-slate-300 md:text-lg">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-400/25 bg-blue-400/10 text-blue-300">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <span>Open the full service page and discovery path.</span>
            </div>

            <Link
              className="mt-8 inline-flex h-16 w-full items-center justify-between rounded-2xl border border-blue-400/25 bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 px-7 text-xl font-bold text-white shadow-[0_0_35px_rgba(56,189,248,0.38)] transition-all duration-300 hover:shadow-[0_0_55px_rgba(56,189,248,0.58)] md:w-[330px]"
              href="#contact"
            >
              Book a Discovery Call
              <ArrowRight className="h-7 w-7 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>

          {/* RIGHT 3D SCENE */}
          <div className="relative min-h-[640px] overflow-visible [perspective:1400px]">
            <div className="absolute inset-0 [transform-style:preserve-3d] transition-transform duration-700 ease-out group-hover:[transform:rotateX(2deg)_rotateY(-2deg)]">
              <NeonLines />
              <Phone3D />
              <AutomationWorkflow />
              <TeamInbox />
              <LeadRouting />
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

/* ---------------------------------------
   LOGO + LEFT CONTENT HELPERS
--------------------------------------- */

function SummitLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-11 w-12">
        <span className="absolute left-0 top-6 h-[4px] w-7 rotate-[-42deg] rounded-full bg-gold-500" />
        <span className="absolute left-4 top-6 h-[4px] w-8 rotate-[42deg] rounded-full bg-gold-300" />
        <span className="absolute left-5 top-3 h-[4px] w-6 rotate-[45deg] rounded-full bg-gold-600" />
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
  const style =
    tone === "green"
      ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300"
      : "border-blue-400/25 bg-blue-400/[0.08] text-blue-300";
  return (
    <div className={`rounded-[18px] border px-5 py-4 ${style}`}>
      <div className="mb-3 flex items-center gap-3 text-slate-300">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/[0.05]">
          {icon}
        </div>
        <span className="text-base">{label}</span>
      </div>
      <div className="text-3xl font-bold tracking-[-0.03em] text-white">{value}</div>
    </div>
  );
}

function Feature({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <li className="flex items-center gap-4 text-white">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-300">
        {icon}
      </div>
      <span>{children}</span>
    </li>
  );
}

/* ---------------------------------------
   3D SCENE
--------------------------------------- */

function NeonLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-70"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 1000 640"
    >
      {/* Phone → top-row panels */}
      <path d="M260 150 C320 150 340 110 360 110" stroke="url(#wa-line-blue)" strokeWidth="2" />
      <path d="M260 220 C440 220 560 110 700 110" stroke="url(#wa-line-blue)" strokeWidth="2" />
      {/* Top panels → routing label */}
      <path d="M460 320 C460 380 480 410 480 430" stroke="url(#wa-line-green)" strokeWidth="2" />
      <path d="M820 320 C820 380 540 410 520 430" stroke="url(#wa-line-green)" strokeWidth="2" />
      {/* Routing label → 3 route cards */}
      <path d="M450 460 C300 490 180 530 130 580" stroke="url(#wa-line-purple)" strokeWidth="2" />
      <path d="M500 460 C500 510 500 540 500 580" stroke="url(#wa-line-purple)" strokeWidth="2" />
      <path d="M550 460 C700 490 820 530 870 580" stroke="url(#wa-line-purple)" strokeWidth="2" />
      <defs>
        <linearGradient id="wa-line-blue" x1="0" x2="1">
          <stop stopColor="#22d3ee" stopOpacity="0" />
          <stop offset="0.5" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#60a5fa" />
        </linearGradient>
        <linearGradient id="wa-line-green" x1="0" x2="1">
          <stop stopColor="#22c55e" stopOpacity="0" />
          <stop offset="0.5" stopColor="#22c55e" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>
        <linearGradient id="wa-line-purple" x1="0" x2="1">
          <stop stopColor="#22d3ee" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function Phone3D() {
  return (
    <div className="absolute left-[1%] top-[2%] h-[480px] w-[225px] rounded-[40px] border border-cyan-300/30 bg-[#07111f] p-3 shadow-[0_0_70px_rgba(34,211,238,0.22)] [transform:rotateY(-10deg)_rotateZ(-2deg)_translateZ(40px)]">
      <div className="absolute left-1/2 top-3 h-6 w-28 -translate-x-1/2 rounded-b-2xl bg-black/80" />

      <div className="relative h-full overflow-hidden rounded-[34px] border border-white/10 bg-[#06101d]">
        <div className="flex items-center justify-between px-5 py-4 text-xs text-white">
          <span>9:41</span>
          <span>● ● ●</span>
        </div>

        <div className="flex items-center gap-3 border-b border-white/10 px-5 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300">
            <Phone className="h-6 w-6" />
          </div>
          <div>
            <div className="text-base font-semibold text-white">Business Account</div>
            <div className="text-xs text-emerald-300">Online</div>
          </div>
        </div>

        <div className="space-y-4 px-5 py-5">
          <ChatBubble type="incoming">Hi, I&apos;m interested in your services.</ChatBubble>
          <ChatBubble type="outgoing">Thanks! How can we help you today?</ChatBubble>
          <QuickButton icon={<CalendarDays className="h-4 w-4" />} text="Book a Demo" />
          <QuickButton icon={<Tag className="h-4 w-4" />} text="View Pricing" />
          <QuickButton icon={<UserRound className="h-4 w-4" />} text="Talk to Expert" />
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 text-xs text-slate-400">
          Type a message...
          <Mic className="ml-auto h-4 w-4 text-emerald-300" />
        </div>
      </div>
    </div>
  );
}

function ChatBubble({
  children,
  type,
}: {
  children: ReactNode;
  type: "incoming" | "outgoing";
}) {
  const style =
    type === "incoming"
      ? "mr-auto rounded-tl-sm bg-white/[0.06] border-white/10"
      : "ml-auto rounded-tr-sm bg-emerald-500/20 border-emerald-400/20";
  return (
    <div
      className={`max-w-[215px] rounded-2xl border px-4 py-3 text-sm leading-6 text-slate-100 ${style}`}
    >
      {children}
      <div className="mt-1 text-right text-[10px] text-slate-400">09:41 AM</div>
    </div>
  );
}

function QuickButton({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-100">
      <span className="text-emerald-300">{icon}</span>
      <span>{text}</span>
      <ArrowRight className="ml-auto h-4 w-4 text-slate-500" />
    </div>
  );
}

/* ---------------------------------------
   PANELS
--------------------------------------- */

function AutomationWorkflow() {
  return (
    <GlassPanel className="left-[36%] top-[2%] w-[30%] border-blue-400/25 [transform:translateZ(80px)]">
      <PanelTitle icon={<Bot className="h-5 w-5" />} title="Workflow" />
      <div className="mt-4 space-y-2 text-center">
        <FlowBox tone="green">New Message</FlowBox>
        <FlowBox tone="purple">Intent Detection</FlowBox>
        <div className="grid grid-cols-1 gap-2">
          <SmallFlow tone="blue">Support Query</SmallFlow>
          <SmallFlow tone="green">Sales Inquiry</SmallFlow>
          <SmallFlow tone="purple">General Question</SmallFlow>
        </div>
        <FlowBox tone="green">Auto Reply</FlowBox>
      </div>
    </GlassPanel>
  );
}

function TeamInbox() {
  return (
    <GlassPanel className="right-[1%] top-[2%] w-[31%] border-blue-400/25 [transform:translateZ(80px)]">
      <PanelTitle icon={<MessageCircle className="h-5 w-5" />} title="Team Inbox" />
      <div className="mt-4 space-y-2">
        <InboxRow badge="2" name="Rohan Mehta" text="Hi, I'm interested..." time="09:41" />
        <InboxRow badge="1" name="Neha Sharma" text="Can I get pricing?" time="09:40" />
        <InboxRow name="Amit Verma" tag="Assigned" text="Need help with..." time="09:38" />
        <InboxRow done name="Priya Nair" text="Thanks, that worked!" time="09:35" />
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-300">
        View all
        <ArrowRight className="h-3 w-3" />
      </div>
    </GlassPanel>
  );
}

function LeadRouting() {
  return (
    <>
      <div className="absolute left-0 right-0 top-[66%] flex items-center justify-center gap-3 [transform:translateZ(50px)]">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-purple-400/25 bg-purple-500/20 text-purple-300">
          <Workflow className="h-4 w-4" />
        </div>
        <div className="text-sm font-bold uppercase tracking-[0.22em] text-slate-100">
          Lead Routing
        </div>
      </div>
      <RouteCard
        className="left-[1%] bottom-[2%] border-emerald-400/25"
        icon={<UserRound className="h-5 w-5" />}
        label="Lead score"
        subtitle="New lead assigned"
        title="Sales Team"
        tone="green"
        value="92"
      />
      <RouteCard
        className="left-[34%] bottom-[2%] border-blue-400/25"
        icon={<Headphones className="h-5 w-5" />}
        label="Priority"
        subtitle="Ticket created"
        title="Support Team"
        tone="blue"
        value="High"
      />
      <RouteCard
        className="right-[1%] bottom-[2%] border-purple-400/25"
        icon={<Users className="h-5 w-5" />}
        label="Priority"
        subtitle="New customer"
        title="Onboarding"
        tone="purple"
        value="Medium"
      />
    </>
  );
}

/* ---------------------------------------
   PANEL HELPERS
--------------------------------------- */

function GlassPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`absolute rounded-[26px] border bg-[#071527]/88 p-5 shadow-[0_0_45px_rgba(59,130,246,0.16)] backdrop-blur-xl transition-all duration-500 group-hover:-translate-y-1 ${className}`}
    >
      {children}
    </div>
  );
}

function PanelTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-400/25 bg-blue-500/20 text-blue-300">
        {icon}
      </div>
      <div className="text-sm font-bold uppercase tracking-[0.16em] text-slate-100">{title}</div>
    </div>
  );
}

function FlowBox({ children, tone }: { children: ReactNode; tone: "green" | "purple" }) {
  const style =
    tone === "green"
      ? "border-emerald-400/30 bg-emerald-500/10"
      : "border-purple-400/30 bg-purple-500/10";
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-semibold text-white ${style}`}>
      {children}
    </div>
  );
}

function SmallFlow({
  children,
  tone,
}: {
  children: ReactNode;
  tone: "blue" | "green" | "purple";
}) {
  const style =
    tone === "blue"
      ? "border-cyan-400/30 bg-cyan-500/10"
      : tone === "green"
        ? "border-emerald-400/30 bg-emerald-500/10"
        : "border-purple-400/30 bg-purple-500/10";
  return (
    <div className={`rounded-xl border px-2 py-3 text-xs leading-5 text-slate-100 ${style}`}>
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
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-800 text-sm font-bold text-white">
        {name
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="truncate text-sm font-semibold text-white">{name}</div>
          <span className="h-2 w-2 rounded-full bg-emerald-300" />
        </div>
        <div className="truncate text-xs text-slate-400">{text}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-slate-400">{time}</div>
        {badge ? (
          <div className="ml-auto mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
            {badge}
          </div>
        ) : null}
        {tag ? (
          <div className="mt-1 rounded-md bg-slate-700 px-2 py-1 text-xs text-slate-200">{tag}</div>
        ) : null}
        {done ? <CheckCircle2 className="ml-auto mt-1 h-5 w-5 text-slate-400" /> : null}
      </div>
    </div>
  );
}

function RouteCard({
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
  tone: "green" | "blue" | "purple";
}) {
  const style =
    tone === "green"
      ? "text-emerald-300 bg-emerald-500/15"
      : tone === "blue"
        ? "text-blue-300 bg-blue-500/15"
        : "text-purple-300 bg-purple-500/15";
  return (
    <div
      className={`absolute w-[31%] rounded-[22px] border bg-[#071527]/90 p-3.5 shadow-[0_0_35px_rgba(59,130,246,0.14)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${style}`}>{icon}</div>
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
