import { db } from "@/lib/db";
import { webhookDebug } from "@/lib/db/schema";

/**
 * Record a raw webhook hit for diagnostics. Best-effort — never throws, so it
 * can't affect webhook delivery. Query the `webhook_debug` table to see whether
 * Meta is actually calling us and whether signatures pass.
 */
export async function recordWebhookHit(input: {
  source: string;
  method: string;
  sigPresent: boolean;
  sigValid: boolean | null;
  summary: string;
  bodyPreview: string;
}): Promise<void> {
  try {
    await db.insert(webhookDebug).values({
      source: input.source,
      method: input.method,
      sigPresent: input.sigPresent,
      sigValid: input.sigValid,
      summary: input.summary.slice(0, 500),
      bodyPreview: input.bodyPreview.slice(0, 1000),
    });
  } catch (error) {
    console.error("[webhook-debug] record failed:", error);
  }
}

/** One-line summary of a WhatsApp/Meta webhook body for the debug ledger. */
export function summarizeMetaBody(raw: string): string {
  try {
    const p = JSON.parse(raw);
    const parts: string[] = [];
    for (const entry of p.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const v = change.value ?? {};
        if (change.field) parts.push(`field=${change.field}`);
        if (v.messages) parts.push(`messages=${v.messages.length}`);
        if (v.statuses) parts.push(`statuses=${v.statuses.length}`);
        if (v.leadgen_id) parts.push("leadgen");
      }
    }
    return parts.join(" ") || `object=${p.object ?? "?"}`;
  } catch {
    return "unparseable";
  }
}
