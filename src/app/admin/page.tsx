import { requireStaffPage } from "@/server/auth/session";
import { adminOverview } from "@/server/queries/dashboard";
import { formatMoney } from "@/lib/money";
import Link from "next/link";
import { BookOpen, Briefcase, FileSignature, Package, Plus, Sparkles, UsersRound } from "lucide-react";
import { can, type Permission, type Role } from "@/lib/permissions";
import { COUNTRIES } from "@/content/countries";
import { PageHeader, Stat } from "@/components/layout/app-shell";

export const dynamic = "force-dynamic";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const s = await requireStaffPage("dashboard");
  const { denied } = await searchParams;

  let o: Awaited<ReturnType<typeof adminOverview>> | null = null;
  try {
    o = await adminOverview();
  } catch (err) {
    console.error("[admin overview]", err);
  }

  const money = (rows: { _id: string; amount: number }[]) =>
    rows.length ? rows.map((r) => formatMoney(r.amount, r._id)).join(" · ") : "—";
  const country = (code: string) => COUNTRIES.find((c) => c.code === code)?.name ?? code;

  return (
    <>
      <PageHeader
        title={`Hello, ${s.name.split(" ")[0]}`}
        description={`Live figures from your records · ${new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}`}
      />
      {denied && <p className="card mb-6 border-amber-200 bg-amber-50 p-4 text-sm">You don&apos;t have access to that section.</p>}
      {!o ? (
        <p className="card p-6 text-sm text-red-700" role="alert">Could not load data. Check MONGODB_URI and Atlas network access.</p>
      ) : (
        <div className="space-y-10">
          <QuickActions role={s.role} />

          <Group title="Sales pipeline">
            <Stat label="New leads" value={o.newLeads} href="/admin/leads?status=new" tone="dark" />
            <Stat label="Leads (30 days)" value={o.leads30} href="/admin/leads" />
            <Stat label="Qualified leads" value={o.qualified} href="/admin/leads?status=qualified" />
            <Stat label="Proposals awaiting reply" value={o.pendingProposals} href="/admin/proposals" />
            <Stat label="Lead win rate" value={o.winRate === null ? "—" : `${o.winRate}%`} tone="brand" />
            <Stat label="Proposal acceptance" value={o.proposalAcceptance === null ? "—" : `${o.proposalAcceptance}%`} tone="brand" />
            <Stat label="Upcoming consultations" value={o.upcomingBookings} href="/admin/bookings" />
            <Stat label="Active customers" value={o.activeCustomers} href="/admin/customers" />
          </Group>

          <Group title="Delivery">
            <Stat label="Active orders" value={o.activeOrders} href="/admin/orders" />
            <Stat label="In progress" value={o.inProgress} href="/admin/orders?status=in_progress" />
            <Stat label="Completed" value={o.completed} href="/admin/orders?status=completed" />
            <Stat label="Open tickets" value={o.openTickets} href="/admin/support" />
          </Group>

          {can(s.role, "finance") && (
            <section>
              <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Finance</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Stat label="Revenue received (net of refunds)" value={<span className="text-xl">{money(o.revenue)}</span>} tone="dark" />
                <Stat label="Outstanding invoices" value={<span className="text-xl">{money(o.outstanding)}</span>} href="/admin/invoices" />
              </div>
            </section>
          )}

          <section className="grid gap-5 md:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-base">Leads by country</h2>
              <p className="text-xs text-muted">Last 30 days</p>
              <Bars rows={o.byCountry.map((r) => ({ label: country(r._id), value: r.count }))} />
            </div>
            <div className="card p-6">
              <h2 className="text-base">Leads by source</h2>
              <p className="text-xs text-muted">Last 30 days</p>
              <Bars rows={o.bySource.map((r) => ({ label: r._id ?? "unknown", value: r.count }))} />
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function Bars({ rows }: { rows: { label: string; value: number }[] }) {
  if (!rows.length) return <p className="mt-4 text-sm text-muted">No data yet.</p>;
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="mt-4 space-y-2.5">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[120px_1fr_32px] items-center gap-3 text-sm">
          <span className="truncate text-muted">{r.label}</span>
          <span className="h-2.5 rounded-full bg-paper">
            <span className="block h-2.5 rounded-full bg-gradient-to-r from-brand to-[#9A72F0]" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <span className="text-right font-medium">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">{title}</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{children}</div>
    </section>
  );
}

const ACTIONS: { label: string; href: string; perm: Permission; icon: typeof Plus }[] = [
  { label: "Review new leads", href: "/admin/leads?status=new", perm: "leads", icon: Sparkles },
  { label: "New proposal", href: "/admin/proposals/new", perm: "proposals", icon: FileSignature },
  { label: "New package", href: "/admin/packages/new", perm: "packages", icon: Package },
  { label: "Write a blog post", href: "/admin/blog/new", perm: "content", icon: BookOpen },
  { label: "Add portfolio project", href: "/admin/portfolio/new", perm: "content", icon: Briefcase },
  { label: "Add team profile", href: "/admin/people/new", perm: "content", icon: UsersRound },
];

function QuickActions({ role }: { role: Role }) {
  const items = ACTIONS.filter((a) => can(role, a.perm));
  if (!items.length) return null;
  return (
    <section>
      <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">Quick actions</h2>
      <ul className="flex flex-wrap gap-2.5">
        {items.map(({ label, href, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand/40 hover:bg-brand-soft hover:text-brand"
            >
              <Icon size={15} aria-hidden className="text-brand" /> {label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
