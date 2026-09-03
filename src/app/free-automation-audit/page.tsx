import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { contactEmail, siteUrl, whatsappNumber } from "@/lib/site-content";

const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_URL?.trim();

export const metadata: Metadata = {
  title: "Free Workflow Automation Audit | Summit AI Automation Services",
  description:
    "Book a free workflow automation audit. Summit maps your repeated manual tasks, shows which ones AI automation can remove, and gives you a prioritized plan — no cost, no obligation.",
  keywords: [
    "free workflow automation audit",
    "free automation assessment",
    "business process audit",
    "AI automation consultation",
    "workflow audit for business",
  ],
  alternates: { canonical: "/free-automation-audit" },
  openGraph: {
    title: "Free Workflow Automation Audit | Summit AI Automation Services",
    description:
      "Get a free audit of your business workflows. We map the manual work, show what AI automation can remove, and hand you a prioritized plan.",
    url: `${siteUrl}/free-automation-audit`,
    type: "website",
  },
  robots: { index: true, follow: true },
};

const auditSteps = [
  {
    title: "Tell us how work runs today",
    description:
      "A 30-minute call where you describe the daily routine in plain words — messages, leads, documents, approvals, reports. No preparation or technical knowledge needed.",
  },
  {
    title: "We map the manual work",
    description:
      "We identify the repeated tasks eating staff time, where handoffs drop, and which steps depend on someone's memory instead of a system.",
  },
  {
    title: "You get a prioritized plan",
    description:
      "A short written summary: which workflows to automate first, roughly what each saves, and what the build would involve. Yours to keep either way.",
  },
];

const auditFaqs = [
  {
    question: "Is the audit really free?",
    answer:
      "Yes. The audit call and the written summary are free, with no obligation. If you decide to build something with Summit afterwards, that is a separate scoped project.",
  },
  {
    question: "Do I need to prepare anything?",
    answer:
      "No. Just be ready to describe how your team handles a normal day — where messages come from, how leads are followed up, and which tasks feel repetitive.",
  },
  {
    question: "What kinds of workflows can be audited?",
    answer:
      "Anything with repeated steps: WhatsApp and customer handling, lead follow-up, recruitment, document checks, approvals, reporting, and general operations.",
  },
  {
    question: "How long does it take to get the plan?",
    answer:
      "You usually receive the written summary within a few working days of the audit call.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      name: "Free Workflow Automation Audit",
      serviceType: "Workflow automation audit",
      description:
        "A free audit that maps a business's repeated manual tasks and delivers a prioritized automation plan.",
      provider: { "@id": `${siteUrl}/#organization` },
      areaServed: "Worldwide",
      url: `${siteUrl}/free-automation-audit`,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: auditFaqs.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        {
          "@type": "ListItem",
          position: 2,
          name: "Free Workflow Automation Audit",
          item: `${siteUrl}/free-automation-audit`,
        },
      ],
    },
  ],
};

export default function FreeAutomationAuditPage() {
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hi Summit, I'd like to book a free workflow automation audit.",
  )}`;

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        type="application/ld+json"
      />
      <div className="relative overflow-x-clip">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(233,200,120,0.16),transparent_60%)]" />

        <SiteHeader />

        <main className="relative z-10 pb-16 sm:pb-20">
          <article className="section-shell pt-12 sm:pt-16 lg:pt-24">
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-slate-400">
              <Link className="hover:text-slate-200" href="/">Home</Link>
              <span>/</span>
              <span className="text-slate-200">Free Automation Audit</span>
            </nav>
            <p className="eyebrow">Free Audit</p>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Free Workflow Automation Audit.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">
              In one short call, we map the repeated manual work inside your business — messages,
              leads, documents, approvals, reports — and send you a prioritized plan showing which
              workflows AI automation can remove first. Free, and yours to keep whether or not you
              build with us.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {calendarUrl ? (
                <a
                  className="inline-flex items-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                  href={calendarUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Book the free audit →
                </a>
              ) : (
                <Link
                  className="inline-flex items-center rounded-full bg-amber-300 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
                  href="/contact"
                >
                  Book the free audit →
                </Link>
              )}
              <a
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-white/40"
                href={whatsappHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                Ask on WhatsApp
              </a>
            </div>

            <section className="mt-14">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                How the audit works
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-3">
                {auditSteps.map((step, index) => (
                  <div key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <p className="mono text-xs text-amber-300">0{index + 1}</p>
                    <h3 className="mt-3 text-lg font-semibold text-white">{step.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-14 max-w-3xl">
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Common questions
              </h2>
              <div className="mt-8 space-y-8">
                {auditFaqs.map((item) => (
                  <div key={item.question}>
                    <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                    <p className="mt-2 text-base leading-8 text-slate-300">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-14 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h2 className="text-xl font-semibold text-white">Prefer email?</h2>
              <p className="mt-3 text-base leading-8 text-slate-300">
                Send a few sentences about the workflow that feels slow or manual to{" "}
                <a className="text-amber-300 hover:text-amber-200" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>{" "}
                and we will reply with next steps for the free audit.
              </p>
            </section>
          </article>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
