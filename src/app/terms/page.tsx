import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { contactEmail, siteUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Terms of Service | Summit Automates",
  description: "Terms governing use of the Summit Automates website and content.",
  alternates: { canonical: "/terms" },
  robots: { index: true, follow: true },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      url: `${siteUrl}/terms`,
      name: "Terms of Service",
      description: "Summit Automates terms of service.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Terms", item: `${siteUrl}/terms` },
      ],
    },
  ],
};

export default function TermsPage() {
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
          <article className="section-shell pt-12 sm:pt-16 lg:pt-24">
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-faint">
              <Link className="hover:text-muted" href="/">Home</Link>
              <span>/</span>
              <span className="text-muted">Terms</span>
            </nav>
            <p className="eyebrow">Legal</p>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-3 text-sm text-faint">Last updated: 19 May 2026</p>

            <div className="mt-12 max-w-3xl space-y-6 text-base leading-8 text-muted sm:text-lg sm:leading-9">
              <p>
                These terms govern your use of the Summit AI Automation Services website. The
                website is informational. Engagements with Summit are governed by separate, signed
                contracts with terms specific to the agreed scope.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Use of this site
              </h2>
              <p>
                You may browse this site, read our content, and contact us. You may not scrape it
                for bulk republishing, use it to train commercial AI models without permission, or
                use it for any unlawful purpose.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Content ownership
              </h2>
              <p>
                All written content, illustrations, and design on this site is the property of
                Summit AI Automation Services. You may quote short excerpts for review or
                commentary with attribution and a link back.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                No professional advice
              </h2>
              <p>
                The content on this site is general information about AI automation. It is not
                legal, financial, compliance, or operational advice for your specific situation. For
                a recommendation tailored to your business, book a discovery call.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Limitation of liability
              </h2>
              <p>
                The site is provided &ldquo;as is&rdquo; without warranties. Summit is not liable
                for any damages arising from your use of the site. Service-level commitments apply
                only to clients under signed engagement contracts.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Changes to these terms
              </h2>
              <p>
                We may update these terms. The &ldquo;last updated&rdquo; date reflects the most
                recent version. Continued use of the site after changes constitutes acceptance.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-ink sm:text-3xl">
                Contact
              </h2>
              <p>
                Questions about these terms? Reach out at{" "}
                <a className="text-accent-ink hover:underline" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
                .
              </p>
            </div>
          </article>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
