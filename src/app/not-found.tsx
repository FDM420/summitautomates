import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found | Summit Automates",
  description: "The page you're looking for doesn't exist. Browse our services, industries, or insights instead.",
  robots: { index: false, follow: true },
};

const QUICK_LINKS = [
  { href: "/services", label: "Services", description: "Five connected automation services." },
  { href: "/industries", label: "Industries", description: "Vertical playbooks." },
  { href: "/insights", label: "Insights", description: "Field notes from production builds." },
  { href: "/contact", label: "Contact", description: "Book a discovery call." },
];

export default function NotFound() {
  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(79,209,255,0.16),transparent_60%)]" />

      <SiteHeader />

      <main className="relative z-10 pb-16 sm:pb-20">
        <section className="section-shell pt-16 sm:pt-24 lg:pt-32">
          <p className="mono text-sm uppercase tracking-[0.32em] text-cyan-200/80">404</p>
          <h1 className="mt-6 text-balance text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-[5rem]">
            That page is off-grid.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            The page you tried to reach doesn't exist — moved, renamed, or never was. Here are the
            places worth heading next.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {QUICK_LINKS.map((link) => (
              <Link
                className="panel group rounded-[1.8rem] p-6 transition hover:-translate-y-1 hover:border-cyan-300/30"
                href={link.href}
                key={link.href}
              >
                <p className="text-lg font-semibold text-white">{link.label}</p>
                <p className="mt-3 text-sm leading-6 text-slate-300">{link.description}</p>
                <p className="mt-5 text-sm text-cyan-200 transition group-hover:translate-x-1">
                  Go →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
