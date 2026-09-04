import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/current-user";
import { formatWhen } from "@/lib/crm/format";
import { db } from "@/lib/db";
import { activities, contacts } from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Contact · Summit CRM",
  robots: { index: false, follow: false },
};

const ACTIVITY_LABEL: Record<string, string> = {
  whatsapp_inbound: "WhatsApp · received",
  whatsapp_outbound: "WhatsApp · sent",
  email_inbound: "Email · received",
  email_outbound: "Email · sent",
  form_submission: "Web form",
  note: "Note",
  call: "Call",
  stage_change: "Stage change",
  system: "System",
};

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
    .limit(1);
  if (!contact) notFound();

  const timeline = await db
    .select({
      id: activities.id,
      type: activities.type,
      direction: activities.direction,
      body: activities.body,
      occurredAt: activities.occurredAt,
    })
    .from(activities)
    .where(eq(activities.contactId, id))
    .orderBy(desc(activities.occurredAt))
    .limit(200);

  return (
    <div>
      <Link
        className="text-xs text-slate-400 hover:text-slate-200"
        href="/admin/contacts"
      >
        ← Contacts
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Identity rail */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
            <h1 className="text-lg font-semibold text-white">
              {contact.displayName}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {contact.lifecycleStage} · from {contact.source ?? "—"}
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <Field label="Phone" value={contact.phone} />
              <Field label="Email" value={contact.email} />
              <Field
                label="First seen"
                value={formatWhen(contact.createdAt)}
              />
              <Field
                label="Last inbound"
                value={formatWhen(contact.lastInboundAt)}
              />
            </dl>
          </div>
        </aside>

        {/* Timeline */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Activity
          </h2>
          {timeline.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">No activity yet.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {timeline.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-white/8 bg-white/[0.02] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium ${
                        a.direction === "outbound"
                          ? "text-amber-200"
                          : a.direction === "inbound"
                            ? "text-emerald-300"
                            : "text-slate-400"
                      }`}
                    >
                      {ACTIVITY_LABEL[a.type] ?? a.type}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatWhen(a.occurredAt)}
                    </span>
                  </div>
                  {a.body ? (
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">
                      {a.body}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="truncate text-slate-200">{value || "—"}</dd>
    </div>
  );
}
