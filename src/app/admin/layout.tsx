import type { Metadata } from "next";
import { requireStaffPage } from "@/server/auth/session";
import { can, ROLE_LABELS, type Permission } from "@/lib/permissions";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const NAV: { label: string; href: string; perm: Permission; exact?: boolean }[] = [
  { label: "Overview", href: "/admin", perm: "dashboard", exact: true },
  { label: "Leads", href: "/admin/leads", perm: "leads" },
  { label: "Proposals", href: "/admin/proposals", perm: "proposals" },
  { label: "Orders & Projects", href: "/admin/orders", perm: "orders" },
  { label: "Invoices", href: "/admin/invoices", perm: "finance" },
  { label: "Packages", href: "/admin/packages", perm: "packages" },
  { label: "Customers", href: "/admin/customers", perm: "customers" },
  { label: "Support", href: "/admin/support", perm: "support" },
  { label: "Consultations", href: "/admin/bookings", perm: "bookings" },
  { label: "Blog", href: "/admin/blog", perm: "content" },
  { label: "Portfolio", href: "/admin/portfolio", perm: "content" },
  { label: "Testimonials", href: "/admin/testimonials", perm: "content" },
  { label: "Team Profiles", href: "/admin/people", perm: "content" },
  { label: "Numbers", href: "/admin/stats", perm: "content" },
  { label: "Team & Roles", href: "/admin/team", perm: "team" },
  { label: "Audit Log", href: "/admin/audit", perm: "team" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await requireStaffPage("dashboard");
  const nav = NAV.filter((n) => can(s.role, n.perm));
  return (
    <AppShell nav={nav} badge={ROLE_LABELS[s.role]} user={s}>
      {children}
    </AppShell>
  );
}
