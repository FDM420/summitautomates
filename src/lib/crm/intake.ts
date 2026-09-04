import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  activities,
  contacts,
  identities,
  intakeEvents,
  leads,
} from "@/lib/db/schema";

type IdentityChannel = "whatsapp" | "email" | "phone";
type LeadChannel = "whatsapp" | "web_form" | "email";
type ActivityType = "whatsapp_inbound" | "email_inbound" | "form_submission";

export type IntakeInput = {
  /** Idempotency key, e.g. "wa:<wamid>", "form:<uuid>". */
  eventId: string;
  /** Which lead pipeline the touch belongs to. */
  channel: LeadChannel;
  /** How we identify the person (for dedup). */
  identityChannel: IdentityChannel;
  /** Normalized identity value (E.164 phone / lowercased email). */
  identityValue: string;
  /** Best-effort display name for a new contact. */
  displayName: string;
  /** The inbound message body (logged to the timeline). */
  message?: string;
  /** Optional short summary for the lead row (e.g. AI-extracted). */
  summary?: string;
  /** Raw provider payload, stored on the lead for debugging. */
  rawPayload?: unknown;
  /** Activity type for the timeline entry. */
  activityType: ActivityType;
};

export type IntakeResult = {
  deduped: boolean;
  contactId?: string;
  isNewContact?: boolean;
  leadId?: string;
};

/**
 * Single ingestion path for every inbound touch (WhatsApp, web form, email).
 *
 * 1. Claims the event id (durable idempotency) so provider retries — which hit
 *    different Cloud Run instances — are processed exactly once.
 * 2. Get-or-creates the contact via the identity dedup index.
 * 3. Logs the touch to the activity timeline.
 * 4. Opens a lead if the contact has no open one yet.
 *
 * Never throws for "already seen" — returns { deduped: true } instead.
 */
export async function ingestInboundEvent(
  input: IntakeInput,
): Promise<IntakeResult> {
  // 1. Idempotency claim. If the row already exists, this is a retry.
  const claim = await db
    .insert(intakeEvents)
    .values({ eventId: input.eventId, channel: input.channel })
    .onConflictDoNothing()
    .returning({ eventId: intakeEvents.eventId });
  if (claim.length === 0) return { deduped: true };

  return db.transaction(async (tx) => {
    // 2. Get-or-create contact via identity.
    const existing = await tx
      .select({ contactId: identities.contactId })
      .from(identities)
      .where(
        and(
          eq(identities.channel, input.identityChannel),
          eq(identities.value, input.identityValue),
        ),
      )
      .limit(1);

    let contactId: string;
    let isNewContact = false;

    if (existing[0]) {
      contactId = existing[0].contactId;
    } else {
      const [created] = await tx
        .insert(contacts)
        .values({
          displayName: input.displayName,
          phone:
            input.identityChannel === "whatsapp" ||
            input.identityChannel === "phone"
              ? input.identityValue
              : null,
          email: input.identityChannel === "email" ? input.identityValue : null,
          source: input.channel,
          lastInboundAt: new Date(),
          lastActivityAt: new Date(),
        })
        .returning({ id: contacts.id });

      const linked = await tx
        .insert(identities)
        .values({
          channel: input.identityChannel,
          value: input.identityValue,
          contactId: created.id,
        })
        .onConflictDoNothing()
        .returning({ contactId: identities.contactId });

      if (linked[0]) {
        contactId = created.id;
        isNewContact = true;
      } else {
        // A concurrent insert won the identity — drop our orphan and reuse it.
        await tx.delete(contacts).where(eq(contacts.id, created.id));
        const again = await tx
          .select({ contactId: identities.contactId })
          .from(identities)
          .where(
            and(
              eq(identities.channel, input.identityChannel),
              eq(identities.value, input.identityValue),
            ),
          )
          .limit(1);
        contactId = again[0].contactId;
      }
    }

    // 3. Log the inbound touch.
    await tx.insert(activities).values({
      contactId,
      type: input.activityType,
      direction: "inbound",
      channel: input.channel,
      body: input.message ?? null,
      actorType: "contact",
      meta: input.summary ? { summary: input.summary } : null,
    });

    if (!isNewContact) {
      await tx
        .update(contacts)
        .set({ lastInboundAt: new Date(), lastActivityAt: new Date() })
        .where(eq(contacts.id, contactId));
    }

    // 4. Open a lead if none is open for this contact.
    const openLead = await tx
      .select({ id: leads.id })
      .from(leads)
      .where(
        and(
          eq(leads.contactId, contactId),
          sql`${leads.status} in ('new','qualified')`,
        ),
      )
      .limit(1);

    let leadId = openLead[0]?.id;
    if (!leadId) {
      const [lead] = await tx
        .insert(leads)
        .values({
          contactId,
          channel: input.channel,
          status: "new",
          summary: input.summary ?? null,
          rawPayload: (input.rawPayload as object) ?? null,
        })
        .returning({ id: leads.id });
      leadId = lead.id;
    }

    return { deduped: false, contactId, isNewContact, leadId };
  });
}

/** Log an outbound message (e.g. the AI reply) to a contact's timeline. */
export async function logOutbound(
  contactId: string,
  channel: LeadChannel,
  body: string,
): Promise<void> {
  await db.insert(activities).values({
    contactId,
    type: channel === "whatsapp" ? "whatsapp_outbound" : "email_outbound",
    direction: "outbound",
    channel,
    body,
    actorType: "system",
  });
}
