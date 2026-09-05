import type { Metadata } from "next";
import Link from "next/link";
import { googleReviewUrl, siteUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Leave Summit a Google Review",
  description: "One tap: rate Summit Systems on Google. It takes 30 seconds.",
  alternates: { canonical: "/review" },
  openGraph: {
    title: "Leave Summit a Google Review",
    description: "One tap: rate Summit Systems on Google.",
    url: `${siteUrl}/review`,
    type: "website",
  },
  // Share/redirect page for existing clients, not SEO content.
  robots: { index: false, follow: true },
};

/**
 * The /review link opens AS a popup: dimmed backdrop, one card, one giant
 * gold button into Google's write-a-review dialog for the Summit profile.
 * Mobile-first — the card pops in bottom-center with full-width tap targets.
 */
export default function ReviewPage() {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#0b0e17]">
      {/* Pop-in animation (kept local — this page has no other JS/CSS needs). */}
      <style>{`
        @keyframes review-pop {
          0% { opacity: 0; transform: translateY(24px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes review-glow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>

      {/* Dimmed, glowing backdrop — reads as "a popup over the site". */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(233,200,120,0.16),transparent_55%)]"
        style={{ animation: "review-glow 600ms ease-out both" }}
      />
      <div aria-hidden className="pointer-events-none fixed inset-0 bg-black/40" />

      <main className="relative z-10 flex min-h-full items-center justify-center p-4 sm:p-6">
        <section
          aria-label="Leave Summit a Google review"
          className="w-full max-w-sm rounded-3xl border border-amber-300/20 bg-[#10131f] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.6)] sm:p-8"
          style={{ animation: "review-pop 420ms cubic-bezier(0.16,1,0.3,1) both" }}
        >
          <p className="mono text-[11px] uppercase tracking-[0.28em] text-amber-300/90">
            Summit Systems
          </p>

          <div aria-hidden className="mt-5 text-3xl tracking-[0.28em] text-amber-300 sm:text-4xl">
            ★★★★★
          </div>

          <h1 className="mt-5 text-balance text-2xl font-semibold tracking-tight text-white">
            Enjoying what we built for you?
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            A 30-second Google review helps other business owners find us — and it means
            the world to our team.
          </p>

          <a
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-300 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-amber-200 active:scale-[0.98]"
            href={googleReviewUrl}
          >
            ★ Review us on Google
          </a>

          <p className="mt-4 text-xs text-slate-500">
            Opens Google — sign in with any Google account, tap your stars, done.
          </p>

          <Link
            className="mt-5 inline-block text-xs text-slate-500 underline-offset-4 transition hover:text-slate-300 hover:underline"
            href="/"
          >
            Maybe later — take me to the site
          </Link>
        </section>
      </main>
    </div>
  );
}
