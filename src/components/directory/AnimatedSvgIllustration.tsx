"use client";

/**
 * Renders a self-contained animated SVG illustration from /public/illustrations/.
 *
 * The SVG files have built-in SMIL + CSS animations (no JS library needed).
 * Inspired by veevotech.com's approach: each file ~7KB, animates natively in any browser.
 */
const SVG_BY_SLUG: Record<string, string> = {
  "whatsapp-automation": "/illustrations/whatsapp.svg",
  "recruitment-hr-automation": "/illustrations/recruitment.svg",
  "crm-ai-marketing-automation": "/illustrations/crm.svg",
  "document-verification-security-automation": "/illustrations/docsec.svg",
  "workforce-operations-tracking": "/illustrations/workforce.svg",
  "ai-voice-agents": "/illustrations/voice.svg",
};

const ALT_BY_SLUG: Record<string, string> = {
  "whatsapp-automation":
    "Animated diagram of WhatsApp messages flowing into a central automation hub then routing to a team",
  "recruitment-hr-automation":
    "Animated diagram of CVs flowing into an AI hiring hub then routing to interview, document check, and shortlist nodes",
  "crm-ai-marketing-automation":
    "Animated diagram of leads flowing into a CRM hub then fanning out to sales, analytics, and revenue tracking",
  "document-verification-security-automation":
    "Animated diagram of documents flowing through OCR and verification with audit and compliance outputs",
  "workforce-operations-tracking":
    "Animated diagram of GPS pins and attendance check-ins flowing into an operations hub with daily reporting",
  "ai-voice-agents":
    "Animated diagram of live calls, transcript, QA scoring and outcome routing flowing into a central voice AI hub",
};

export function AnimatedSvgIllustration({ slug }: { slug: string }) {
  const src = SVG_BY_SLUG[slug];
  if (!src) return null;
  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={ALT_BY_SLUG[slug] ?? "Service illustration"}
        className="block h-full w-full object-cover"
        src={src}
      />
    </div>
  );
}
