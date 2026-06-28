"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  GraduationCap,
  HeartPulse,
  Headphones,
  HomeIcon,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Industry = {
  name: string;
  blurb: string;
  Icon: LucideIcon;
};

const INDUSTRIES: Industry[] = [
  {
    name: "Recruitment Agencies",
    blurb: "CV intake, candidate pipelines, verification, and onboarding handoff.",
    Icon: Briefcase,
  },
  {
    name: "Call Centers & Support",
    blurb: "Voice agents, shared inboxes, call summaries, and reply routing.",
    Icon: Headphones,
  },
  {
    name: "Real Estate",
    blurb: "Lead capture across channels, follow-up reminders, and listing operations.",
    Icon: HomeIcon,
  },
  {
    name: "Clinics & Healthcare",
    blurb: "Appointment reminders, document handling, and patient communication.",
    Icon: HeartPulse,
  },
  {
    name: "Schools & Training",
    blurb: "Enrollment intake, document verification, and parent communication.",
    Icon: GraduationCap,
  },
  {
    name: "Service Businesses",
    blurb: "Booking flow, dispatch, customer comms, and daily reporting.",
    Icon: Wrench,
  },
  {
    name: "Field & Logistics Teams",
    blurb: "GPS attendance, route tracking, daily reports, and supervisor alerts.",
    Icon: Truck,
  },
  {
    name: "Enterprise Operations",
    blurb: "Approvals, audit trails, role-based access, and internal monitoring.",
    Icon: Building2,
  },
];

export function IndustriesSection() {
  return (
    <section className="section-shell py-20 sm:py-24" id="industries">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <span className="eyebrow">Industries We Serve</span>
        <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-white sm:text-5xl">
          Built for teams that grew faster than their tools.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          The systems below ship across very different industries — but the operational pattern
          (messages, leads, documents, people, status) is the same. We translate that pattern
          into your context.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INDUSTRIES.map((industry, i) => (
          <motion.div
            className="glass-card p-5"
            data-accent="gold"
            initial={{ opacity: 0, y: 18 }}
            key={industry.name}
            style={{ borderRadius: "1.25rem" }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.04 }}
            viewport={{ once: true, amount: 0.3 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-gold-200">
                <industry.Icon className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-semibold text-white">{industry.name}</h3>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-300">{industry.blurb}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
