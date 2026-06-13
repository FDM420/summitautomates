import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { insights, insightsBySlug } from "@/lib/insights";
import { contactEmail, siteUrl } from "@/lib/site-content";

export function generateStaticParams() {
  return insights.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = insightsBySlug[slug];
  if (!post) return { title: "Insight not found" };

  return {
    title: `${post.title} | Summit Insights`,
    description: post.excerpt,
    alternates: { canonical: `/insights/${post.slug}` },
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/insights/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = insightsBySlug[slug];
  if (!post) notFound();

  const related = insights
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        url: `${siteUrl}/insights/${post.slug}`,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          "@type": "Organization",
          name: "Summit AI Automation Services",
          url: siteUrl,
        },
        publisher: {
          "@type": "Organization",
          name: "Summit AI Automation Services",
          url: siteUrl,
          logo: { "@type": "ImageObject", url: `${siteUrl}/illustrations/ai-brain.svg` },
        },
        keywords: post.keywords.join(", "),
        articleSection: post.category,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
          { "@type": "ListItem", position: 2, name: "Insights", item: `${siteUrl}/insights` },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `${siteUrl}/insights/${post.slug}`,
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
          <article className="section-shell pt-12 sm:pt-16 lg:pt-24">
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-faint">
              <Link className="hover:text-muted" href="/">Home</Link>
              <span>/</span>
              <Link className="hover:text-muted" href="/insights">Insights</Link>
              <span>/</span>
              <span className="text-muted line-clamp-1">{post.title}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-3 text-xs text-faint">
              <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-accent-ink">
                {post.category}
              </span>
              <span className="mono">{formatDate(post.publishedAt)}</span>
              <span className="inline-flex items-center gap-1.5 text-faint">
                <Clock className="h-3.5 w-3.5" />
                {post.readingMinutes} min read
              </span>
            </div>

            <h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold leading-[1.1] tracking-[-0.04em] text-ink sm:text-5xl lg:text-[3.4rem]">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{post.excerpt}</p>

            <div className="mt-12 max-w-3xl space-y-6">
              {post.body.map((section, index) => {
                if (section.type === "p") {
                  return (
                    <p
                      className="text-base leading-8 text-muted sm:text-lg sm:leading-9"
                      key={index}
                    >
                      {section.text}
                    </p>
                  );
                }
                if (section.type === "h2") {
                  return (
                    <h2
                      className="mt-10 text-balance text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl"
                      key={index}
                    >
                      {section.text}
                    </h2>
                  );
                }
                if (section.type === "h3") {
                  return (
                    <h3
                      className="mt-6 text-balance text-xl font-semibold tracking-[-0.03em] text-ink sm:text-2xl"
                      key={index}
                    >
                      {section.text}
                    </h3>
                  );
                }
                if (section.type === "ul") {
                  return (
                    <ul className="space-y-3 pl-5" key={index}>
                      {section.items.map((item) => (
                        <li
                          className="relative list-disc text-base leading-8 text-muted marker:text-accent-ink"
                          key={item}
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (section.type === "callout") {
                  return (
                    <aside
                      className="my-8 rounded-2xl border border-cyan-300/25 bg-cyan-300/8 p-6"
                      key={index}
                    >
                      <p className="text-lg italic leading-8 text-accent-ink">{section.text}</p>
                    </aside>
                  );
                }
                return null;
              })}
            </div>
          </article>

          {/* CTA */}
          <section className="section-shell py-16">
            <div className="panel-strong rounded-[2.5rem] p-8 sm:p-10">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] lg:items-center">
                <div>
                  <p className="eyebrow">Want this for your team?</p>
                  <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
                    Book a 30-minute discovery call.
                  </h2>
                  <p className="mt-4 text-base leading-7 text-muted">
                    We&apos;ll review your workflow and propose the first thing to automate. Or reach out
                    directly at{" "}
                    <a className="text-accent-ink hover:underline" href={`mailto:${contactEmail}`}>
                      {contactEmail}
                    </a>
                    .
                  </p>
                </div>
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(79,209,255,0.25)] transition hover:scale-[1.02]"
                  href="/contact"
                >
                  Start discovery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* RELATED */}
          {related.length > 0 ? (
            <section className="section-shell py-12">
              <p className="eyebrow">More insights</p>
              <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-ink">
                Keep reading.
              </h2>
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {related.map((p) => (
                  <Link
                    className="panel group rounded-[2rem] p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
                    href={`/insights/${p.slug}`}
                    key={p.slug}
                  >
                    <p className="mono text-xs uppercase tracking-[0.2em] text-faint">
                      {p.category}
                    </p>
                    <h3 className="mt-4 text-xl font-semibold leading-tight tracking-[-0.03em] text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted">{p.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
