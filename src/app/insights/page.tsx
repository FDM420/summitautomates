import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { insights } from "@/lib/insights";
import { siteUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Insights | Summit AI Automation",
  description:
    "Field notes from building AI automation in production — playbooks, strategy, implementation patterns, and case patterns from real Summit rollouts.",
  alternates: { canonical: "/insights" },
  openGraph: {
    title: "Insights | Summit AI Automation",
    description:
      "Field notes from building AI automation in production — playbooks, strategy, and implementation patterns.",
    url: `${siteUrl}/insights`,
    type: "website",
  },
  keywords: [
    "AI automation playbook",
    "AI automation strategy",
    "business automation blog",
    "AI implementation patterns",
    "automation case studies",
  ],
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Blog",
      url: `${siteUrl}/insights`,
      name: "Summit Automates Insights",
      description: "Playbooks, strategy, and implementation patterns from real AI automation builds.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Insights", item: `${siteUrl}/insights` },
      ],
    },
  ],
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function InsightsIndexPage() {
  const sorted = [...insights].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

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
          <section className="section-shell pt-12 sm:pt-16 lg:pt-24">
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-slate-400">
              <Link className="hover:text-slate-200" href="/">Home</Link>
              <span>/</span>
              <span className="text-slate-200">Insights</span>
            </nav>
            <p className="eyebrow">Insights</p>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.4rem]">
              Field notes from building AI automation in production.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
              Playbooks, strategy notes, and implementation patterns from Summit rollouts — written
              for managers and operators, not developers.
            </p>
          </section>

          <section className="section-shell py-12">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((post) => (
                <Link
                  className="panel group flex flex-col rounded-[2rem] p-6 transition hover:-translate-y-1 hover:border-gold-300/30"
                  href={`/insights/${post.slug}`}
                  key={post.slug}
                >
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="rounded-full border border-gold-300/30 bg-gold-300/10 px-3 py-1 text-gold-200">
                      {post.category}
                    </span>
                    <span className="mono">{formatDate(post.publishedAt)}</span>
                  </div>
                  <h2 className="mt-5 text-balance text-2xl font-semibold leading-tight tracking-[-0.03em] text-white">
                    {post.title}
                  </h2>
                  <p className="mt-4 flex-1 text-sm leading-7 text-slate-300">{post.excerpt}</p>
                  <p className="mt-6 inline-flex items-center gap-2 text-sm text-gold-200">
                    {post.readingMinutes} min read
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
