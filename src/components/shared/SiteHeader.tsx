"use client";

import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  Code2,
  FileText,
  Headphones,
  Heart,
  Home,
  Laptop,
  LineChart,
  MapPinned,
  Menu,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UsersRound,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { insights } from "@/lib/insights";
import { ThemeToggle } from "./ThemeToggle";

/* ============================================================
   Menu data — single source of truth for the mega-menu layout.
   ============================================================ */

type MegaItem = {
  href: string;
  label: string;
  icon: ReactNode;
  description?: string;
};

type MegaSection = {
  heading?: string;
  items: MegaItem[];
};

type MenuConfig =
  | { type: "link"; href: string; label: string }
  | {
      type: "mega";
      label: string;
      sections: MegaSection[];
      featured: {
        title: string;
        description: string;
        href: string;
        cta: string;
      };
    };

const ICON_CLASS = "h-5 w-5";

const SERVICES_MENU: MegaSection[] = [
  {
    heading: "Customer & growth",
    items: [
      {
        href: "/services/whatsapp-automation",
        label: "WhatsApp Automation",
        icon: <MessageCircle className={ICON_CLASS} />,
        description: "Auto-reply, sort leads, share inbox.",
      },
      {
        href: "/services/crm-ai-marketing-automation",
        label: "CRM & AI Marketing",
        icon: <TrendingUp className={ICON_CLASS} />,
        description: "Capture leads, follow up, run campaigns.",
      },
      {
        href: "/services/recruitment-hr-automation",
        label: "Recruitment & HR",
        icon: <UsersRound className={ICON_CLASS} />,
        description: "Screen CVs, track candidates, onboard fast.",
      },
    ],
  },
  {
    heading: "Operations & infrastructure",
    items: [
      {
        href: "/services/document-verification-security-automation",
        label: "Document & Security",
        icon: <ShieldCheck className={ICON_CLASS} />,
        description: "OCR, expiry checks, audit trail.",
      },
      {
        href: "/services/workforce-operations-tracking",
        label: "Workforce & Ops",
        icon: <MapPinned className={ICON_CLASS} />,
        description: "Attendance, GPS, daily reports.",
      },
      {
        href: "/services/endpoint-device-management",
        label: "Endpoint & Devices",
        icon: <Laptop className={ICON_CLASS} />,
        description: "MDM, laptop fleet, patch automation.",
      },
    ],
  },
  {
    heading: "Specialised",
    items: [
      {
        href: "/services/forex-trading-automation",
        label: "Forex & Trading",
        icon: <LineChart className={ICON_CLASS} />,
        description: "MT5 EAs, AI bots, indicators, portals.",
      },
    ],
  },
  {
    heading: "AI & custom builds",
    items: [
      {
        href: "/services/ai-voice-agents",
        label: "AI Voice Agents",
        icon: <PhoneCall className={ICON_CLASS} />,
        description: "Inbound & outbound AI calls.",
      },
      {
        href: "/services/ai-document-generation",
        label: "AI Document Generation",
        icon: <FileText className={ICON_CLASS} />,
        description: "Plans, proposals & reports.",
      },
      {
        href: "/services/ai-video-generation",
        label: "AI Video & Media",
        icon: <Clapperboard className={ICON_CLASS} />,
        description: "Short-form video at scale.",
      },
      {
        href: "/services/custom-software-development",
        label: "Custom Software & SaaS",
        icon: <Code2 className={ICON_CLASS} />,
        description: "Web apps, SaaS, portals.",
      },
    ],
  },
];

const INDUSTRIES_MENU: MegaSection[] = [
  {
    heading: "By sector",
    items: [
      {
        href: "/industries/recruitment-agencies",
        label: "Recruitment Agencies",
        icon: <Briefcase className={ICON_CLASS} />,
        description: "Screening, pipelines, document checks.",
      },
      {
        href: "/industries/real-estate",
        label: "Real Estate",
        icon: <Home className={ICON_CLASS} />,
        description: "Leads, viewings, contracts.",
      },
      {
        href: "/industries/clinics-and-healthcare",
        label: "Clinics & Healthcare",
        icon: <Heart className={ICON_CLASS} />,
        description: "Bookings, reminders, patient docs.",
      },
      {
        href: "/industries/call-centers",
        label: "Call Centers",
        icon: <Headphones className={ICON_CLASS} />,
        description: "Ticket routing, QA, live floor view.",
      },
    ],
  },
];

