import type { Metadata } from "next";
import { InboxApp } from "@/components/whatsapp/InboxApp";
import { requireUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Inbox · Summit CRM",
  robots: { index: false, follow: false },
};

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  await requireUser();
  const { c } = await searchParams;
  return <InboxApp initialContactId={c} />;
}
