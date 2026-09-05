import { sql } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * CRM database schema (Postgres / Drizzle).
 *
 * Phase 1 covers auth (users, sessions), the contact graph (companies,
 * contacts, identities), the unified activity timeline, the intake lead queue,
 * and a durable idempotency ledger for inbound webhooks. Deals, pipelines, and
 * tasks arrive in Phase 2/3.
 */

// --- Enums ---------------------------------------------------------------
export const userRole = pgEnum("user_role", ["admin", "agent"]);

export const identityChannel = pgEnum("identity_channel", [
  "whatsapp",
  "email",
  "phone",
]);

export const activityType = pgEnum("activity_type", [
  "note",
  "whatsapp_inbound",
  "whatsapp_outbound",
  "email_inbound",
  "email_outbound",
  "call",
  "form_submission",
  "facebook_lead",
  "stage_change",
  "system",
]);

export const activityDirection = pgEnum("activity_direction", [
  "inbound",
  "outbound",
  "internal",
]);

export const leadStatus = pgEnum("lead_status", [
  "new",
  "qualified",
  "spam",
  "converted",
]);

export const leadChannel = pgEnum("lead_channel", [
  "whatsapp",
  "web_form",
  "email",
  "facebook",
]);

// --- WhatsApp chat enums ---------------------------------------------------
export const waMessageType = pgEnum("wa_message_type", [
  "text",
  "image",
  "video",
  "audio",
  "document",
  "sticker",
  "location",
  "contacts",
  "interactive",
  "template",
  "reaction",
  "system",
  "unsupported",
]);

export const waMessageDirection = pgEnum("wa_message_direction", [
  "inbound",
  "outbound",
]);

/** Outbound lifecycle; inbound rows are `received` forever. */
export const waMessageStatus = pgEnum("wa_message_status", [
  "queued",
  "sending",
  "sent",
  "delivered",
  "read",
  "failed",
  "received",
]);

