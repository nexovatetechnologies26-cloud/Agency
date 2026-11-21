"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Building2,
  BookOpen,
  Briefcase,
  CalendarClock,
  FileSignature,
  FileText,
  Hash,
  History,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareQuote,
  Package,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  UserCircle,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

/** Icon for each dashboard/admin route (matched on the last path segment). */
const ICONS: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/admin": LayoutDashboard,
  orders: ShoppingBag,
  proposals: FileSignature,
  invoices: Receipt,
  support: LifeBuoy,
  bookings: CalendarClock,
  profile: UserCircle,
  leads: Sparkles,
  packages: Package,
  customers: Users,
  blog: BookOpen,
  portfolio: Briefcase,
  testimonials: MessageSquareQuote,
  people: UsersRound,
  stats: Hash,
  clients: Building2,
  team: ShieldCheck,
  audit: History,
};

function iconFor(href: string): LucideIcon {
  return ICONS[href] ?? ICONS[href.split("/").pop() ?? ""] ?? FileText;
}

export function NavLink({ href, exact, variant = "side", children }: { href: string; exact?: boolean; variant?: "side" | "pill"; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const Icon = iconFor(href);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "group relative flex items-center gap-3 text-sm font-medium transition-colors",
        variant === "side" && "rounded-xl px-3 py-2",
        variant === "pill" && "shrink-0 gap-2 rounded-full px-3 py-1.5",
        active ? "bg-brand-soft text-brand" : "text-ink/70 hover:bg-paper hover:text-ink",
      )}
    >
      {variant === "side" && active && <span aria-hidden className="absolute -left-4 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-brand" />}
      <Icon size={variant === "side" ? 17 : 15} strokeWidth={1.9} aria-hidden className={clsx("shrink-0", active ? "text-brand" : "text-ink/45 group-hover:text-ink/70")} />
      <span className="truncate">{children}</span>
    </Link>
  );
}
