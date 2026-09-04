import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

/**
 * Authoritative auth gate for the CRM. Every route under /admin/(app) renders
 * through here, so an unauthenticated request is redirected before any data is
 * read. (The Edge middleware only did a cheap cookie-presence check.)
 */
export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();

  return (
    <div className="min-h-screen bg-[#0b0e17] text-slate-100">
      <div className="flex">
        <AdminSidebar user={{ name: user.name, email: user.email, role: user.role }} />
        <main className="min-w-0 flex-1 p-5 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