// --- Auth ----------------------------------------------------------------
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    name: text("name").notNull(),
    role: userRole("role").notNull().default("agent"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    // Opaque random token (also the httpOnly `__session` cookie value).
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

// --- Contact graph -------------------------------------------------------
export const companies = pgTable("companies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  domain: text("domain"),
  industry: text("industry"),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contacts = pgTable(
  "contacts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    displayName: text("display_name").notNull(),
    phone: text("phone"), // primary phone, E.164
    email: text("email"),
    companyId: uuid("company_id").references(() => companies.id, {
      onDelete: "set null",
    }),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    source: text("source"), // whatsapp | web_form | email | manual
    lifecycleStage: text("lifecycle_stage").notNull().default("lead"),
    tags: text("tags").array().notNull().default([]),
    lastActivityAt: timestamp("last_activity_at", { withTimezone: true }),
    lastInboundAt: timestamp("last_inbound_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),

    // --- WhatsApp thread denormalization (one WhatsApp number per contact) ---
    waId: text("wa_id"), // Meta wa_id digits (no "+"); webhook thread key
    waProfileName: text("wa_profile_name"),
    waLastMessageAt: timestamp("wa_last_message_at", { withTimezone: true }),
    waLastMessagePreview: text("wa_last_message_preview"),
    waUnreadCount: integer("wa_unread_count").notNull().default(0),
    waLastOutboundAt: timestamp("wa_last_outbound_at", { withTimezone: true }),
    waAwaitingReply: boolean("wa_awaiting_reply").notNull().default(false),
    waWindowExpiresAt: timestamp("wa_window_expires_at", { withTimezone: true }),
    waBlockedAt: timestamp("wa_blocked_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("contacts_owner_idx").on(t.ownerId),
    index("contacts_company_idx").on(t.companyId),
    index("contacts_last_activity_idx").on(t.lastActivityAt),
    uniqueIndex("contacts_wa_id_unique").on(t.waId),
    index("contacts_wa_inbox_idx").on(t.waAwaitingReply, t.waLastMessageAt),
  ],
);

/**
 * Deterministic dedup index: one row per (channel, normalized value) → contact.
 * A WhatsApp lead who later emails or fills the form merges onto one contact.
 */
export const identities = pgTable(
  "identities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    channel: identityChannel("channel").notNull(),
    value: text("value").notNull(), // E.164 phone, lowercased email, etc.
    contactId: uuid("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("identities_channel_value_unique").on(t.channel, t.value),
    index("identities_contact_idx").on(t.contactId),
  ],
);

// --- Activity timeline ---------------------------------------------------
export const activities = pgTable(
  "activities",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    type: activityType("type").notNull(),
    direction: activityDirection("direction").notNull().default("internal"),
    channel: text("channel"),
    body: text("body"),
    actorType: text("actor_type").notNull().default("system"), // user | contact | system
    actorId: uuid("actor_id"), // userId when actorType = user
    meta: jsonb("meta"),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("activities_contact_occurred_idx").on(t.contactId, t.occurredAt)],
);

// --- WhatsApp messages (the chat) -----------------------------------------
/**
 * One row per WhatsApp message in either direction. `payload` keeps Meta's
 * per-type object verbatim; media bytes are re-hosted to Cloud Storage and
 * only the object key is stored in `media_key` (never a Meta/signed URL —
 * those expire). Inbound rows are `received`; outbound rows walk the status
 * enum via Meta status webhooks.
 */
export const whatsappMessages = pgTable(
  "whatsapp_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contactId: uuid("contact_id")
      .notNull()
      .references(() => contacts.id, { onDelete: "cascade" }),
    direction: waMessageDirection("direction").notNull(),
    type: waMessageType("type").notNull(),
    status: waMessageStatus("status").notNull().default("queued"),
    /** Text body, media caption, reaction emoji, template text, or transcript. */
    body: text("body"),
    /** Meta's per-type object verbatim (+ outbound flags like isVoiceNote). */
    payload: jsonb("payload"),
    /** GCS object key, or `meta:<mediaId>` until re-hosted. */
    mediaKey: text("media_key"),
    mediaMime: text("media_mime"), // bare mime, no "; codecs=opus"
    mediaSizeBytes: integer("media_size_bytes"),
    mediaSha256: text("media_sha256"),
    mediaFilename: text("media_filename"),
    replyToProviderId: text("reply_to_provider_id"), // quoted wamid
    reactionToProviderId: text("reaction_to_provider_id"), // reaction target
    isForwarded: boolean("is_forwarded").notNull().default(false),
    providerMessageId: text("provider_message_id"), // wamid
    idempotencyKey: text("idempotency_key"),
    sentByUserId: uuid("sent_by_user_id").references(() => users.id, {
      onDelete: "set null",
    }),
    errorCode: text("error_code"),
    errorTitle: text("error_title"),
    errorDetails: jsonb("error_details"),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    readAt: timestamp("read_at", { withTimezone: true }),
    failedAt: timestamp("failed_at", { withTimezone: true }),
    /** Meta's timestamp for inbound, send time for outbound — the ordering key. */
    occurredAt: timestamp("occurred_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("wa_messages_contact_occurred_idx").on(t.contactId, t.occurredAt),
    index("wa_messages_direction_status_idx").on(t.direction, t.status),
    uniqueIndex("wa_messages_provider_id_unique").on(t.providerMessageId),
    uniqueIndex("wa_messages_idempotency_unique").on(t.idempotencyKey),
  ],
);

// --- Intake lead queue ---------------------------------------------------
export const leads = pgTable(
  "leads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contactId: uuid("contact_id").references(() => contacts.id, {
      onDelete: "set null",
    }),
    channel: leadChannel("channel").notNull(),
    status: leadStatus("status").notNull().default("new"),
    summary: text("summary"),
    rawPayload: jsonb("raw_payload"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("leads_status_created_idx").on(t.status, t.createdAt),
    // At most ONE open lead per contact — makes "open a lead if none" a
    // race-free INSERT ... ON CONFLICT DO NOTHING.
    uniqueIndex("leads_open_contact_unique")
      .on(t.contactId)
      .where(sql`status in ('new','qualified')`),
  ],
);

