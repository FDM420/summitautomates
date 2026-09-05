import type { Metadata } from "next";
import { ProspectsApp } from "@/components/prospecting/ProspectsApp";
import { requireUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Prospects · Summit CRM",
  robots: { index: false, follow: false },
};

export default async function ProspectsPage() {
  await requireUser();
  return <ProspectsApp />;
}
