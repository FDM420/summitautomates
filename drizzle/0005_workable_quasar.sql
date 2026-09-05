CREATE TYPE "public"."prospect_status" AS ENUM('pending', 'enriched', 'failed');--> statement-breakpoint
CREATE TYPE "public"."prospect_sweep_status" AS ENUM('queued', 'running', 'done', 'failed');--> statement-breakpoint
CREATE TABLE "prospect_sweeps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"niche" text NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"city" text,
	"all_cities" boolean DEFAULT false NOT NULL,
	"status" "prospect_sweep_status" DEFAULT 'queued' NOT NULL,
	"found" integer DEFAULT 0 NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "prospects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"niche" text NOT NULL,
	"country_code" text NOT NULL,
	"country_name" text NOT NULL,
	"city" text,
	"address" text,
	"rating" real,
	"reviews" integer,
	"phone" text,
	"website" text,
	"hours" text,
	"linkedin" text,
	"email" text,
	"whatsapp" text,
	"facebook" text,
	"instagram" text,
	"socials_scraped_at" timestamp with time zone,
	"score" integer DEFAULT 0 NOT NULL,
	"status" "prospect_status" DEFAULT 'pending' NOT NULL,
	"enriched" boolean DEFAULT false NOT NULL,
	"place_id" text,
	"lat" double precision,
	"lng" double precision,
	"dedupe_key" text NOT NULL,
	"contact_id" uuid,
	"last_template_sent_at" timestamp with time zone,
	"template_send_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provider_quota" (
	"method" text NOT NULL,
	"period" text NOT NULL,
	"used" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_contact_id_contacts_id_fk" FOREIGN KEY ("contact_id") REFERENCES "public"."contacts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "prospect_sweeps_created_idx" ON "prospect_sweeps" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "prospects_dedupe_unique" ON "prospects" USING btree ("dedupe_key");--> statement-breakpoint
CREATE INDEX "prospects_country_idx" ON "prospects" USING btree ("country_code");--> statement-breakpoint
CREATE INDEX "prospects_niche_idx" ON "prospects" USING btree ("niche");--> statement-breakpoint
CREATE INDEX "prospects_enriched_idx" ON "prospects" USING btree ("enriched");--> statement-breakpoint
CREATE INDEX "prospects_created_idx" ON "prospects" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "provider_quota_pk" ON "provider_quota" USING btree ("method","period");