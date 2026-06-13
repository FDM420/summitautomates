import type { Metadata } from "next";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { industries, industriesBySlug } from "@/lib/industries";
import { servicePages } from "@/lib/service-pages";
import { siteUrl } from "@/lib/site-content";

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = industriesBySlug[slug];
  if (!industry) return { title: "Industry not found" };

  return {
    title: `${industry.hero} | Summit Automates`,
    description: industry.metaDescription,
    alternates: { canonical: `/industries/${industry.slug}` },
    keywords: industry.keywords,
    openGraph: {
      title: industry.hero,
      description: industry.metaDescription,
      url: `${siteUrl}/industries/${industry.slug}`,
      type: "website",
    },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = industriesBySlug[slug];
  if (!industry) notFound();

  const relevantServices = industry.relevantServices
    .map((s) => servicePages.find((sp) => sp.slug === s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        url: `${siteUrl}/industries/${industry.slug}`,
        name: industry.hero,
        description: industry.metaDescription,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "Industries",
            item: `${siteUrl}/industries`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: industry.name,
            item: `${siteUrl}/industries/${industry.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
              <Link className="hover:text-muted" href="/industries">Industries</Link>
              <span>/</span>
              <span className="text-muted">{industry.name}</span>
            </nav>
            <p className="eyebrow">Vertical playbook</p>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl lg:text-[3.4rem]">
              {industry.hero}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{industry.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(79,209,255,0.25)] transition hover:scale-[1.02]"
                href="/contact"
              >
                Book a discovery call
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center justify-center rounded-full border border-hair bg-overlay px-6 py-3 text-sm font-semibold text-ink transition hover:bg-overlay-strong"
                href="/services"
              >
                See services
              </Link>
            </div>
          </section>

          {/* PAINS */}
          <section className="section-shell py-20">
            <div className="max-w-2xl">
              <p className="eyebrow">What hurts here</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                The four operational headaches we hear most.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {industry.pains.map((pain, i) => (
                <article className="panel rounded-[2rem] p-6" key={pain.title}>
                  <p className="mono text-xs uppercase tracking-[0.22em] text-faint">
                    Pain {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink">
                    {pain.title}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-muted">{pain.description}</p>
                </article>
              ))}
            </div>
          </section>

          {/* OUTCOMES */}
          <section className="section-shell py-20">
            <div className="max-w-2xl">
              <p className="eyebrow">What we deliver</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                The system in production, in plain language.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {industry.outcomes.map((outcome) => (
                <article className="panel rounded-[2rem] p-6" key={outcome.title}>
                  <div className="flex items-start gap-4">
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-accent-ink">
                      <CheckCircle2 className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">
                        {outcome.title}
                      </h3>
                      <p className="mt-3 text-base leading-7 text-muted">
                        {outcome.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* RELEVANT SERVICES */}
          {relevantServices.length > 0 ? (
            <section className="section-shell py-20">
              <div className="max-w-2xl">
                <p className="eyebrow">Services we apply here</p>
                <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                  The connected Summit services that make this work.
                </h2>
              </div>
              <div className="mt-10 grid gap-5 md:grid-cols-3">
                {relevantServices.map((service) => (
                  <Link
                    className="panel group rounded-[2rem] p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
                    href={`/services/${service.slug}`}
                    key={service.slug}
                  >
                    <h3 className="text-xl font-semibold tracking-[-0.03em] text-ink">
                      {service.navTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {service.metaDescription}
                    </p>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm text-accent-ink">
                      Explore service
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {/* CTA */}
          <section className="section-shell py-16">
            <div className="panel-strong relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(124,82,255,0.20),transparent_60%)]" />
              <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
                <div>
                  <p className="eyebrow">Talk to Summit</p>
                  <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                    See what this looks like for your {industry.name.toLowerCase()}.
                  </h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                    A 30-minute discovery call. We review your current workflow, identify the first
                    thing to automate, and quote the rollout. No commitment.
                  </p>
                </div>
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(79,209,255,0.25)] transition hover:scale-[1.02]"
                  href="/contact"
                >
                  Book a discovery call
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
