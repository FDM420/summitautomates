import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/current-user";
import { formatWhen } from "@/lib/crm/format";
import { db } from "@/lib/db";
import { contacts, leads } from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Leads · Summit CRM",
  robots: { index: false, follow: false },
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-emerald-500/15 text-emerald-300",
  qualified: "bg-amber-400/15 text-amber-200",
  spam: "bg-slate-500/15 text-slate-400",
  converted: "bg-sky-500/15 text-sky-300",
};

export default async function LeadsPage() {
  await requireUser();

  const rows = await db
    .select({
      id: leads.id,
      status: leads.status,
      channel: leads.channel,
      summary: leads.summary,
      createdAt: leads.createdAt,
      contactId: leads.contactId,
      contactName: contacts.displayName,
      contactPhone: contacts.phone,
    })
    .from(leads)
    .leftJoin(contacts, eq(leads.contactId, contacts.id))
    .orderBy(desc(leads.createdAt))
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Leads</h1>
      <p className="mt-1 text-sm text-slate-400">
        {rows.length} {rows.length === 1 ? "lead" : "leads"} · newest first
      </p>

      {rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-slate-300">No leads yet.</p>
          <p className="mt-1 text-xs text-slate-500">
            A lead opens automatically the first time someone contacts you.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((l) => (
            <li
              key={l.id}
              className="rounded-2xl border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {l.contactId ? (
                    <Link
                      className="font-medium text-white hover:text-amber-200"
                      href={`/admin/contacts/${l.contactId}`}
                    >
                      {l.contactName ?? "Unknown"}
                    </Link>
                  ) : (
                    <span className="font-medium text-white">
                      {l.contactName ?? "Unknown"}
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    {l.contactPhone ?? ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      STATUS_STYLE[l.status] ?? "bg-white/5 text-slate-300"
                    }`}
                  >
                    {l.status}
                  </span>
                  <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
                    {l.channel}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatWhen(l.createdAt)}
                  </span>
                </div>
              </div>
              {l.summary ? (
                <p className="mt-2 text-sm text-slate-300">{l.summary}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
