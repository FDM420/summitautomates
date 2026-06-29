import type { Metadata } from "next";
import { BookOpen, ClipboardCheck, KeyRound, MessageSquareText, Rocket, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { siteUrl } from "@/lib/site-content";
import { founders, team } from "@/lib/team";

export const metadata: Metadata = {
  title: "About Summit Automates | AI Automation for Real Business Operations",
  description:
    "Summit Automates is a focused AI automation studio that builds practical, business-ready systems for customer handling, recruitment, lead management, document workflows, and operations tracking.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Summit Automates",
    description:
      "We build AI automation that solves the day-to-day operational headaches of real businesses — not abstract demos.",
    url: `${siteUrl}/about`,
    type: "website",
  },
  keywords: [
    "about Summit Automates",
    "AI automation company",
    "AI automation studio",
    "business automation team",
    "workflow automation consultancy",
  ],
};

const PRINCIPLES = [
  {
    Icon: Rocket,
    title: "Ship in weeks, not quarters",
    description:
      "We use a 5-week rollout pattern that gets one workflow live in week two, then expands. No 3-month builds with no live value.",
  },
  {
    Icon: MessageSquareText,
    title: "Plain language by default",
    description:
      "We translate operational headaches into workflows in language your team — not just your CTO — can follow and own.",
  },
  {
    Icon: ClipboardCheck,
    title: "Audit every decision",
    description:
      "Every automated action is logged, scored, and explainable. You can show regulators, auditors, or stakeholders why anything happened.",
  },
  {
    Icon: UserCheck,
    title: "Humans in the loop where it matters",
    description:
      "AI handles routine and routes the edge cases. Your team is freed from repetition, not replaced — and always has the final call.",
  },
];