const INSIGHTS_MENU: MegaSection[] = [
  {
    heading: "Latest posts",
    items: insights
      .slice()
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, 3)
      .map((post) => ({
        href: `/insights/${post.slug}`,
        label: post.title,
        icon: <FileText className={ICON_CLASS} />,
        description: `${post.category} · ${post.readingMinutes} min read`,
      })),
  },
];

const MENU: MenuConfig[] = [
  {
    type: "mega",
    label: "Services",
    sections: SERVICES_MENU,
    featured: {
      title: "Automation Command Center",
      description:
        "Eleven connected services orbiting one AI core — see how Summit wires customer ops, hiring, sales, documents, devices, voice, video, and custom builds into one workflow.",
      href: "/services",
      cta: "Explore all services",
    },
  },
  {
    type: "mega",
    label: "Industries",
    sections: INDUSTRIES_MENU,
    featured: {
      title: "Vertical playbooks",
      description:
        "Industry-specific implementations of Summit automation. We've shipped to 40+ verticals; the four below are the most-requested playbooks.",
      href: "/industries",
      cta: "See all industries",
    },
  },
  {
    type: "mega",
    label: "Insights",
    sections: INSIGHTS_MENU,
    featured: {
      title: "Field notes & playbooks",
      description:
        "Strategy, implementation patterns, and case patterns from real production rollouts — written for managers, not developers.",
      href: "/insights",
      cta: "Read all insights",
    },
  },
  { type: "link", href: "/about", label: "About" },
  { type: "link", href: "/contact", label: "Contact" },
];

