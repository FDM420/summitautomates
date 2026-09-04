import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoutButton } from "@/components/admin/LogoutButton";
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
      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/8 p-5 md:flex">
          <Link href="/admin" className="mb-8 block">
            <span className="mono text-xs uppercase tracking-[0.24em] text-amber-300/80">
              Summit CRM
            </span>
          </Link>
          <AdminNav />
          <div className="mt-auto border-t border-white/8 pt-4">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="mb-3 truncate text-xs text-slate-500">
              {user.email} · {user.role}
            </p>
            <LogoutButton />
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
