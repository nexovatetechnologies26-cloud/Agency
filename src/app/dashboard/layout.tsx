import type { Metadata } from "next";
import { requireUser } from "@/server/auth/session";
import { AppShell } from "@/components/layout/app-shell";

export const metadata: Metadata = { title: "My Account", robots: { index: false, follow: false } };

const nav = [
  { label: "Overview", href: "/dashboard", exact: true },
  { label: "Orders & Projects", href: "/dashboard/orders" },
  { label: "Proposals", href: "/dashboard/proposals" },
  { label: "Invoices & Payments", href: "/dashboard/invoices" },
  { label: "Support & Messages", href: "/dashboard/support" },
  { label: "Consultations", href: "/dashboard/bookings" },
  { label: "Profile & Security", href: "/dashboard/profile" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const s = await requireUser("/dashboard");
  return (
    <AppShell nav={nav} badge="Client" user={s}>
      {children}
    </AppShell>
  );
}
