CREATE TYPE "public"."wa_call_direction" AS ENUM('inbound', 'outbound');--> statement-breakpoint
CREATE TYPE "public"."wa_call_status" AS ENUM('ringing', 'answered', 'ended', 'missed', 'failed');--> statement-breakpoint
CREATE TABLE "whatsapp_calls" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_id" uuid NOT NULL,
	"wa_call_id" text NOT NULL,
	"direction" "wa_call_direction" NOT NULL,
	"status" "wa_call_status" DEFAULT 'ringing' NOT NULL,
	"event" text,
	"sdp_offer" text,
	"sdp_answer" text,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"answered_at" timestamp with time zone,
	"ended_at" timestamp with time zone,
	"duration_seconds" integer,
	"end_reason" text,
	"last_heartbeat_at" timestamp with time zone,
	"answered_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_call_permission_status" text;--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN "wa_call_permission_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "whatsapp_calls" ADD CONSTRAINT "whatsapp_calls_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "whatsapp_calls" ADD CONSTRAINT "whatsapp_calls_answered_by_user_id_users_id_fk" FOREIGN KEY ("answered_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "wa_calls_wa_call_id_unique" ON "whatsapp_calls" USING btree ("wa_call_id");--> statement-breakpoint
CREATE INDEX "wa_calls_status_idx" ON "whatsapp_calls" USING btree ("status");--> statement-breakpoint
CREATE INDEX "wa_calls_contact_created_idx" ON "whatsapp_calls" USING btree ("contact_id","created_at");