import { contactEmail } from "@/lib/site-content";
import Image from "next/image";
import Link from "next/link";

const SERVICES = [
  { href: "/services/whatsapp-automation", label: "WhatsApp Automation" },
  { href: "/services/recruitment-hr-automation", label: "Recruitment & HR" },
  { href: "/services/crm-ai-marketing-automation", label: "CRM & AI Marketing" },
  {
    href: "/services/document-verification-security-automation",
    label: "Document & Security",
  },
  { href: "/services/workforce-operations-tracking", label: "Workforce & Ops" },
  { href: "/services/endpoint-device-management", label: "Endpoint & Devices" },
  { href: "/services/forex-trading-automation", label: "Forex & Trading" },
];

const INDUSTRIES = [
  { href: "/industries/recruitment-agencies", label: "Recruitment agencies" },
  { href: "/industries/real-estate", label: "Real estate" },
  { href: "/industries/clinics-and-healthcare", label: "Clinics & healthcare" },
  { href: "/industries/call-centers", label: "Call centers" },
  { href: "/industries", label: "All industries →" },
];

const COMPANY = [
  { href: "/about", label: "About Summit" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of service" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/8 bg-[rgba(3,6,15,0.85)] backdrop-blur-xl">
      <div className="section-shell grid gap-8 py-12 sm:gap-12 sm:py-16 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-10">
        {/* Brand block */}
        <div>
          <Link className="flex items-center gap-3" href="/">
            <Image
              alt="Summit AI Automation"
              className="h-11 w-auto"
              height={549}
              src="/summit-logo-gold.png"
              width={1012}
            />
            <div>
              <p className="text-sm font-medium text-white">Summit AI Automation</p>
              <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">
                Automation Command Center
              </p>
            </div>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-300">
            Summit builds practical AI automation for customer handling, lead management,
            recruitment, document workflows, and operations tracking.
          </p>
          <a
            className="mt-6 inline-block text-sm text-gold-200 transition hover:text-gold-100"
            href={`mailto:${contactEmail}`}
          >
            {contactEmail}
          </a>
        </div>

        {/* Services */}
        <div>
          <h3 className="mono text-xs uppercase tracking-[0.24em] text-gold-200/80">
            Services
          </h3>
          <ul className="mt-5 space-y-3">
            {SERVICES.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-sm text-slate-300 transition hover:text-white"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Industries */}
        <div>
          <h3 className="mono text-xs uppercase tracking-[0.24em] text-gold-200/80">
            Industries
          </h3>
          <ul className="mt-5 space-y-3">
            {INDUSTRIES.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-sm text-slate-300 transition hover:text-white"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="mono text-xs uppercase tracking-[0.24em] text-gold-200/80">
            Company
          </h3>
          <ul className="mt-5 space-y-3">
            {COMPANY.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-sm text-slate-300 transition hover:text-white"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="section-shell flex flex-col items-start justify-between gap-3 py-6 text-xs text-slate-400 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Summit AI Automation Services. All rights reserved.
          </p>
          <p className="mono uppercase tracking-[0.2em]">Built with care · v2026.05</p>
        </div>
      </div>
    </footer>
  );
}
