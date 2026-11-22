import type { Metadata } from "next";
import { requireStaffPage } from "@/server/auth/session";
import { can, ROLE_LABELS, type Permission } from "@/lib/permissions";
import { AppShell } from "@/components/layout/app-shell";
import { getInboxCounts } from "@/server/queries/dashboard";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

type InboxKey = "total";
const NAV: { label: string; href: string; perm: Permission; exact?: boolean; group?: string; inbox?: InboxKey }[] = [
  { label: "Overview", href: "/admin", perm: "dashboard", exact: true },
  // everything people send us — website inquiries and client messages — in one place
  { label: "Inbox", href: "/admin/inbox", perm: "leads", inbox: "total" },
  { label: "Leads pipeline", href: "/admin/leads", perm: "leads", group: "Sales" },
  { label: "Proposals", href: "/admin/proposals", perm: "proposals", group: "Sales" },
  { label: "Customers", href: "/admin/customers", perm: "customers", group: "Sales" },
  { label: "Consultations", href: "/admin/bookings", perm: "bookings", group: "Sales" },
  { label: "Orders & Projects", href: "/admin/orders", perm: "orders", group: "Delivery" },
  { label: "Invoices", href: "/admin/invoices", perm: "finance", group: "Delivery" },
  { label: "Packages", href: "/admin/packages", perm: "packages", group: "Delivery" },
  // staff who handle support but not sales reach client messages here (others use the Inbox)
  { label: "Client messages", href: "/admin/support", perm: "support", group: "Delivery" },
  { label: "Blog", href: "/admin/blog", perm: "content", group: "Website" },
  { label: "Portfolio", href: "/admin/portfolio", perm: "content", group: "Website" },
  { label: "Testimonials", href: "/admin/testimonials", perm: "content", group: "Website" },
  { label: "Team Profiles", href: "/admin/people", perm: "content", group: "Website" },
  { label: "Numbers", href: "/admin/stats", perm: "content", group: "Website" },
  { label: "Clients", href: "/admin/clients", perm: "content", group: "Website" },
  { label: "Team & Roles", href: "/admin/team", perm: "team", group: "Settings" },
  { label: "Audit Log", href: "/admin/audit", perm: "team", group: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await requireStaffPage("dashboard");
  const c = await getInboxCounts();
  const counts = { total: c.inquiries + c.clientMessages };
  const nav = NAV.filter((n) => can(s.role, n.perm) && !(n.href === "/admin/support" && can(s.role, "leads"))).map(({ inbox, ...n }) => ({ ...n, count: inbox ? counts[inbox] : undefined }));
  return (
    <AppShell nav={nav} badge={ROLE_LABELS[s.role]} user={s}>
      {children}
    </AppShell>
  );
}
