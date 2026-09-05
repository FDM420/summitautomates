import type { Metadata } from "next";
import { TemplatesPanel } from "@/components/whatsapp/TemplatesPanel";
import { requireUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Templates · Summit CRM",
  robots: { index: false, follow: false },
};

export default async function TemplatesPage() {
  await requireUser();
  return <TemplatesPanel />;
}