const MILESTONES = [
  { value: "500+", label: "Workflows deployed" },
  { value: "40+", label: "Industries served" },
  { value: "98%", label: "Process efficiency lift" },
  { value: "99.9%", label: "Uptime SLO" },
];

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      url: `${siteUrl}/about`,
      name: "About Summit Automates",
      description:
        "Summit Automates is an AI automation studio that builds practical business systems for communication, hiring, lead management, documents, and operations.",
    },
    {
      "@type": "Organization",
      name: "Summit AI Automation Services",
      url: siteUrl,
      logo: `${siteUrl}/illustrations/ai-brain.svg`,
      description:
        "Summit builds practical, business-ready AI automation systems for customer handling, recruitment, lead management, document workflows, and operations tracking.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "About", item: `${siteUrl}/about` },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        type="application/ld+json"
      />
      <div className="relative overflow-x-clip">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(233,200,120,0.16),transparent_60%)]" />

        <SiteHeader />

        <main className="relative z-10 pb-16 sm:pb-20">
          {/* HERO */}
          <section className="section-shell pt-12 sm:pt-16 lg:pt-24">
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-slate-400">
              <Link className="hover:text-slate-200" href="/">Home</Link>
              <span>/</span>
              <span className="text-slate-200">About</span>
            </nav>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <div>
                <p className="eyebrow">Why Summit</p>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.3rem]">
                  We build AI automation that actually runs your business — not pitch decks of it.
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  Summit Automates is a focused studio that builds connected automation systems for
                  customer communication, recruitment, lead management, document workflows, and live
                  operations. Everything we ship is in production within weeks and measurable from day one.
                </p>
              </div>
              <div className="relative hidden lg:block">
                <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.18)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="A modern operations workspace"
                    className="h-full w-full object-cover"
                    src="/about/hero.jpg"
                  />
                </div>
                <div className="pointer-events-none absolute -inset-3 -z-10 rounded-[3rem] bg-[radial-gradient(circle_at_70%_25%,rgba(233,200,120,0.16),transparent_70%)]" />
              </div>
            </div>
          </section>

          {/* VISION */}
          <section className="section-shell py-16">
            <div className="panel-strong relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(233,200,120,0.16),transparent_60%)]" />
              <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
                <div>
                  <p className="eyebrow">Our vision</p>
                  <h2 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-[2.5rem]">
                    A world where every operations team — not just the big tech companies — runs on AI
                    automation they understand, own, and trust.
                  </h2>
                  <p className="mt-6 text-base leading-8 text-slate-300 sm:text-lg">
                    <span className="font-semibold text-gold-200">Our mission:</span> turn the slow,
                    manual, error-prone parts of a business into production-grade AI systems that ship
                    in weeks and keep running for years — in plain language the whole team can own.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    {
                      Icon: BookOpen,
                      label: "Understand",
                      text: "Plain-language systems your whole team can follow — not just engineers.",
                    },
                    {
                      Icon: KeyRound,
                      label: "Own",
                      text: "You hold the keys: no black boxes, no lock-in, full visibility.",
                    },
                    {
                      Icon: ShieldCheck,
                      label: "Trust",
                      text: "Logged, auditable, and proven reliable in production for years.",
                    },
                  ].map((v) => (
                    <div
                      className="flex items-start gap-4 rounded-2xl border border-gold-300/15 bg-gold-300/[0.06] p-4"
                      key={v.label}
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-300/25 bg-gold-300/10 text-gold-200">
                        <v.Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{v.label}</p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">{v.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* PRINCIPLES */}
          <section className="section-shell py-20">
            <div className="max-w-2xl">
              <p className="eyebrow">Operating principles</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Four things we hold to on every build.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {PRINCIPLES.map((principle, index) => (
                <article className="panel rounded-[2rem] p-6" key={principle.title}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-300/25 bg-gold-300/10 text-gold-200">
                      <principle.Icon className="h-5 w-5" />
                    </span>
                    <p className="mono text-xs uppercase tracking-[0.22em] text-slate-400">
                      Principle {String(index + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-slate-300">{principle.description}</p>
                </article>
              ))}
            </div>
          </section>

          {/* MILESTONES */}
          <section className="section-shell py-16">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MILESTONES.map((stat) => (
                <div
                  className="rounded-2xl border border-white/8 bg-white/3 px-5 py-5 backdrop-blur"
                  key={stat.label}
                >
                  <p className="bg-gradient-to-r from-gold-200 to-gold-300 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-white/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* STORY */}
          <section className="section-shell py-20">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
              <div>
                <p className="eyebrow">Our story</p>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  Built from the operations side, not the demo side.
                </h2>
                <div className="mt-8 hidden aspect-[3/2] overflow-hidden rounded-[1.5rem] border border-white/10 lg:block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="A team collaborating around laptops"
                    className="h-full w-full object-cover"
                    loading="lazy"
                    src="/about/story.jpg"
                  />
                </div>
              </div>
              <div className="space-y-5 text-base leading-7 text-slate-300 lg:text-lg lg:leading-8">
                <p>
                  Summit started inside operations teams — recruitment, call centers, real estate
                  agencies, clinics — that were drowning in repeated work. Every AI tool we tried
                  promised the world, demoed beautifully, and then failed at the real test: does it
                  actually run reliably in production for six months?
                </p>
                <p>
                  We started building our own systems instead. They were boring, focused, and small.
                  They worked. Clients asked us to build the same patterns for them. Summit is the
                  studio that came out of that.
                </p>
                <p>
                  Today we build production automation systems across a connected suite of services —{" "}
                  <Link className="text-gold-200 underline-offset-4 hover:underline" href="/services/whatsapp-automation">
                    WhatsApp automation
                  </Link>
                  ,{" "}
                  <Link className="text-gold-200 underline-offset-4 hover:underline" href="/services/recruitment-hr-automation">
                    recruitment &amp; HR
                  </Link>
                  ,{" "}
                  <Link className="text-gold-200 underline-offset-4 hover:underline" href="/services/crm-ai-marketing-automation">
                    CRM &amp; AI marketing
                  </Link>
                  ,{" "}
                  <Link className="text-gold-200 underline-offset-4 hover:underline" href="/services/document-verification-security-automation">
                    document &amp; security
                  </Link>
                  , and{" "}
                  <Link className="text-gold-200 underline-offset-4 hover:underline" href="/services/workforce-operations-tracking">
                    workforce &amp; operations
                  </Link>{" "}
                  — for teams across recruitment agencies, real estate, healthcare, and call centers.
                </p>
              </div>
            </div>
          </section>

          {/* LIFE AT SUMMIT */}
          <section className="section-shell py-16">
            <div className="max-w-2xl">
              <p className="eyebrow">Inside the studio</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Life at Summit.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                A small, senior team designing, building, and shipping in one room.
              </p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {["life-9305", "life-9290", "life-9303", "life-dinner1", "life-dinner2", "life-dinner3"].map((img) => (
                <div
                  className="group aspect-[3/2] overflow-hidden rounded-[1.5rem] border border-white/10"
                  key={img}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Summit Automates team at work"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    src={`/about/${img}.jpg`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* TEAM */}
          <section className="section-shell py-20" id="team">
            <div className="max-w-2xl">
              <p className="eyebrow">The team</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                The people behind Summit.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
                A small, senior team that designs, builds, and ships the automation systems ourselves.
              </p>
            </div>

            {/* Co-founders */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {founders.map((person) => (
                <article className="panel flex items-center gap-5 rounded-[1.8rem] p-6" key={person.name}>
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-gold-300/30 bg-gold-300/10">
                    {person.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={person.name} className="h-full w-full object-cover" src={person.photo} />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-2xl font-semibold text-gold-200">
                        {person.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-semibold text-white">{person.name}</h3>
                    <p className="mono mt-1 text-xs uppercase tracking-[0.2em] text-gold-200/80">
                      {person.role}
                    </p>
                    {person.bio ? (
                      <p className="mt-3 text-sm leading-6 text-slate-300">{person.bio}</p>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>

            {/* Wider team grid */}
            {team.length > 0 ? (
              <div className="mt-12">
                <p className="mono mb-5 text-xs uppercase tracking-[0.24em] text-gold-200/70">
                  The wider team
                </p>
                <div
                  className="group relative mt-6 overflow-hidden"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent, #000 7%, #000 93%, transparent)",
                  }}
                >
                  <style
                    dangerouslySetInnerHTML={{
                      __html:
                        "@keyframes summit-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}" +
                        ".summit-marquee-track{animation:summit-marquee 30s linear infinite;will-change:transform}" +
                        ".group:hover .summit-marquee-track{animation-play-state:paused}" +
                        "@media (prefers-reduced-motion:reduce){.summit-marquee-track{animation:none;flex-wrap:wrap;justify-content:center}}",
                    }}
                  />
                  <div className="summit-marquee-track flex w-max py-2">
                    {[...team, ...team].map((person, i) => (
                      <article
                        aria-hidden={i >= team.length ? true : undefined}
                        className="panel mr-5 flex w-56 shrink-0 flex-col items-center rounded-[1.5rem] p-5 text-center transition-transform duration-300 hover:-translate-y-1"
                        key={`${person.name}-${i}`}
                      >
                        <div className="h-20 w-20 overflow-hidden rounded-2xl border border-gold-300/30 bg-gold-300/10">
                          {person.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img alt={person.name} className="h-full w-full object-cover" src={person.photo} />
                          ) : (
                            <span className="grid h-full w-full place-items-center text-xl font-semibold text-gold-200">
                              {person.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-white">{person.name}</h3>
                        <p className="mono mt-1 text-[0.7rem] uppercase tracking-[0.18em] text-gold-200/80">
                          {person.role}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </section>

          {/* CLIENTS — teams we've worked with (logos in /public/clients) */}
          <section className="section-shell py-12">
            <p className="mono text-center text-xs uppercase tracking-[0.24em] text-slate-400">
              Teams we&apos;ve worked with
            </p>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { name: "HR Business Solutions", slug: "hrbs" },
                { name: "Teleport Manpower", slug: "teleport" },
                { name: "Stiryum", slug: "stiryum" },
                { name: "TalentHue", slug: "talenthue" },
                { name: "Etihad Town", slug: "etihad-town" },
                { name: "Zameen", slug: "zameen" },
                { name: "GFS Builders", slug: "gfs-builders" },
                { name: "Makaan Solutions", slug: "makaan-solutions" },
                { name: "Systems Limited", slug: "systems-limited" },
                { name: "ibex", slug: "ibex" },
                { name: "MindBridge", slug: "mindbridge" },
                { name: "Abacus", slug: "abacus" },
              ].map((c) => (
                <div
                  className="flex h-16 items-center justify-center rounded-xl border border-black/5 bg-white px-3 shadow-sm"
                  key={c.slug}
                  title={c.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={c.name}
                    className="max-h-9 w-auto object-contain"
                    loading="lazy"
                    src={`/clients/${c.slug}.png`}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* CASE STUDIES (representative placeholders — replace with named client stories) */}
          <section className="section-shell py-16">
            <div className="max-w-2xl">
              <p className="eyebrow">Results</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                Representative outcomes.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-400">
                Illustrative examples of the kind of results we build toward — placeholders to be
                replaced with named client case studies.
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  tag: "Recruitment agency",
                  problem: "CV screening, scheduling, and client updates ate days every week.",
                  build:
                    "An automated WhatsApp screening workflow paired with CRM calendar integration for self-scheduling.",
                  outcome: "~40% faster time-to-hire · ~18 hrs/week saved per recruiter",
                },
                {
                  tag: "Real estate team",
                  problem: "Leads arrived across many portals and slipped before anyone replied.",
                  build:
                    "A unified webhook that ingests leads from every portal and fires an instant AI qualification sequence.",
                  outcome: "Sub-2-minute first response · ~28% more qualified tours",
                },
                {
                  tag: "Call center",
                  problem: "Tickets were triaged and QA-scored by hand, slowing resolution.",
                  build:
                    "An NLP routing engine that auto-tags, scores, and assigns tier-1 tickets, escalating only edge cases.",
                  outcome: "Triage in seconds (was hours) · ~98% QA accuracy",
                },
              ].map((c) => (
                <article className="panel flex flex-col rounded-[1.8rem] p-6" key={c.tag}>
                  <p className="mono text-xs uppercase tracking-[0.2em] text-gold-200/80">{c.tag}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    <span className="font-semibold text-white">Problem:</span> {c.problem}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    <span className="font-semibold text-white">The build:</span> {c.build}
                  </p>
                  <p className="mt-5 text-base font-semibold leading-6 text-gold-200">{c.outcome}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs text-slate-500">
              Representative figures — replace with verified client results.
            </p>
          </section>

          {/* TESTIMONIALS (placeholder — replace with real client quotes) */}
          <section className="section-shell py-16">
            <div className="max-w-2xl">
              <p className="eyebrow">What clients say</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                In their words.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                {
                  quote:
                    "Summit built exactly what we needed and had it running in weeks, not months. They explained every part in plain language, so my team could actually use it — not just admire a demo.",
                  name: "Tashfeen Sohail",
                  role: "Founder",
                  initial: "TS",
                },
                {
                  quote:
                    "Our agents used to drown in repeat calls and follow-ups. Summit's automation handles the routine and routes only what needs a person — response times dropped and nothing slips through anymore.",
                  name: "10 Leads Call Center",
                  role: "Operations team",
                  initial: "10",
                },
                {
                  quote:
                    "Leads came from everywhere and we kept losing them. Summit pulled it all into one inbox with instant follow-up — now we reply in minutes and close more viewings.",
                  name: "Daiwal Real Estate",
                  role: "Sales team",
                  initial: "DR",
                },
              ].map((t) => (
                <figure className="panel flex flex-col rounded-[1.8rem] p-6" key={t.name}>
                  <blockquote className="text-base leading-7 text-slate-200">&ldquo;{t.quote}&rdquo;</blockquote>
                  <figcaption className="mt-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-300/30 bg-gold-300/10 text-xs font-semibold text-gold-200">
                      {t.initial}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{t.name}</span>
                      <span className="block text-xs text-slate-400">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="section-shell py-16">
            <div className="panel-strong relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(233,200,120,0.18),transparent_60%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
                <div>
                  <p className="eyebrow">Start a conversation</p>
                  <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                    Tell us what&apos;s slow on your operations side this month.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
                    We&apos;ll review the workflow, identify the first thing to automate, and quote the
                    rollout. No commitment required to take the call.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(233,200,120,0.25)] transition hover:scale-[1.02]"
                    href="/contact"
                  >
                    Book a discovery call
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    href="/services"
                  >
                    Explore services
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
