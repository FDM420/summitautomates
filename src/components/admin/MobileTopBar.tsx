"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { isActive, NAV_ITEMS } from "./nav-items";

type Props = { user: { name: string; email: string; role: string } };

/** Mobile (<md) top bar + slide-in nav drawer. Desktop uses AdminSidebar. */
export function MobileTopBar({ user }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on route change.
  useEffect(() => { setOpen(false); }, [pathname]);
  // Lock body scroll while open.
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/8 px-3 md:hidden">
        <Link className="mono text-xs uppercase tracking-[0.2em] text-amber-300/90" href="/admin">Summit CRM</Link>
        <button
          aria-label="Open menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button aria-label="Close menu" className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} type="button" />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col border-r border-white/8 bg-[#0b0e17] p-4">
            <div className="mb-6 flex items-center justify-between">
              <span className="mono text-xs uppercase tracking-[0.24em] text-amber-300/90">Summit CRM</span>
              <button aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:text-white" onClick={() => setOpen(false)} type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(pathname, item.href);
                if (item.soon) {
                  return (
                    <span key={item.href} className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2.5 text-slate-600">
                      <span className="flex items-center gap-3"><Icon className="h-5 w-5" /> {item.label}</span>
                      <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-slate-500">soon</span>
                    </span>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      active ? "bg-amber-300/10 text-amber-100" : "text-slate-200 hover:bg-white/5"
                    }`}
                    href={item.href}
                  >
                    <Icon className="h-5 w-5" /> {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto border-t border-white/8 pt-4">
              <p className="truncate text-sm font-medium text-white">{user.name}</p>
              <p className="mb-3 truncate text-xs text-slate-500">{user.email} · {user.role}</p>
              <LogoutButton />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
