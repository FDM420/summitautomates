import { desc, isNull } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/current-user";
import { formatWhen } from "@/lib/crm/format";
import { db } from "@/lib/db";
import { contacts } from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contacts · Summit CRM",
  robots: { index: false, follow: false },
};

export default async function ContactsPage() {
  await requireUser();

  const rows = await db
    .select({
      id: contacts.id,
      displayName: contacts.displayName,
      phone: contacts.phone,
      email: contacts.email,
      source: contacts.source,
      lifecycleStage: contacts.lifecycleStage,
      lastActivityAt: contacts.lastActivityAt,
    })
    .from(contacts)
    .where(isNull(contacts.archivedAt))
    .orderBy(desc(contacts.lastActivityAt))
    .limit(100);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contacts</h1>
          <p className="mt-1 text-sm text-slate-400">
            {rows.length} {rows.length === 1 ? "contact" : "contacts"}
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-10 text-center">
          <p className="text-sm text-slate-300">No contacts yet.</p>
          <p className="mt-1 text-xs text-slate-500">
            Contacts appear automatically when someone messages your WhatsApp.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-2xl border border-white/8">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Contact</th>
                <th className="px-4 py-3 font-medium">Source</th>
                <th className="px-4 py-3 font-medium">Stage</th>
                <th className="px-4 py-3 font-medium">Last activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((c) => (
                <tr key={c.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-4 py-3">
                    <Link
                      className="font-medium text-white hover:text-amber-200"
                      href={`/admin/contacts/${c.id}`}
                    >
                      {c.displayName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {c.phone ?? c.email ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-300">
                      {c.source ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{c.lifecycleStage}</td>
                  <td className="px-4 py-3 text-slate-400">
                    {formatWhen(c.lastActivityAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
