import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { contactEmail, siteUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Privacy Policy | Summit Automates",
  description:
    "How Summit Automates collects, uses, and protects information from people who contact us or use our services.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      url: `${siteUrl}/privacy`,
      name: "Privacy Policy",
      description: "Summit Automates privacy policy.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Privacy", item: `${siteUrl}/privacy` },
      ],
    },
  ],
};

export default function PrivacyPage() {
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
            <nav aria-label="Breadcrumb" className="mono mb-6 flex items-center gap-2 text-xs text-slate-400">
              <Link className="hover:text-slate-200" href="/">Home</Link>
              <span>/</span>
              <span className="text-slate-200">Privacy</span>
            </nav>
            <p className="eyebrow">Legal</p>
            <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-slate-400">Last updated: 19 May 2026</p>

            <div className="mt-12 max-w-3xl space-y-6 text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">
              <p>
                This page explains how Summit AI Automation Services (&ldquo;Summit,&rdquo;
                &ldquo;we,&rdquo; &ldquo;us&rdquo;) collects, uses, and protects information from
                people who contact us through this site or use the systems we build.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                What we collect
              </h2>
              <p>
                When you contact us through this site, we collect the information you give us
                directly: your name, email, the company you represent, and the workflow you describe
                in your message. We use standard server logs that record IP addresses and request
                metadata for security and abuse prevention.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                How we use it
              </h2>
              <p>
                We use what you send us to reply to your inquiry, schedule a discovery call,
                generate a proposal, and follow up on the conversation. We do not sell your
                information. We do not share it with third parties for marketing.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Systems we build for clients
              </h2>
              <p>
                When Summit builds an automation system for a client, we follow the data protection
                terms agreed in the engagement contract. We treat client data as confidential, store
                it only in systems the client has authorized, and delete or return it at the end of
                the engagement.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Cookies
              </h2>
              <p>
                This site uses minimal cookies — only what&apos;s required to remember your interface
                preferences. We do not use third-party advertising or tracking cookies.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Your rights
              </h2>
              <p>
                You can ask what data we hold about you, ask us to correct it, or ask us to delete
                it. Send any such request to{" "}
                <a className="text-cyan-200 hover:underline" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>{" "}
                and we will respond within 30 days.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Changes to this policy
              </h2>
              <p>
                We may update this policy as our services evolve. When we do, we update the
                &ldquo;last updated&rdquo; date at the top. Material changes are also sent to
                clients in their engagement updates.
              </p>

              <h2 className="mt-8 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Contact us
              </h2>
              <p>
                For any privacy question or request, reach out at{" "}
                <a className="text-cyan-200 hover:underline" href={`mailto:${contactEmail}`}>
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
