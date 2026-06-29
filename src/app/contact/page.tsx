import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { ContactFlow } from "@/components/contact-flow";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { contactEmail, siteUrl } from "@/lib/site-content";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Summit Automates | Book an Automation Discovery Call",
  description:
    "Book a 30-minute discovery call with Summit Automates. We map your workflow, propose what to automate first, and quote the rollout. No commitment.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Summit Automates",
    description: "Book a 30-minute automation discovery call.",
    url: `${siteUrl}/contact`,
    type: "website",
  },
  keywords: [
    "contact Summit Automates",
    "AI automation discovery call",
    "book automation consultation",
    "Summit automation contact",
  ],
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      url: `${siteUrl}/contact`,
      name: "Contact Summit Automates",
      description: "Book a 30-minute automation discovery call.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Contact", item: `${siteUrl}/contact` },
      ],
    },
  ],
};

export default function ContactPage() {
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
              <span className="text-slate-200">Contact</span>
            </nav>

            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:items-start">
              <div>
                <p className="eyebrow">Start a conversation</p>
                <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[3.4rem]">
                  Book a 30-minute automation discovery call.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  We review the workflow you want to fix, propose what to automate first, and quote
                  the rollout. No commitment to take the call.
                </p>
              </div>

              <div className="space-y-5">
                <div className="panel rounded-[1.6rem] p-5">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-300/30 bg-gold-300/10 text-gold-200">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Email us directly</p>
                      <a
                        className="mt-1 inline-block break-all text-base text-gold-200 hover:underline"
                        href={`mailto:${contactEmail}`}
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="panel rounded-[1.6rem] p-5">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-300/30 bg-gold-300/10 text-gold-200">
                      <MessageSquare className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Response time</p>
                      <p className="mt-1 text-base text-slate-300">
                        Within one business day, usually faster.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="panel rounded-[1.6rem] p-5">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold-300/30 bg-gold-300/10 text-gold-200">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">Working globally</p>
                      <p className="mt-1 text-base text-slate-300">
                        Remote-first. We work with teams across the Americas, EMEA, and APAC.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <ContactFlow
            description="Tell us what you want to automate. We'll map the workflow and quote the rollout."
            eyebrow="Discovery"
            presetFocus="general inquiry"
            submitLabel="Send my brief"
            title="What should we automate first?"
          />
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
