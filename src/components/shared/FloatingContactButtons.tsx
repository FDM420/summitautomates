"use client";

import { usePathname } from "next/navigation";
import { LiveAgentButton } from "./LiveAgentButton";
import { WhatsAppButton } from "./WhatsAppButton";

/**
 * Public-site floating contact buttons. Hidden inside the CRM admin (/admin),
 * where a "chat with us" button makes no sense.
 */
export function FloatingContactButtons() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <>
      <LiveAgentButton />
      <WhatsAppButton />
    </>
  );
}
