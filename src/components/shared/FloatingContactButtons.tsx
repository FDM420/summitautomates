"use client";

import { usePathname } from "next/navigation";
import { SiteAssistant } from "./SiteAssistant";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Public-site floating contact buttons. Hidden inside the CRM admin (/admin),
 * where a "chat with us" button makes no sense. The AI chat widget replaces the
 * old standalone live-agent link — the human handoff now lives inside it.
 */
export function FloatingContactButtons() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <>
      <SiteAssistant />
      <WhatsAppButton />
    </>
  );
}
