"use client";

import { motion } from "framer-motion";
import { contactEmail } from "@/lib/site-content";

const configuredFormUrl = process.env.NEXT_PUBLIC_CRM_FORM_URL?.trim();
const configuredFormEmbedUrl = process.env.NEXT_PUBLIC_CRM_FORM_EMBED_URL?.trim();
const configuredCalendarUrl = process.env.NEXT_PUBLIC_CALENDAR_URL?.trim();
const hasLiveForm = Boolean(configuredFormUrl);
const hasEmbeddedForm = Boolean(configuredFormEmbedUrl);
const hasExternalCalendar = Boolean(configuredCalendarUrl);

const fitSignals = [
  "You need AI handling for support, sales, or WhatsApp intake.",
  "You want recruitment, HR, or document verification workflows automated.",
  "You need dashboards, approvals, and internal enterprise operations stitched together.",
  "You need industrial, technical, or reporting-heavy workflows digitized with AI support.",
];

const intakeChecklist = [
  "Your company name and the team that needs help.",
  "The business problem in simple words.",
  "Any systems involved, such as WhatsApp, CRM, HR, or operations tools.",
  "Your expected timeline and how urgent the project is.",
];

type ContactFlowProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  presetFocus?: string;
  submitLabel?: string;
};

export function ContactFlow({
  eyebrow = "Tell Us The Problem",
  title = "Start discovery with a live intake form or booking link.",
  description = "Use the fastest route below to move this request into Summit's discovery process.",
  presetFocus = "",
  submitLabel = "Open Discovery Form",
}: ContactFlowProps) {
  const focusLabel = presetFocus || "Automation project intake";
  const fallbackEmailHref = `mailto:${contactEmail}?subject=${encodeURIComponent(`Summit discovery | ${focusLabel}`)}&body=${encodeURIComponent(
    [
      "Hi Summit,",
      "",
      `I want to discuss ${focusLabel.toLowerCase()}.`,
      "",
      "Company:",
      "Main problem:",
      "Current tools:",
      "Timeline:",
      "",
      "Thanks,",
    ].join("\n"),
  )}`;
  const primaryHref = configuredFormUrl || configuredCalendarUrl || fallbackEmailHref;
  const primaryLabel = hasLiveForm ? submitLabel : hasExternalCalendar ? "Open Discovery Calendar" : "Email for Discovery";
  const hasPrimaryAction = Boolean(primaryHref);
  const hasLivePrimaryAction = hasLiveForm || hasExternalCalendar;
  const primaryIsExternalUrl = primaryHref.startsWith("http://") || primaryHref.startsWith("https://");
  const statusLabel = hasLiveForm
    ? "Live CRM form"
    : hasExternalCalendar
      ? "Live discovery calendar"
      : "Fallback email route";

  return (
    <section className="section-shell py-12 sm:py-16 lg:py-20" id="contact">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.98fr)]">
        <motion.div
          className="panel-strong rounded-[2.25rem] p-6 sm:p-8"
          initial={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, amount: 0.2 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl sm:tracking-[-0.05em] md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
            {description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="panel rounded-[1.8rem] p-5">
              <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Service focus</p>
              <p className="mt-3 text-lg font-semibold text-white">{presetFocus || "Automation project intake"}</p>
            </div>
            <div className="panel rounded-[1.8rem] p-5">
              <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Endpoint status</p>
              <p className="mt-3 text-lg font-semibold text-white">{statusLabel}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {hasPrimaryAction ? (
              <a
                className="rounded-full bg-gradient-to-r from-gold-200 via-gold-400 to-gold-500 px-6 py-3 text-center text-sm font-semibold text-slate-950 shadow-[0_18px_50px_rgba(233,200,120,0.25)] transition hover:scale-[1.02] active:scale-[0.99]"
                href={primaryHref}
                rel={primaryIsExternalUrl ? "noreferrer" : undefined}
                target={primaryIsExternalUrl ? "_blank" : undefined}
              >
                {primaryLabel}
              </a>
            ) : (
              <button
                className="cursor-not-allowed rounded-full border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-slate-400"
                disabled
                type="button"
              >
                {primaryLabel}
              </button>
            )}

            {hasLiveForm && hasExternalCalendar ? (
              <a
                className="rounded-full border border-white/12 bg-white/6 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 active:scale-[0.99]"
                href={configuredCalendarUrl}
                rel="noreferrer"
                target="_blank"
              >
                Open Discovery Calendar
              </a>
            ) : null}
          </div>

          <p className="mt-4 text-sm text-slate-300">
            {hasLivePrimaryAction
              ? "This CTA now routes to a live external intake or booking endpoint instead of a prefilled email draft."
              : "A live form or calendar is not configured yet, so the primary CTA falls back to a ready-to-send discovery email."}
          </p>

          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
            <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">What to prepare before you click through</p>
            <div className="mt-4 space-y-3">
              {intakeChecklist.map((item) => (
                <div className="flex items-start gap-3" key={item}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_12px_rgba(233,200,120,0.8)]" />
                  <p className="text-sm leading-7 text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          className="panel-strong rounded-[2.25rem] p-6 sm:p-8"
          initial={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
          viewport={{ once: true, amount: 0.2 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {hasEmbeddedForm ? (
            <>
              <p className="mono text-xs uppercase tracking-[0.22em] text-gold-200/80">Embedded CRM Form</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">Live intake form</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                This embedded form sends the request directly into the connected CRM workflow.
              </p>
              <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-white/10 bg-[rgba(6,12,28,0.96)]">
                <iframe
                  className="h-[620px] w-full"
                  loading="lazy"
                  src={configuredFormEmbedUrl}
                  title="Summit AI live CRM intake form"
                />
              </div>
            </>
          ) : (
            <>
              <p className="mono text-xs uppercase tracking-[0.22em] text-gold-200/80">Live Intake Guidance</p>
              <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white">
                {hasLiveForm
                  ? "Open the live CRM form to send this opportunity into Summit's pipeline."
                  : hasExternalCalendar
                    ? "Use the live calendar to book the discovery session directly."
                    : "Use the discovery email fallback while the live endpoint is being configured."}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {hasLiveForm
                  ? "The primary CTA above opens the live external intake form. If you also configure a booking link, visitors can choose either route."
                  : hasExternalCalendar
                    ? "The primary CTA above opens the live booking endpoint, which is useful when you want immediate discovery calls instead of email handoff."
                    : "No live CRM form or booking endpoint is configured in the workspace yet, so visitors can still start discovery through a prefilled email route instead of hitting a dead-end state."}
              </p>

              <div className="mt-8 grid gap-4">
                <div className="panel rounded-[1.6rem] px-5 py-4">
                  <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Primary path</p>
                  <p className="mt-2 text-lg font-semibold text-white">{statusLabel}</p>
                </div>
                <div className="panel rounded-[1.6rem] px-5 py-4">
                  <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Direct contact</p>
                  <a
                    className="mt-2 inline-flex break-all text-lg font-semibold text-white transition hover:text-gold-100 hover:underline"
                    href={`mailto:${contactEmail}`}
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>
            </>
          )}

          <div className="mt-8 rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
            <p className="mono text-xs uppercase tracking-[0.2em] text-slate-400">Good Fit Signals</p>
            <div className="mt-4 space-y-3">
              {fitSignals.map((signal) => (
                <div className="flex items-start gap-3" key={signal}>
                  <span className="mt-2 h-2 w-2 rounded-full bg-gold-300 shadow-[0_0_12px_rgba(233,200,120,0.8)]" />
                  <p className="text-sm leading-7 text-slate-200">{signal}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}