/* ============================================================
   Component
   ============================================================ */

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenMenu(label);
  };
  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 140);
  };

  /* Esc closes dropdown */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Lock body scroll when mobile drawer open */
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(3,6,15,0.75)] backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-4 py-4 sm:gap-6">
        {/* LOGO */}
        <Link aria-label="Summit Automates home" className="flex items-center gap-3" href="/">
          <Image
            alt="Summit AI Automation"
            className="h-10 w-auto sm:h-11"
            height={549}
            priority
            src="/summit-logo-gold.png"
            width={1012}
          />
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Summit AI Automation</p>
            <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">
              SUMMITAUTOMATES
            </p>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={handleLeave}
        >
          {MENU.map((item) => {
            if (item.type === "link") {
              return (
                <Link
                  className="rounded-lg px-3.5 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  href={item.href}
                  key={item.label}
                  onMouseEnter={() => handleEnter("")}
                >
                  {item.label}
                </Link>
              );
            }
            const isOpen = openMenu === item.label;
            return (
              <div
                className="relative"
                key={item.label}
                onMouseEnter={() => handleEnter(item.label)}
              >
                <button
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm transition ${
                    isOpen
                      ? "bg-white/8 text-white"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => {
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    setOpenMenu((cur) => (cur === item.label ? null : item.label));
                  }}
                  type="button"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen ? (
                  <MegaPanel
                    featured={item.featured}
                    onLinkClick={() => setOpenMenu(null)}
                    sections={item.sections}
                  />
                ) : null}
              </div>
            );
          })}
        </nav>

        <ThemeToggle />

        {/* CTA */}
        <Link
          className="hidden rounded-full border border-gold-300/25 bg-gold-300/10 px-4 py-2.5 text-sm font-medium text-gold-50 transition hover:border-gold-200/40 hover:bg-gold-300/15 sm:inline-flex sm:px-5 sm:py-3"
          href="/contact"
        >
          Start Discovery
        </Link>

        {/* MOBILE TOGGLE */}
        <button
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-white lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          type="button"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER (accordion-style) */}
      {mobileOpen ? (
        <nav
          aria-label="Mobile primary"
          className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-white/8 bg-[rgba(3,6,15,0.96)] backdrop-blur-xl lg:hidden"
        >
          <div className="section-shell flex flex-col gap-1 py-5">
            {MENU.map((item) => {
              if (item.type === "link") {
                return (
                  <Link
                    className="rounded-xl px-4 py-3 text-base text-slate-200 transition hover:bg-white/5 hover:text-white"
                    href={item.href}
                    key={item.label}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              }
              const expanded = mobileExpanded === item.label;
              return (
                <div className="rounded-xl border border-white/5 bg-white/[0.02]" key={item.label}>
                  <button
                    aria-expanded={expanded}
                    className="flex w-full items-center justify-between px-4 py-3 text-base text-white"
                    onClick={() =>
                      setMobileExpanded((cur) => (cur === item.label ? null : item.label))
                    }
                    type="button"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expanded ? (
                    <div className="border-t border-white/5 px-2 py-2">
                      {item.sections.flatMap((s) => s.items).map((entry) => (
                        <Link
                          className="flex items-start gap-3 rounded-lg px-3 py-3 transition hover:bg-white/5"
                          href={entry.href}
                          key={entry.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          <span className="mt-0.5 text-gold-200">{entry.icon}</span>
                          <span>
                            <span className="block text-sm font-medium text-white">
                              {entry.label}
                            </span>
                            {entry.description ? (
                              <span className="mt-0.5 block text-xs text-slate-400">
                                {entry.description}
                              </span>
                            ) : null}
                          </span>
                        </Link>
                      ))}
                      <Link
                        className="mt-2 flex items-center justify-between rounded-lg border border-gold-300/20 bg-gold-300/5 px-3 py-3 text-sm text-gold-200"
                        href={item.featured.href}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.featured.cta}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}
            <Link
              className="mt-3 rounded-full border border-gold-300/25 bg-gold-300/10 px-4 py-3 text-center text-sm font-medium text-gold-50"
              href="/contact"
              onClick={() => setMobileOpen(false)}
            >
              Start Discovery
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}

/* ============================================================
   Mega panel — the dropdown body, absolute-positioned
   ============================================================ */

function MegaPanel({
  sections,
  featured,
  onLinkClick,
}: {
  sections: MegaSection[];
  featured: {
    title: string;
    description: string;
    href: string;
    cta: string;
  };
  onLinkClick: () => void;
}) {
  return (
    <div
      className="absolute left-0 top-full z-50 pt-3"
      role="menu"
    >
      <div className="grid w-[min(72rem,90vw)] grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-6 rounded-2xl border border-white/10 bg-[rgba(8,12,28,0.96)] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        {/* LEFT — items grid */}
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div key={section.heading ?? "default"}>
              {section.heading ? (
                <p className="mono mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-200/70">
                  {section.heading}
                </p>
              ) : null}
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {section.items.map((entry) => (
                  <li key={entry.href}>
                    <Link
                      className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition hover:border-white/10 hover:bg-white/5"
                      href={entry.href}
                      onClick={onLinkClick}
                    >
                      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-gold-300/20 bg-gold-300/10 text-gold-200 transition group-hover:border-gold-300/35 group-hover:bg-gold-300/15">
                        {entry.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-white">
                            {entry.label}
                          </span>
                          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-gold-200" />
                        </span>
                        {entry.description ? (
                          <span className="mt-1 block text-xs leading-5 text-slate-400">
                            {entry.description}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* RIGHT — featured block */}
        <Link
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gold-300/25 bg-gradient-to-br from-gold-500/16 via-gold-600/10 to-gold-800/14 p-6 transition hover:border-gold-300/40"
          href={featured.href}
          onClick={onLinkClick}
        >
          {/* Decorative glow */}
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-gold-700/20 blur-3xl" />

          <div className="relative">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold-300/30 bg-gold-300/10 text-gold-200">
              <Sparkles className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-base font-semibold leading-tight text-white">
              {featured.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{featured.description}</p>
          </div>

          <p className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold-200 transition group-hover:translate-x-0.5">
            {featured.cta}
            <ArrowRight className="h-4 w-4" />
          </p>
        </Link>
      </div>
    </div>
  );
}
