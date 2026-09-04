CREATE TABLE "webhook_debug" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source" text NOT NULL,
	"method" text NOT NULL,
	"sig_present" boolean DEFAULT false NOT NULL,
	"sig_valid" boolean,
	"summary" text,
	"body_preview" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
