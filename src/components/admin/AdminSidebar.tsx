"use client";

import {
  Briefcase,
  Building2,
  CheckSquare,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  MessageSquare,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";

const STORAGE_KEY = "summit.crm.nav";

const ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inbox", label: "Inbox", icon: MessageSquare },
  { href: "/admin/contacts", label: "Contacts", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Target },
  { href: "/admin/deals", label: "Deals", icon: Briefcase, soon: true },
  { href: "/admin/tasks", label: "Tasks", icon: CheckSquare, soon: true },
  { href: "/admin/companies", label: "Companies", icon: Building2, soon: true },
] as const;

type Props = {
  user: { name: string; email: string; role: string };
};

/**
 * Collapsible admin nav: defaults to a slim icon-only rail; the chevron toggle
 * expands it to icons + labels. Preference persists per browser.
 */
export function AdminSidebar({ user }: Props) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false); // slim rail by default
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setExpanded(localStorage.getItem(STORAGE_KEY) === "expanded");
    } catch {
      /* private mode etc. — keep default */
    }
    setHydrated(true);
  }, []);

  const toggle = () => {
    setExpanded((v) => {
      const next = !v;
      try {
        localStorage.setItem(STORAGE_KEY, next ? "expanded" : "collapsed");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 flex-col border-r border-white/8 md:flex ${
        expanded ? "w-60 p-4" : "w-[64px] items-center px-2 py-4"
      } ${hydrated ? "transition-[width] duration-200" : ""}`}
    >
      {/* Brand + toggle */}
      <div className={`mb-6 flex items-center ${expanded ? "justify-between" : "flex-col gap-3"}`}>
        <Link
          className="mono text-amber-300/90"
          href="/admin"
          title="Summit CRM"
        >
          {expanded ? (
            <span className="text-xs uppercase tracking-[0.24em]">Summit CRM</span>
          ) : (
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-300/10 text-sm font-bold">
              S
            </span>
          )}
        </Link>
        <button
          aria-label={expanded ? "Collapse menu" : "Expand menu"}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white/5 hover:text-white"
          onClick={toggle}
          title={expanded ? "Collapse" : "Expand"}
          type="button"
        >
          {expanded ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className={`flex flex-col gap-1 ${expanded ? "" : "items-center"}`}>
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          if ("soon" in item && item.soon) {
            return (
              <span
                key={item.href}
                className={`flex cursor-not-allowed items-center gap-3 rounded-lg text-slate-600 ${
                  expanded ? "px-3 py-2" : "h-10 w-10 justify-center"
                }`}
                title={`${item.label} — coming soon`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {expanded ? (
                  <span className="flex flex-1 items-center justify-between text-sm">
                    {item.label}
                    <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                      soon
                    </span>
                  </span>
                ) : null}
              </span>
            );
          }
          return (
            <Link
              key={item.href}
              className={`flex items-center gap-3 rounded-lg transition ${
                expanded ? "px-3 py-2" : "h-10 w-10 justify-center"
              } ${
                active
                  ? "bg-amber-300/10 text-amber-100"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
              href={item.href}
              title={item.label}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {expanded ? <span className="text-sm">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div
        className={`mt-auto border-t border-white/8 pt-4 ${
          expanded ? "" : "flex flex-col items-center gap-2"
        }`}
      >
        {expanded ? (
          <>
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="mb-3 truncate text-xs text-slate-500">
              {user.email} · {user.role}
            </p>
            <LogoutButton />
          </>
        ) : (
          <>
            <span
              className="grid h-9 w-9 place-items-center rounded-full bg-white/5 text-xs font-semibold text-slate-200"
              title={`${user.name} (${user.email})`}
            >
              {user.name
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("")}
            </span>
            <LogoutButton compact />
          </>
        )}
      </div>
    </aside>
  );
}
