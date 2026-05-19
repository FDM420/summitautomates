"use client";

import { motion } from "framer-motion";

const snapshots = [
  {
    title: "Shared Communication Hub",
    summary:
      "Representative product view for AI-routed WhatsApp queues, live support escalation, and CRM-linked engagement handling.",
    stats: [
      { label: "Live queues", value: "12" },
      { label: "AI handled", value: "68%" },
      { label: "Escalations", value: "07" },
    ],
    activity: [
      "Lead routed to Dubai immigration pipeline",
      "Voice note transcribed and summarized",
      "Support escalation sent to senior agent",
    ],
    tags: ["WhatsApp automation", "Shared inbox", "CRM sync"],
    bars: [82, 64, 91],
    frameTone: "from-cyan-300/14 via-sky-400/10 to-white/5",
  },
  {
    title: "Recruitment Intake Grid",
    summary:
      "Representative product view for candidate screening, document checks, interview orchestration, and hiring funnel visibility.",
    stats: [
      { label: "Screened today", value: "46" },
      { label: "Shortlisted", value: "14" },
      { label: "Flags raised", value: "05" },
    ],
    activity: [
      "CV score pushed to recruiter workspace",
      "Passport expiry detected in intake batch",
      "Interview call summary attached to candidate record",
    ],
    tags: ["CV screening", "Verification", "Lifecycle tracking"],
    bars: [74, 89, 58],
    frameTone: "from-violet-300/14 via-sky-400/8 to-white/5",
  },
  {
    title: "Industrial Reporting Cockpit",
    summary:
      "Representative product view for engineering calculations, standards-aware checks, and technical reporting under operational pressure.",
    stats: [
      { label: "Sites tracked", value: "09" },
      { label: "Reports sent", value: "27" },
      { label: "Exceptions", value: "03" },
    ],
    activity: [
      "Standards validation passed for pump dataset",
      "Field deviation flagged for engineering review",
      "Decision-support summary exported to PDF",
    ],
    tags: ["Engineering AI", "Reporting", "Compliance logic"],
    bars: [67, 83, 76],
    frameTone: "from-amber-300/12 via-cyan-300/8 to-white/5",
  },
];

export function ProductSnapshots() {
  return (
    <section className="section-shell py-20" id="snapshots">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, amount: 0.2 }}
        whileInView={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-3xl space-y-4">
          <span className="eyebrow">Product Snapshots</span>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl lg:text-[3.1rem]">
            Representative system views that add product-level credibility without inventing fake client proof.
          </h2>
          <p className="max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            These live interface compositions behave like screenshots inside the page. They make the offer feel operational and productized while staying honest about what is representative versus client-specific.
          </p>
        </div>
      </motion.div>

      <div className="mt-10 grid gap-6 xl:grid-cols-3">
        {snapshots.map((snapshot, index) => (
          <motion.article
            className="panel-strong rounded-[2.25rem] p-6 sm:p-7"
            initial={{ opacity: 0, y: 28 }}
            key={snapshot.title}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mono text-xs uppercase tracking-[0.22em] text-cyan-200/80">Representative view</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">{snapshot.title}</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">Live UI</span>
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">{snapshot.summary}</p>

            <div
              className={`mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${snapshot.frameTone}`}
            >
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-200/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/80" />
                <span className="mono ml-auto text-[0.68rem] uppercase tracking-[0.22em] text-slate-300">System snapshot</span>
              </div>

              <div className="grid gap-4 p-4">
                <div className="grid grid-cols-3 gap-3">
                  {snapshot.stats.map((stat) => (
                    <div className="rounded-[1.15rem] border border-white/10 bg-[rgba(3,8,18,0.55)] p-3" key={stat.label}>
                      <p className="mono text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                      <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-[84px_minmax(0,1fr)]">
                  <div className="space-y-3">
                    {["Queue", "Agents", "Rules", "Logs"].map((item) => (
                      <div
                        className="rounded-[1rem] border border-white/10 bg-[rgba(3,8,18,0.5)] px-3 py-2 text-center text-xs text-slate-300"
                        key={item}
                      >
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-[1.35rem] border border-white/10 bg-[rgba(3,8,18,0.58)] p-4">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <p className="mono text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">Automation load</p>
                        <span className="text-xs text-slate-300">Realtime view</span>
                      </div>
                      <div className="space-y-3">
                        {snapshot.bars.map((value, barIndex) => (
                          <div key={`${snapshot.title}-${barIndex}`}>
                            <div className="mb-1 flex items-center justify-between text-[0.7rem] text-slate-300">
                              <span>Lane {barIndex + 1}</span>
                              <span className="mono">{value}%</span>
                            </div>
                            <div className="data-bar h-2">
                              <span style={{ width: `${value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.35rem] border border-white/10 bg-[rgba(3,8,18,0.58)] p-4">
                      <p className="mono text-[0.7rem] uppercase tracking-[0.2em] text-slate-400">Activity log</p>
                      <div className="mt-4 space-y-3">
                        {snapshot.activity.map((entry) => (
                          <div className="flex items-start gap-3" key={entry}>
                            <span className="mt-1.5 h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(79,209,255,0.8)]" />
                            <p className="text-sm leading-6 text-slate-200">{entry}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {snapshot.tags.map((tag) => (
                <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs text-slate-200" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}