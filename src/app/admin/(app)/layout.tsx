import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MobileTopBar } from "@/components/admin/MobileTopBar";
import { requireUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

/**
 * Authoritative auth gate + app shell for the CRM. Full-viewport flex layout:
 * a slim icon rail on desktop, a top bar + drawer on mobile, and a scrollable
 * main. Pages that want full height (the inbox) use `h-full` inside main.
 */
export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const u = { name: user.name, email: user.email, role: user.role };

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0b0e17] text-slate-100">
      <AdminSidebar user={u} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar user={u} />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
