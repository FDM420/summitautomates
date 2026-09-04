import { sql } from "drizzle-orm";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { AuthForm } from "./auth-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in · Summit CRM",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  // Already signed in → go to the app.
  if (await getCurrentUser()) redirect("/admin");

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users);
  const mode = count === 0 ? "setup" : "login";
  const next = (await searchParams).next ?? "/admin";

  return (
    <main className="grid min-h-screen place-items-center bg-[#0b0e17] px-4 text-slate-100">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mono text-xs uppercase tracking-[0.24em] text-amber-300/80">
            Summit CRM
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-white">
            {mode === "setup" ? "Create the first admin" : "Sign in"}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {mode === "setup"
              ? "No accounts yet — set up the owner account to get started."
              : "Enter your team credentials to continue."}
          </p>
        </div>
        <AuthForm mode={mode} next={next} />
      </div>
    </main>
  );
}