/**
 * Durable idempotency ledger for inbound webhooks. Keyed by a provider event id
 * (e.g. `wa:<wamid>`) so Meta's retries — which hit different Cloud Run
 * instances — are processed exactly once. Replaces in-memory dedup.
 */
export const intakeEvents = pgTable("intake_events", {
  eventId: text("event_id").primaryKey(),
  channel: text("channel").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Debug ledger: records every raw hit to an inbound webhook (before signature
 * checks and processing) so we can confirm whether Meta is actually calling us.
 * Temporary diagnostic aid — safe to keep, cheap to ignore.
 */
export const webhookDebug = pgTable("webhook_debug", {
  id: uuid("id").defaultRandom().primaryKey(),
  source: text("source").notNull(), // whatsapp | facebook
  method: text("method").notNull(),
  sigPresent: boolean("sig_present").notNull().default(false),
  sigValid: boolean("sig_valid"),
  summary: text("summary"),
  bodyPreview: text("body_preview"),
  receivedAt: timestamp("received_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// --- Prospecting (Lead Finder port) ---------------------------------------
// Swept business leads live SEPARATE from `contacts`: a prospect becomes (or
// links to) a contact the first time we message them on WhatsApp.

export const prospectStatus = pgEnum("prospect_status", [
  "pending",
  "enriched",
  "failed",
]);

export const prospectSweepStatus = pgEnum("prospect_sweep_status", [
  "queued",
  "running",
  "done",
  "failed",
]);

export const prospects = pgTable(
  "prospects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    niche: text("niche").notNull(),
    countryCode: text("country_code").notNull(), // ISO alpha-2, e.g. "AE"
    countryName: text("country_name").notNull(),
    city: text("city"),
    address: text("address"),
    rating: real("rating"), // 0..5
    reviews: integer("reviews"),
    phone: text("phone"), // international format from Place Details
    website: text("website"),
    hours: text("hours"),
    // Social & outreach channels (populated by the website scraper, later phase)
    linkedin: text("linkedin"),
    email: text("email"),
    whatsapp: text("whatsapp"), // digits only, e.g. "971501234567"
    facebook: text("facebook"),
    instagram: text("instagram"),
    socialsScrapedAt: timestamp("socials_scraped_at", { withTimezone: true }),
    score: integer("score").notNull().default(0), // 0..100 partner-fit
    status: prospectStatus("status").notNull().default("pending"),
    enriched: boolean("enriched").notNull().default(false),
    placeId: text("place_id"), // provider's stable id
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    /** placeId when present, else `name|countryCode` — provider-agnostic dedupe. */
    dedupeKey: text("dedupe_key").notNull(),
    // --- CRM linkage / outreach tracking ---
    contactId: uuid("contact_id").references(() => contacts.id, { onDelete: "set null" }),
    lastTemplateSentAt: timestamp("last_template_sent_at", { withTimezone: true }),
    templateSendCount: integer("template_send_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("prospects_dedupe_unique").on(t.dedupeKey),
    index("prospects_country_idx").on(t.countryCode),
    index("prospects_niche_idx").on(t.niche),
    index("prospects_enriched_idx").on(t.enriched),
    index("prospects_created_idx").on(t.createdAt),
  ],
);

export const prospectSweeps = pgTable(
  "prospect_sweeps",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    niche: text("niche").notNull(),
    countryCode: text("country_code").notNull(),
    countryName: text("country_name").notNull(),
    city: text("city"), // specific city, when targeted
    allCities: boolean("all_cities").notNull().default(false),
    status: prospectSweepStatus("status").notNull().default("queued"),
    found: integer("found").notNull().default(0),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (t) => [index("prospect_sweeps_created_idx").on(t.createdAt)],
);

/** Monthly free-tier usage: one row per (method, "YYYY-MM" UTC period). */
export const providerQuota = pgTable(
  "provider_quota",
  {
    method: text("method").notNull(), // search | details
    period: text("period").notNull(), // "2026-09" (UTC month)
    used: integer("used").notNull().default(0),
  },
  (t) => [uniqueIndex("provider_quota_pk").on(t.method, t.period)],
);
