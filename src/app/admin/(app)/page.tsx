import { sql } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { contacts, leads } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard · Summit CRM",
  robots: { index: false, follow: false },
};

async function counts() {
  const [c] = await db.select({ n: sql<number>`count(*)::int` }).from(contacts);
  const [l] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(leads)
    .where(sql`${leads.status} = 'new'`);
  return { contacts: c?.n ?? 0, newLeads: l?.n ?? 0 };
}

export default async function AdminDashboard() {
  const user = await requireUser();
  const { contacts: contactCount, newLeads } = await counts();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">
        Welcome back, {user.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-slate-400">
        Here&rsquo;s the current state of your pipeline.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat label="Contacts" value={contactCount} href="/admin/contacts" />
        <Stat label="New leads" value={newLeads} href="/admin/leads" />
        <Stat label="Open deals" value="—" hint="Phase 2" />
      </div>

      <p className="mt-10 text-sm text-slate-500">
        Contacts and leads flow in automatically from WhatsApp once the webhook is
        wired to the CRM (next build step).
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: number | string;
  href?: string;
  hint?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5 transition hover:border-white/15">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-600">{hint}</p> : null}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
