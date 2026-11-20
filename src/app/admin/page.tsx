import { requireStaffPage } from "@/server/auth/session";
import { adminOverview } from "@/server/queries/dashboard";
import { formatMoney } from "@/lib/money";
import { can } from "@/lib/permissions";
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
      <PageHeader title={`Hello, ${s.name.split(" ")[0]}`} description="Live figures from your records." />
      {denied && <p className="card mb-6 border-amber-200 bg-amber-50 p-4 text-sm">You don&apos;t have access to that section.</p>}
      {!o ? (
        <p className="card p-6 text-sm text-red-700" role="alert">Could not load data. Check MONGODB_URI and Atlas network access.</p>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Stat label="New leads" value={o.newLeads} href="/admin/leads?status=new" />
            <Stat label="Leads (30 days)" value={o.leads30} href="/admin/leads" />
            <Stat label="Qualified leads" value={o.qualified} href="/admin/leads?status=qualified" />
            <Stat label="Proposals awaiting reply" value={o.pendingProposals} href="/admin/proposals" />
            <Stat label="Active orders" value={o.activeOrders} href="/admin/orders" />
            <Stat label="In progress" value={o.inProgress} href="/admin/orders?status=in_progress" />
            <Stat label="Completed" value={o.completed} href="/admin/orders?status=completed" />
            <Stat label="Active customers" value={o.activeCustomers} href="/admin/customers" />
            <Stat label="Open tickets" value={o.openTickets} href="/admin/support" />
            <Stat label="Upcoming consultations" value={o.upcomingBookings} href="/admin/bookings" />
            <Stat label="Lead win rate" value={o.winRate === null ? "—" : `${o.winRate}%`} />
            <Stat label="Proposal acceptance" value={o.proposalAcceptance === null ? "—" : `${o.proposalAcceptance}%`} />
          </div>

          {can(s.role, "finance") && (
            <div className="grid gap-4 md:grid-cols-2">
              <Stat label="Revenue received (net of refunds)" value={<span className="text-lg">{money(o.revenue)}</span>} />
              <Stat label="Outstanding invoices" value={<span className="text-lg">{money(o.outstanding)}</span>} href="/admin/invoices" />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <h2 className="text-base">Leads by country (30 days)</h2>
              <Bars rows={o.byCountry.map((r) => ({ label: country(r._id), value: r.count }))} />
            </div>
            <div className="card p-6">
              <h2 className="text-base">Leads by source (30 days)</h2>
              <Bars rows={o.bySource.map((r) => ({ label: r._id ?? "unknown", value: r.count }))} />
            </div>
          </div>
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
          <span className="h-2 rounded-full bg-paper">
            <span className="block h-2 rounded-full bg-brand" style={{ width: `${(r.value / max) * 100}%` }} />
          </span>
          <span className="text-right font-medium">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}
