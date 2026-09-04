import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
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
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("contacts_owner_idx").on(t.ownerId),
    index("contacts_company_idx").on(t.companyId),
    index("contacts_last_activity_idx").on(t.lastActivityAt),
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
  (t) => [index("leads_status_created_idx").on(t.status, t.createdAt)],
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
