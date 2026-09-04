"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: { href: string; label: string; soon?: boolean }[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inbox", label: "Inbox" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/deals", label: "Deals", soon: true },
  { href: "/admin/tasks", label: "Tasks", soon: true },
  { href: "/admin/companies", label: "Companies", soon: true },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {ITEMS.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        if (item.soon) {
          return (
            <span
              key={item.href}
              className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600"
              title="Coming in a later phase"
            >
              {item.label}
              <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                soon
              </span>
            </span>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              active
                ? "bg-amber-300/10 text-amber-100"
                : "text-slate-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
