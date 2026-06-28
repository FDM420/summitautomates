import Link from "next/link";
import type { Metadata } from "next";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { servicePages } from "@/lib/service-pages";
import { siteUrl } from "@/lib/site-content";

type ServiceIconName = "chat" | "hiring" | "growth" | "security" | "operations";

type ServicePresentation = {
  eyebrow: string;
  accent: string;
  icon: ServiceIconName;
};

const servicePresentation: Record<string, ServicePresentation> = {
  "whatsapp-automation": {
    eyebrow: "Support and inbound flow",
    accent: "from-emerald-300/18 via-gold-300/10 to-white/0",
    icon: "chat",
  },
  "recruitment-hr-automation": {
    eyebrow: "Hiring and team ops",
    accent: "from-gold-300/16 via-gold-300/10 to-white/0",
    icon: "hiring",
  },
  "crm-ai-marketing-automation": {
    eyebrow: "Pipeline and growth",
    accent: "from-gold-300/18 via-gold-400/10 to-white/0",
    icon: "growth",
  },
  "document-verification-security-automation": {
    eyebrow: "Controls and compliance",
    accent: "from-amber-300/16 via-gold-300/10 to-white/0",
    icon: "security",
  },
  "workforce-operations-tracking": {
    eyebrow: "Daily operations visibility",
    accent: "from-gold-300/16 via-gold-300/10 to-white/0",
    icon: "operations",
  },
};

function ServiceDirectoryIcon({ icon }: { icon: ServiceIconName }) {
  return (
    <span className="flex h-13 w-13 items-center justify-center rounded-[1.15rem] border border-gold-300/20 bg-gold-300/10 text-gold-100 shadow-[0_12px_32px_rgba(233,200,120,0.14)]">
      {icon === "chat" ? (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path d="M7 8.5h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M7 12h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M6 5h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-4 3v-3H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      ) : null}
      {icon === "hiring" ? (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M4.5 18a4.5 4.5 0 0 1 9 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="m14.5 14.5 2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      ) : null}
      {icon === "growth" ? (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path d="M4 18h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M6 15.5 10 11l3 3 5-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M16 8h2v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      ) : null}
      {icon === "security" ? (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path d="M12 4.5 18 7v4.6c0 3.8-2.2 7.2-6 8.9-3.8-1.7-6-5.1-6-8.9V7l6-2.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="m9.5 12 1.7 1.7 3.3-3.7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      ) : null}
      {icon === "operations" ? (
        <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
          <rect height="5" rx="1.2" stroke="currentColor" strokeWidth="1.8" width="5" x="4" y="4" />
          <rect height="5" rx="1.2" stroke="currentColor" strokeWidth="1.8" width="5" x="15" y="4" />
          <rect height="5" rx="1.2" stroke="currentColor" strokeWidth="1.8" width="5" x="4" y="15" />
          <path d="M15 17.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M17.5 15v5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      ) : null}
    </span>
  );
}

export const metadata: Metadata = {
  title: "Services | Summit AI Automation",
  description:
    "Explore Summit's five connected automation services — WhatsApp automation, recruitment & HR, CRM & AI marketing, document & security, and workforce & operations tracking.",
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: "Services | Summit AI Automation",
    description: "Five connected automation services for operations-heavy businesses.",
    url: `${siteUrl}/services`,
    type: "website",
  },
  keywords: [
    "AI automation services",
    "WhatsApp automation",
    "recruitment automation",
    "CRM automation",
    "document verification automation",
    "workforce operations automation",
  ],
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      url: `${siteUrl}/services`,
      name: "Summit Automation Services",
      description: "Five connected automation services for operations-heavy businesses.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Services", item: `${siteUrl}/services` },
      ],
    },
  ],
};

export default function ServicesDirectoryPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        type="application/ld+json"
      />
      <div className="relative overflow-x-clip">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[26rem] bg-[radial-gradient(circle_at_top,rgba(233,200,120,0.16),transparent_60%)]" />

        <SiteHeader />

        <main className="relative z-10 pb-20 pt-12 sm:pt-16 lg:pt-20">
          <section className="section-shell">
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-slate-400">
              <Link className="hover:text-slate-200" href="/">Home</Link>
              <span>/</span>
              <span className="text-slate-200">Services</span>
            </nav>

            <div className="max-w-3xl space-y-6">
              <span className="eyebrow">Service Directory</span>
              <h1 className="text-balance text-5xl font-semibold tracking-[-0.06em] text-white sm:text-6xl lg:text-[4.8rem] lg:leading-[0.95]">
                Five dedicated services explained clearly for clients and search.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                These services explain Summit&apos;s main automation offers in plain language and give search engines clear,
                focused content for each service area.
              </p>
            </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {servicePages.map((service) => {
            const presentation = servicePresentation[service.slug] ?? {
              eyebrow: "Automation workflow",
              accent: "from-gold-300/16 via-gold-300/10 to-white/0",
              icon: "operations" as const,
            };

            return (
              <Link
                className="group panel-strong relative overflow-hidden rounded-[2rem] p-6 transition duration-300 hover:-translate-y-2 hover:border-gold-300/25 hover:shadow-[0_28px_90px_rgba(0,0,0,0.48)] active:scale-[0.99]"
                href={`/services/${service.slug}`}
                key={service.slug}
              >
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${presentation.accent} opacity-80 transition duration-300 group-hover:opacity-100`}
                />
                <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold-300/40 to-transparent opacity-70" />

                <div className="relative z-10 flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <ServiceDirectoryIcon icon={presentation.icon} />
                      <div>
                        <p className="mono text-xs uppercase tracking-[0.22em] text-gold-200/80">{presentation.eyebrow}</p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{service.cardTitle}</h2>
                      </div>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-slate-300 transition group-hover:border-gold-300/20 group-hover:text-gold-100">
                      Open
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-slate-300">{service.metaDescription}</p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.heroStats.slice(0, 2).map((stat) => (
                      <div
                        className="rounded-[1.35rem] border border-white/10 bg-white/6 px-4 py-3 transition group-hover:border-gold-300/18 group-hover:bg-white/8"
                        key={stat.label}
                      >
                        <p className="mono text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                        <p className="mt-2 text-base font-semibold text-white">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {service.heroTags.slice(0, 3).map((tag) => (
                      <span
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-slate-200 transition group-hover:border-gold-300/15 group-hover:text-white"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <p className="text-sm text-slate-300">Open the full service page and discovery path.</p>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-gold-100 transition duration-300 group-hover:translate-x-1 group-hover:text-gold-50">
                      View service
                      <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
                        <path d="m13 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}