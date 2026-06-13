"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Snapshot = {
  label: string;
  items: string[];
};

const BEFORE: Snapshot = {
  label: "Before Summit",
  items: [
    "Customer chats scattered across staff phones and personal inboxes",
    "Leads forgotten because follow-up lives in someone's head",
    "CV piles, missing documents, and email threads driving hiring",
    "Daily reports built manually in spreadsheets at midnight",
    "Compliance flags discovered only when a customer complains",
  ],
};

const AFTER: Snapshot = {
  label: "After Summit",
  items: [
    "One shared inbox, AI replies first, humans handle what matters",
    "Leads captured, routed, and chased automatically with clear ownership",
    "AI screening, document checks, and a tracked hiring pipeline",
    "Operations dashboards auto-built from real activity, not memory",
    "Audit trails and exception queues running by default",
  ],
};

export function BeforeAfterSection() {
  const [view, setView] = useState<"before" | "after" | "both">("both");

  return (
    <section className="section-shell py-20 sm:py-24" id="impact">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <span className="eyebrow">Operational Impact</span>
        <h2 className="text-balance text-4xl font-semibold tracking-[-0.045em] text-ink sm:text-5xl">
          Before Summit vs. After Summit.
        </h2>
        <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
          The same business — same revenue, same team — but the day-to-day operating picture is
          completely different.
        </p>

        <div className="mt-2 inline-flex gap-1 rounded-full border border-hair bg-overlay p-1">
          {(["before", "both", "after"] as const).map((v) => (
            <button
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                view === v ? "bg-overlay-strong text-ink" : "text-ink/55 hover:text-ink"
              }`}
              key={v}
              onClick={() => setView(v)}
              type="button"
            >
              {v === "both" ? "Compare" : v === "before" ? "Before" : "After"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {(view === "before" || view === "both") && (
          <motion.div
            className="glass-card flex flex-col gap-4 p-7"
            data-accent="gold"
            initial={{ opacity: 0, x: -20 }}
            style={{ borderRadius: "1.5rem" }}
            transition={{ duration: 0.55, ease: EASE }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-amber-300/30 bg-amber-300/10 text-amber-600 dark:text-amber-200">
                <XCircle className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-semibold text-ink">{BEFORE.label}</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {BEFORE.items.map((item) => (
                <li className="flex gap-3 text-sm leading-6 text-muted" key={item}>
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300/60" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {(view === "after" || view === "both") && (
          <motion.div
            className="glass-card flex flex-col gap-4 p-7"
            data-accent="teal"
            initial={{ opacity: 0, x: 20 }}
            style={{ borderRadius: "1.5rem" }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 text-emerald-600 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <h3 className="text-xl font-semibold text-ink">{AFTER.label}</h3>
            </div>
            <ul className="flex flex-col gap-3">
              {AFTER.items.map((item) => (
                <li className="flex gap-3 text-sm leading-6 text-muted" key={item}>
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
}
