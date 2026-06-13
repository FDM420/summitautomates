import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { siteUrl } from "@/lib/site-content";

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
    title: "Ship in weeks, not quarters",
    description:
      "We use a 5-week rollout pattern that gets one workflow live in week two, then expands. No 3-month builds with no live value.",
  },
  {
    title: "Plain language by default",
    description:
      "We translate operational headaches into workflows in language your team — not just your CTO — can follow and own.",
  },
  {
    title: "Audit every decision",
    description:
      "Every automated action is logged, scored, and explainable. You can show regulators, auditors, or stakeholders why anything happened.",
  },
  {
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
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(79,209,255,0.16),transparent_60%)]" />

        <SiteHeader />

        <main className="relative z-10 pb-16 sm:pb-20">
          {/* HERO */}
          <section className="section-shell pt-12 sm:pt-16 lg:pt-24">
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-faint">
              <Link className="hover:text-muted" href="/">Home</Link>
              <span>/</span>
              <span className="text-muted">About</span>
            </nav>
            <p className="eyebrow">Why Summit</p>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl lg:text-[3.6rem]">
              We build AI automation that actually runs your business — not pitch decks of it.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Summit Automates is a focused studio that builds connected automation systems for
              customer communication, recruitment, lead management, document workflows, and live
              operations. Everything we ship is in production within weeks and measurable from day one.
            </p>
          </section>

          {/* PRINCIPLES */}
          <section className="section-shell py-20">
            <div className="max-w-2xl">
              <p className="eyebrow">Operating principles</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                Four things we hold to on every build.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {PRINCIPLES.map((principle, index) => (
                <article className="panel rounded-[2rem] p-6" key={principle.title}>
                  <p className="mono text-xs uppercase tracking-[0.22em] text-faint">
                    Principle {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-muted">{principle.description}</p>
                </article>
              ))}
            </div>
          </section>

          {/* MILESTONES */}
          <section className="section-shell py-16">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {MILESTONES.map((stat) => (
                <div
                  className="rounded-2xl border border-hair bg-overlay px-5 py-5 backdrop-blur"
                  key={stat.label}
                >
                  <p className="bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-3xl font-semibold tracking-tight text-transparent dark:from-cyan-200 dark:to-violet-300 sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.15em] text-ink/55">
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
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                  Built from the operations side, not the demo side.
                </h2>
              </div>
              <div className="space-y-5 text-base leading-7 text-muted lg:text-lg lg:leading-8">
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
                  Today we build production automation systems across five connected services —{" "}
                  <Link className="text-accent-ink underline-offset-4 hover:underline" href="/services/whatsapp-automation">
                    WhatsApp automation
                  </Link>
                  ,{" "}
                  <Link className="text-accent-ink underline-offset-4 hover:underline" href="/services/recruitment-hr-automation">
                    recruitment &amp; HR
                  </Link>
                  ,{" "}
                  <Link className="text-accent-ink underline-offset-4 hover:underline" href="/services/crm-ai-marketing-automation">
                    CRM &amp; AI marketing
                  </Link>
                  ,{" "}
                  <Link className="text-accent-ink underline-offset-4 hover:underline" href="/services/document-verification-security-automation">
                    document &amp; security
                  </Link>
                  , and{" "}
                  <Link className="text-accent-ink underline-offset-4 hover:underline" href="/services/workforce-operations-tracking">
                    workforce &amp; operations
                  </Link>{" "}
                  — for teams across recruitment agencies, real estate, healthcare, and call centers.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="section-shell py-16">
            <div className="panel-strong relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(79,209,255,0.18),transparent_60%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
                <div>
                  <p className="eyebrow">Start a conversation</p>
                  <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                    Tell us what&apos;s slow on your operations side this month.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                    We&apos;ll review the workflow, identify the first thing to automate, and quote the
                    rollout. No commitment required to take the call.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(79,209,255,0.25)] transition hover:scale-[1.02]"
                    href="/contact"
                  >
                    Book a discovery call
                  </Link>
                  <Link
                    className="inline-flex items-center justify-center rounded-full border border-hair bg-overlay px-6 py-3 text-sm font-semibold text-ink transition hover:bg-overlay-strong"
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
