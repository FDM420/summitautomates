import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { industries } from "@/lib/industries";
import { siteUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Industries We Automate | Summit AI Automation",
  description:
    "Summit builds tailored AI automation for recruitment agencies, real estate teams, clinics, call centers, and other operations-heavy businesses. See the vertical playbooks.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industries We Automate",
    description:
      "Vertical-specific AI automation playbooks for recruitment, real estate, healthcare, and call centers.",
    url: `${siteUrl}/industries`,
    type: "website",
  },
  keywords: [
    "AI automation industries",
    "vertical AI automation",
    "industry-specific automation",
    "recruitment automation",
    "real estate automation",
    "clinic automation",
    "call center automation",
  ],
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      url: `${siteUrl}/industries`,
      name: "Industries We Automate",
      description:
        "Vertical-specific AI automation playbooks across recruitment, real estate, healthcare, and call centers.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Industries", item: `${siteUrl}/industries` },
      ],
    },
  ],
};

export default function IndustriesIndexPage() {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        type="application/ld+json"
      />
      <div className="relative overflow-x-clip">
        <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(233,200,120,0.18),transparent_60%)]" />

        <SiteHeader />

        <main className="relative z-10 pb-16 sm:pb-20">
          <section className="section-shell pt-12 sm:pt-16 lg:pt-24">
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-slate-400">
              <Link className="hover:text-slate-200" href="/">Home</Link>
              <span>/</span>
              <span className="text-slate-200">Industries</span>
            </nav>
            <p className="eyebrow">Industries</p>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.4rem]">
              Vertical playbooks for the businesses we automate.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Every industry has its own version of &quot;the operations problem.&quot; Below are the
              playbooks Summit ships most often — what hurts, what the system handles, and which of
              our connected services apply.
            </p>
          </section>

          <section className="section-shell py-16">
            <div className="grid gap-6 md:grid-cols-2">
              {industries.map((industry, index) => (
                <Link
                  className="panel group relative overflow-hidden rounded-[2rem] p-7 transition hover:-translate-y-1 hover:border-gold-300/30"
                  href={`/industries/${industry.slug}`}
                  key={industry.slug}
                >
                  <div className="flex items-start justify-between">
                    <p className="mono text-xs uppercase tracking-[0.22em] text-gold-200/80">
                      Vertical {String(index + 1).padStart(2, "0")}
                    </p>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-gold-200" />
                  </div>
                  <h2 className="mt-5 text-balance text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                    {industry.name}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-300">{industry.intro}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {industry.relevantServices.slice(0, 3).map((slug) => (
                      <span
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-slate-200"
                        key={slug}
                      >
                        {slug.split("-").slice(0, 2).join(" ")}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="section-shell py-16">
            <div className="panel-strong rounded-[2.5rem] p-8 sm:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-center">
                <div>
                  <p className="eyebrow">Not on the list?</p>
                  <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                    We&apos;ve built automation for 40+ verticals.
                  </h2>
                  <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
                    If your industry isn&apos;t shown above, the answer is probably still yes — most
                    operational pain (lead handling, document workflow, scheduling, reporting) is
                    industry-agnostic. Send us a description of the workflow and we&apos;ll tell you what
                    we&apos;d build.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(233,200,120,0.25)] transition hover:scale-[1.02]"
                    href="/contact"
                  >
                    Start a discovery call
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
