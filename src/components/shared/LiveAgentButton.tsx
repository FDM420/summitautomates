import { liveAgentNumber } from "@/lib/site-content";

const prefilledMessage = "Hi Summit, I'd like to talk to your live agent.";

/**
 * Floating "Talk to our Live Agent" button, shown on every page.
 *
 * Opens a WhatsApp chat with the dedicated Cloud API number, which is answered
 * automatically by the webhook (AI/auto reply) once the number is registered.
 * Rendered once in the root layout, stacked just above the WhatsAppButton.
 * Plain anchor — no client JS, renders as static HTML.
 */
export function LiveAgentButton() {
  const href = `https://wa.me/${liveAgentNumber}?text=${encodeURIComponent(prefilledMessage)}`;

  return (
    <a
      aria-label="Talk to our live agent on WhatsApp"
      className="group fixed bottom-24 right-5 z-50 inline-flex items-center gap-2.5 rounded-full border border-gold-300/30 bg-gradient-to-br from-gold-400 to-gold-600 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_10px_30px_rgba(201,164,74,0.4)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:bottom-28 sm:right-6"
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {/* Live indicator */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>

      {/* Chat / agent icon */}
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>

      <span className="whitespace-nowrap">Talk to our Live Agent</span>
    </a>
  );
}
