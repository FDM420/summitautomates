"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import type { ServicePageConfig } from "@/lib/service-pages";
import { serviceProofs } from "@/lib/service-proofs";
import { ContactFlow } from "./contact-flow";
import { CrmMarketingServiceHeroCard } from "./service-heroes/CrmMarketingServiceHeroCard";
import { DocSecurityServiceHeroCard } from "./service-heroes/DocSecurityServiceHeroCard";
import { EndpointServiceHeroCard } from "./service-heroes/EndpointServiceHeroCard";
import { ForexServiceHeroCard } from "./service-heroes/ForexServiceHeroCard";
import { RecruitmentServiceHeroCard } from "./service-heroes/RecruitmentServiceHeroCard";
import { ServiceHero } from "./service-heroes/ServiceHero";
import { WhatsappServiceHeroCard } from "./service-heroes/WhatsappServiceHeroCard";
import { WorkforceServiceHeroCard } from "./service-heroes/WorkforceServiceHeroCard";
import { SiteFooter } from "./shared/SiteFooter";
import { SiteHeader } from "./shared/SiteHeader";

function ServiceExplainerIcon({ type }: { type: "inputs" | "process" | "outputs" | "benefits" }) {
  return (
    <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-gold-300/20 bg-gold-300/10 text-gold-100">
      {type === "inputs" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="M4 7h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M7 12h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M10 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      ) : null}
      {type === "process" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="m11 6 6 6-6 6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <circle cx="7" cy="12" fill="currentColor" r="1.5" />
        </svg>
      ) : null}
      {type === "outputs" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <rect height="10" rx="1.8" stroke="currentColor" strokeWidth="1.8" width="14" x="5" y="7" />
          <path d="M9 11h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M9 14h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      ) : null}
      {type === "benefits" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="m12 4 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L12 4Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
        </svg>
      ) : null}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-[3.1rem]">
        {title}
      </h2>
      <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">{description}</p>
    </div>
  );
}

