import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// Load DATABASE_URL from .env.local (gitignored) for local migrations.
config({ path: ".env.local" });

/**
 * Drizzle Kit config — used only locally to generate/apply migrations
 * (`npx drizzle-kit push` or `generate` + `migrate`). Never runs in production.
 * Requires DATABASE_URL in the environment.
 */
export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
