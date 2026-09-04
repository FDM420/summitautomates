CREATE TYPE "public"."wa_message_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."wa_message_status" AS ENUM('queued', 'sending', 'sent', 'delivered', 'read', 'failed', 'received');--> statement-breakpoint
CREATE TYPE "public"."wa_message_type" AS ENUM('text', 'image', 'video', 'audio', 'document', 'sticker', 'location', 'contacts', 'interactive', 'template', 'reaction', 'system', 'unsupported');--> statement-breakpoint
CREATE TABLE "whatsapp_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"direction" "wa_message_direction" NOT NULL,
	"type" "wa_message_type" NOT NULL,
	"status" "wa_message_status" DEFAULT 'queued' NOT NULL,
	"body" text,
	"payload" jsonb,
	"media_key" text,
	"media_mime" text,
	"media_size_bytes" integer,
	"media_sha256" text,
	"media_filename" text,
	"reply_to_provider_id" text,
	"reaction_to_provider_id" text,
	"is_forwarded" boolean DEFAULT false NOT NULL,
	"provider_message_id" text,
	"idempotency_key" text,
	"sent_by_user_id" uuid,
	"error_code" text,
	"error_title" text,
	"error_details" jsonb,
	"sent_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"occurred_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_id" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_profile_name" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_last_message_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_last_message_preview" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_unread_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_last_outbound_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_awaiting_reply" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_window_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_blocked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_messages" ADD CONSTRAINT "whatsapp_messages_sent_by_user_id_users_id_fk" FOREIGN KEY ("sent_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "wa_messages_contact_occurred_idx" ON "whatsapp_messages" USING btree ("contact_id","occurred_at");--> statement-breakpoint
CREATE INDEX "wa_messages_direction_status_idx" ON "whatsapp_messages" USING btree ("direction","status");--> statement-breakpoint
CREATE UNIQUE INDEX "wa_messages_provider_id_unique" ON "whatsapp_messages" USING btree ("provider_message_id");--> statement-breakpoint
CREATE UNIQUE INDEX "wa_messages_idempotency_unique" ON "whatsapp_messages" USING btree ("idempotency_key");--> statement-breakpoint
CREATE UNIQUE INDEX "contacts_wa_id_unique" ON "contacts" USING btree ("wa_id");--> statement-breakpoint
CREATE INDEX "contacts_wa_inbox_idx" ON "contacts" USING btree ("wa_awaiting_reply","wa_last_message_at");