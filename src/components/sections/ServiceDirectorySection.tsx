"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AnimatedSvgIllustration } from "../directory/AnimatedSvgIllustration";
import { ServiceCardLarge, type MetricPill } from "../directory/ServiceCardLarge";
import { SERVICE_MODULES } from "@/lib/services-config";

type CardSpec = {
  metrics: [MetricPill, MetricPill];
  bullets: [string, string, string];
};

const CARD_SPECS: Record<string, CardSpec> = {
  "whatsapp-automation": {
    metrics: [
      { label: "Reply coverage", value: "24/7", tone: "green" },
      { label: "Inbox view", value: "1", tone: "blue" },
    ],
    bullets: [
      "Auto replies for common questions",
      "Shared team inbox",
      "Lead sorting and routing",
    ],
  },
  "recruitment-hr-automation": {
    metrics: [
      { label: "CV intake", value: "Auto", tone: "violet" },
      { label: "Hiring stages", value: "Tracked", tone: "blue" },
    ],
    bullets: ["CV screening support", "Candidate tracking", "Interview workflow automation"],
  },
  "crm-ai-marketing-automation": {
    metrics: [
      { label: "Lead visibility", value: "Live", tone: "green" },
      { label: "Follow-up", value: "Tracked", tone: "blue" },
    ],
    bullets: ["Lead capture and assignment", "Follow-up reminders", "Pipeline dashboards"],
  },
  "document-verification-security-automation": {
    metrics: [
      { label: "Checks", value: "Automated", tone: "cyan" },
      { label: "Logs", value: "Tracked", tone: "violet" },
    ],
    bullets: ["OCR and data extraction", "Missing document alerts", "Expiry and compliance checks"],
  },
  "workforce-operations-tracking": {
    metrics: [
      { label: "Attendance", value: "Verified", tone: "green" },
      { label: "Reports", value: "Daily", tone: "blue" },
    ],
    bullets: ["Attendance and shift tracking", "GPS and location checks", "Daily operations reports"],
  },
};


export function ServiceDirectorySection() {
  return (
    <section className="section-shell py-20 sm:py-24" id="services">
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="eyebrow">Explore Our Services</span>
          <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
            Service Directory.
          </h2>
          <p className="text-base leading-7 text-slate-300 sm:text-lg">
            Five connected systems on a shared automation core. Each card opens its full
            discovery path with live workflow views and case-style proof.
          </p>
        </div>
        <Link
          className="inline-flex items-center gap-1 text-sm font-medium text-cyan-200 transition hover:text-cyan-100"
          href="/services"
        >
          View all services
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 flex flex-col gap-8">
        {SERVICE_MODULES.map((module, i) => {
          const spec = CARD_SPECS[module.slug];
          if (!spec) return null;
          return (
            <ServiceCardLarge
              bullets={spec.bullets}
              illustration={<AnimatedSvgIllustration slug={module.slug} />}
              index={i}
              key={module.slug}
              metrics={spec.metrics}
              module={module}
            />
          );
        })}
      </div>
    </section>
  );
}
