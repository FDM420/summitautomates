import {
  Briefcase,
  Building2,
  CheckSquare,
  FileText,
  LayoutDashboard,
  type LucideIcon,
  MessageSquare,
  Target,
  Users,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  soon?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/inbox", label: "Inbox", icon: MessageSquare },
  { href: "/admin/contacts", label: "Contacts", icon: Users },
  { href: "/admin/leads", label: "Leads", icon: Target },
  { href: "/admin/templates", label: "Templates", icon: FileText },
  { href: "/admin/deals", label: "Deals", icon: Briefcase, soon: true },
  { href: "/admin/tasks", label: "Tasks", icon: CheckSquare, soon: true },
  { href: "/admin/companies", label: "Companies", icon: Building2, soon: true },
];

export function isActive(pathname: string, href: string): boolean {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}