function ServiceLivePanel({ service }: { service: ServicePageConfig }) {
  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const activeMode = service.liveModes[activeModeIndex];
  const nodePositions = [
    { x: 62, y: 145 },
    { x: 180, y: 88 },
    { x: 332, y: 195 },
    { x: 512, y: 96 },
    { x: 654, y: 150 },
  ];

  return (
    <motion.div
      className="panel-strong rounded-[2.5rem] p-6 sm:p-8"
      initial={{ opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
      viewport={{ once: true, amount: 0.2 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mono text-xs uppercase tracking-[0.24em] text-gold-200/80">Interactive Service View</p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em] text-white">
            Live workflow view for {service.navTitle.toLowerCase()}.
          </h2>
        </div>
        <div className="flex flex-wrap gap-2 rounded-full border border-white/10 bg-white/5 p-1">
          {service.liveModes.map((mode, index) => (
            <button
              className={`rounded-full px-3 py-2 text-xs transition sm:px-4 ${
                index === activeModeIndex
                  ? "bg-gold-300 text-slate-950"
                  : "text-slate-300 hover:bg-white/8 hover:text-white"
              }`}
              key={mode.label}
              onClick={() => setActiveModeIndex(index)}
              type="button"
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.92fr)]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(6,12,28,0.96),rgba(8,18,40,0.92))] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Interactive vector map</p>
              <p className="mt-2 text-lg text-slate-200">{activeMode.summary}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              Live feel
            </span>
          </div>

          <svg className="mt-6 h-[320px] w-full" fill="none" viewBox="0 0 720 260">
            <defs>
              <linearGradient id="service-flow-gradient" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#f4dd95" />
                <stop offset="100%" stopColor="#c79a4e" />
              </linearGradient>
            </defs>

            {[0, 1, 2, 3].map((index) => {
              const start = nodePositions[index];
              const end = nodePositions[index + 1];
              const controlX = (start.x + end.x) / 2;
              const controlY = Math.min(start.y, end.y) - 48;
              const isActive = index < activeMode.activePipelineIndex;

              return (
                <path
                  d={`M ${start.x} ${start.y} Q ${controlX} ${controlY} ${end.x} ${end.y}`}
                  key={`${start.x}-${end.x}`}
                  opacity={isActive ? 1 : 0.24}
                  stroke="url(#service-flow-gradient)"
                  strokeLinecap="round"
                  strokeWidth={isActive ? 6 : 3}
                />
              );
            })}

            {nodePositions.map((node, index) => {
              const isActive = index <= activeMode.activePipelineIndex;
              return (
                <g key={`${node.x}-${node.y}`}>
                  <motion.circle
                    animate={{ r: isActive ? 16 : 13 }}
                    cx={node.x}
                    cy={node.y}
                    fill={isActive ? "#f4dd95" : "rgba(255,255,255,0.12)"}
                    initial={false}
                  />
                  <circle cx={node.x} cy={node.y} fill="#03050d" r="6" />
                  <text
                    fill="#eef7ff"
                    fontFamily="var(--font-mono)"
                    fontSize="12"
                    textAnchor="middle"
                    x={node.x}
                    y={node.y + 42}
                  >
                    {activeMode.pipeline[index]}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {activeMode.metrics.map((metric) => (
              <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4" key={metric.label}>
                <p className="mono text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="panel rounded-[1.8rem] p-5">
            <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Activity log</p>
            <div className="mt-4 space-y-3">
              {activeMode.activity.map((entry) => (
                <div className="flex items-start gap-3" key={entry}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_12px_rgba(233,200,120,0.8)]" />
                  <p className="text-sm leading-6 text-slate-200">{entry}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel rounded-[1.8rem] p-5">
            <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Live service bars</p>
            <div className="mt-4 space-y-4">
              {activeMode.bars.map((bar) => (
                <div key={bar.label}>
                  <div className="mb-2 flex items-center justify-between gap-4 text-sm text-slate-200">
                    <span>{bar.label}</span>
                    <span className="mono text-gold-200">{bar.value}%</span>
                  </div>
                  <div className="data-bar h-2.5">
                    <span style={{ width: `${bar.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DiscoveryStripIcon({ type }: { type: "tools" | "plan" | "route" }) {
  return (
    <span className="flex h-10 w-10 items-center justify-center rounded-[1rem] border border-gold-300/20 bg-gold-300/10 text-gold-100">
      {type === "tools" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="M4 7h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M7 12h10" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M10 17h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      ) : null}
      {type === "plan" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="M6 5h12v14H6z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
          <path d="M9 9h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M9 13h6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      ) : null}
      {type === "route" ? (
        <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
          <path d="M6 18c0-3 2-5 5-5h7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
          <path d="M14 7h4v4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          <circle cx="6" cy="18" fill="currentColor" r="1.5" />
          <circle cx="18" cy="7" fill="currentColor" r="1.5" />
        </svg>
      ) : null}
    </span>
  );
}

function PostProofCtaStrip({ service }: { service: ServicePageConfig }) {
  const stripSignals = [
    {
      title: "Current tools first",
      description: "We review the systems you already use before suggesting a rollout.",
      type: "tools" as const,
    },
    {
      title: "Clear next-step plan",
      description: "You get a simpler view of the first workflow, milestones, and ownership.",
      type: "plan" as const,
    },
    {
      title: "Fastest route",
      description: "Use the discovery path below to move this service into the right next conversation.",
      type: "route" as const,
    },
  ];

  return (
    <section className="section-shell py-10">
      <motion.div
        className="panel-strong rounded-[2.25rem] p-6 sm:p-8"
        initial={{ opacity: 0, y: 28 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.92fr)] lg:items-center">
          <div>
            <p className="mono text-xs uppercase tracking-[0.24em] text-gold-200/80">Ready For The Next Step</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
              If this looks like your workflow, start discovery now.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              We can review {service.contactFocus.toLowerCase()}, your current tools, and the fastest rollout path for
              your team before you commit to a build.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                className="rounded-full bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(233,200,120,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
                href="#contact"
              >
                Start Discovery
              </a>
              <Link
                className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 active:scale-[0.99]"
                href="/services"
              >
                Compare Services
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {stripSignals.map((signal) => (
              <div className="panel rounded-[1.6rem] p-4 transition hover:-translate-y-1 hover:border-gold-300/25" key={signal.title}>
                <div className="flex items-start gap-3">
                  <DiscoveryStripIcon type={signal.type} />
                  <div>
                    <p className="text-base font-semibold text-white">{signal.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{signal.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function ServiceHeroCardBySlug({ service }: { service: ServicePageConfig }) {
  switch (service.slug) {
    case "whatsapp-automation":
      return <WhatsappServiceHeroCard />;
    case "recruitment-hr-automation":
      return <RecruitmentServiceHeroCard />;
    case "crm-ai-marketing-automation":
      return <CrmMarketingServiceHeroCard />;
    case "document-verification-security-automation":
      return <DocSecurityServiceHeroCard />;
    case "workforce-operations-tracking":
      return <WorkforceServiceHeroCard />;
    case "endpoint-device-management":
      return <EndpointServiceHeroCard />;
    case "forex-trading-automation":
      return <ForexServiceHeroCard />;
    default:
      return (
        <ServiceHero
          description={service.heroDescription}
          slug={service.slug}
          title={service.heroTitle}
        />
      );
  }
}

export function ServiceLandingClient({
  service,
  relatedServices,
}: {
  service: ServicePageConfig;
  relatedServices: ServicePageConfig[];
}) {
  const proofBlocks = serviceProofs[service.slug] ?? [];

  return (
    <div className="relative overflow-x-clip">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(233,200,120,0.16),transparent_60%)]" />

      <SiteHeader />

      <main className="relative z-10 pb-16 sm:pb-20">
        <section className="section-shell pt-8">
          <nav aria-label="Breadcrumb" className="mono flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <Link className="hover:text-slate-200" href="/">Home</Link>
            <span>/</span>
            <Link className="hover:text-slate-200" href="/services">Services</Link>
            <span>/</span>
            <span className="text-slate-200">{service.navTitle}</span>
          </nav>
        </section>

        <ServiceHeroCardBySlug service={service} />

        <section className="section-shell py-16" id="workflow">
          <ServiceLivePanel service={service} />
        </section>

        <section className="section-shell py-20">
          <SectionHeading
            eyebrow="What This Solves"
            title="Business problems this service helps fix in simple words."
            description="These pages are written for managers and owners who care about practical results, not technical jargon."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {service.problemCards.map((problem, index) => (
              <motion.article
                className="panel rounded-[2rem] p-6"
                initial={{ opacity: 0, y: 28 }}
                key={problem.title}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -6, borderColor: "rgba(233, 200, 120, 0.35)" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="mono text-xs uppercase tracking-[0.22em] text-slate-400">Problem {String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">{problem.title}</h2>
                <p className="mt-4 text-base leading-7 text-slate-300">{problem.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-shell py-20">
          <SectionHeading
            eyebrow="What You Are Buying"
            title="What goes in, how the workflow processes it, and what your team gets back."
            description="This section makes the service concrete for non-technical buyers by showing the inputs, processing logic, outputs, and business value in plain language."
          />

          <div className="mt-10 grid gap-5 xl:grid-cols-2">
            {service.explainerCards.map((card, index) => (
              <motion.article
                className="panel rounded-[2rem] p-6 transition hover:border-gold-300/25 hover:-translate-y-1"
                initial={{ opacity: 0, y: 28 }}
                key={card.title}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start gap-4">
                  <ServiceExplainerIcon type={card.type} />
                  <div>
                    <p className="mono text-xs uppercase tracking-[0.22em] text-slate-400">
                      {card.type === "inputs" ? "Inputs" : null}
                      {card.type === "process" ? "Processing" : null}
                      {card.type === "outputs" ? "Outputs" : null}
                      {card.type === "benefits" ? "Benefits" : null}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{card.title}</h2>
                  </div>
                </div>

                <p className="mt-4 text-base leading-7 text-slate-300">{card.description}</p>

                <div className="mt-6 space-y-3">
                  {card.bullets.map((bullet) => (
                    <div className="flex items-start gap-3" key={bullet}>
                      <span className="mt-2 h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_12px_rgba(233,200,120,0.8)]" />
                      <p className="text-sm leading-7 text-slate-200">{bullet}</p>
                    </div>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-shell py-20">
          <SectionHeading
            eyebrow="How It Works"
            title="A simple step-by-step view of how the service works."
            description="This breaks the service into a clear journey from input to result so non-technical buyers can follow the logic easily."
          />

          <div className="mt-10 grid gap-5 xl:grid-cols-4">
            {service.workflowSteps.map((step, index) => (
              <motion.article
                className="panel rounded-[2rem] p-6"
                initial={{ opacity: 0, y: 28 }}
                key={step.title}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
                viewport={{ once: true, amount: 0.2 }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="mono text-xs uppercase tracking-[0.22em] text-slate-400">Step {index + 1}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{step.description}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {proofBlocks.length > 0 ? (
          <>
            <section className="section-shell py-20">
              <SectionHeading
                eyebrow="Proof and Outcomes"
                title="Representative case patterns and live-style proof blocks for this service."
                description="These proof panels are written as realistic service examples so buyers can see the kind of outcomes, operator views, and management signals Summit typically builds."
              />

              <div className="mt-10 grid gap-6 xl:grid-cols-2">
                {proofBlocks.map((proof, index) => (
                  <motion.article
                    className="panel-strong rounded-[2.25rem] p-6 sm:p-8"
                    initial={{ opacity: 0, y: 28 }}
                    key={proof.title}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
                    viewport={{ once: true, amount: 0.2 }}
                    whileInView={{ opacity: 1, y: 0 }}
                  >
                    <p className="mono text-xs uppercase tracking-[0.22em] text-gold-200/80">{proof.eyebrow}</p>
                    <h2 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.04em] text-white">{proof.title}</h2>
                    <p className="mt-4 text-base leading-7 text-slate-300">{proof.summary}</p>

                    <div className="mt-6 grid gap-3">
                      {proof.outcomes.map((outcome) => (
                        <div className="panel rounded-[1.45rem] px-4 py-4" key={outcome}>
                          <p className="text-sm leading-7 text-slate-100">{outcome}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {proof.metrics.map((metric) => (
                        <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4" key={metric.label}>
                          <p className="mono text-[0.68rem] uppercase tracking-[0.2em] text-slate-400">{metric.label}</p>
                          <p className="mt-3 text-2xl font-semibold text-white">{metric.value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.84fr)]">
                      <div className="panel rounded-[1.8rem] p-5">
                        <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Outcome bars</p>
                        <div className="mt-4 space-y-4">
                          {proof.bars.map((bar) => (
                            <div key={bar.label}>
                              <div className="mb-2 flex items-center justify-between gap-4 text-sm text-slate-200">
                                <span>{bar.label}</span>
                                <span className="mono text-gold-200">{bar.value}%</span>
                              </div>
                              <div className="data-bar h-2.5">
                                <span style={{ width: `${bar.value}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="panel rounded-[1.8rem] p-5">
                        <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Activity feed</p>
                        <div className="mt-4 space-y-3">
                          {proof.activity.map((entry) => (
                            <div className="flex items-start gap-3" key={entry}>
                              <span className="mt-2 h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_12px_rgba(233,200,120,0.8)]" />
                              <p className="text-sm leading-6 text-slate-200">{entry}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <PostProofCtaStrip service={service} />
          </>
        ) : null}

        <section className="section-shell py-20">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.82fr)]">
            <div className="panel-strong rounded-[2.25rem] p-6 sm:p-8">
              <p className="eyebrow">What You Get</p>
              <h2 className="mt-6 text-balance text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
                Practical deliverables, not vague promises.
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {service.deliverables.map((item) => (
                  <div className="panel rounded-[1.5rem] px-4 py-4" key={item}>
                    <div className="flex items-start gap-3">
                      <span className="mt-1 flex h-8 w-8 items-center justify-center rounded-full border border-gold-300/20 bg-gold-300/10 text-gold-100">
                        <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <path d="m7 12 3 3 7-7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
                        </svg>
                      </span>
                      <p className="text-base text-slate-100">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel-strong rounded-[2.25rem] p-6 sm:p-8">
              <p className="mono text-xs uppercase tracking-[0.22em] text-gold-200/80">Good Fit Industries</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Teams that commonly need this service.</h2>
              <div className="mt-8 flex flex-wrap gap-3">
                {service.industries.map((industry) => (
                  <span
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-slate-100"
                    key={industry}
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section-shell py-20" id="faq">
          <SectionHeading
            eyebrow="Simple FAQ"
            title="Common questions from non-technical buyers."
            description="These answers help clients understand the service without needing technical background or AI knowledge."
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {service.faqs.map((item, index) => (
              <motion.article
                className="panel rounded-[2rem] p-6"
                initial={{ opacity: 0, y: 28 }}
                key={item.question}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4, borderColor: "rgba(233, 200, 120, 0.28)" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <p className="mono text-xs uppercase tracking-[0.22em] text-slate-400">Question {index + 1}</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">{item.question}</h3>
                <p className="mt-4 text-base leading-7 text-slate-300">{item.answer}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="section-shell py-20">
          <SectionHeading
            eyebrow="Related Services"
            title="Explore related services."
            description="These internal links strengthen crawl paths and help buyers compare nearby solutions without leaving the Summit ecosystem."
          />

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {relatedServices.map((relatedService) => (
              <Link
                className="panel rounded-[2rem] p-6 transition hover:border-gold-300/25 hover:-translate-y-1"
                href={`/services/${relatedService.slug}`}
                key={relatedService.slug}
              >
                <p className="mono text-xs uppercase tracking-[0.22em] text-slate-400">Related service</p>
                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-white">{relatedService.cardTitle}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{relatedService.metaDescription}</p>
              </Link>
            ))}
          </div>
        </section>

        <ContactFlow
          description={`Use the fastest route below to start discovery for ${service.navTitle.toLowerCase()} with Summit.`}
          eyebrow="Start Discovery"
          presetFocus={service.contactFocus}
          submitLabel="Open Discovery Form"
          title={`Start discovery for ${service.navTitle.toLowerCase()}.`}
        />
      </main>

      <SiteFooter />
    </div>
  );
}