import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { googleReviewUrl, siteUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Leave Summit a Google Review",
  description:
    "Worked with Summit Automates? Leave us a Google review in under a minute — it helps other businesses find systems that actually work.",
  alternates: { canonical: "/review" },
  openGraph: {
    title: "Leave Summit a Google Review",
    description:
      "Worked with Summit Automates? Leave us a Google review in under a minute.",
    url: `${siteUrl}/review`,
    type: "website",
  },
  // This is a share/redirect page for existing clients, not SEO content.
  robots: { index: false, follow: true },
};

const steps = [
  "Tap the gold button below — it opens Google directly.",
  "Sign in with any Google account (no Summit account needed).",
  "Pick your star rating and write a line or two. Done.",
];

export default function ReviewPage() {
  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(233,200,120,0.18),transparent_60%)]" />

      <SiteHeader />

      <main className="relative z-10 pb-16 sm:pb-20">
        <article className="section-shell pt-14 text-center sm:pt-20 lg:pt-28">
          <p className="eyebrow">Thank You</p>
          <div className="mt-6 text-4xl tracking-[0.3em] text-amber-300" aria-hidden>
            ★★★★★
          </div>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Leave Summit a Google review.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg sm:leading-9">
            If Summit built something that made your day-to-day easier, a quick review means
            a lot — and it helps other business owners find automation that actually works.
            It takes under a minute.
          </p>

          <div className="mt-10">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-amber-200"
              href={googleReviewUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              ★ Write a Google review
            </a>
          </div>

          <ol className="mx-auto mt-14 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
            {steps.map((step, index) => (
              <li
                key={step}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <p className="mono text-xs text-amber-300">Step {index + 1}</p>
                <p className="mt-3 text-sm leading-7 text-slate-200">{step}</p>
              </li>
            ))}
          </ol>

          <p className="mt-12 text-sm text-slate-400">
            Not a client yet?{" "}
            <Link className="text-amber-300 hover:text-amber-200" href="/free-automation-audit">
              Book a free automation audit
            </Link>{" "}
            instead.
          </p>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
