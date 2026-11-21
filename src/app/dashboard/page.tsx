import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { customerOverview } from "@/server/queries/dashboard";
import { getCurrentUser } from "@/server/queries/other";
import { listMyOrders } from "@/server/queries/commerce";
import { resendVerificationAction } from "@/server/actions/auth";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";
import { PageHeader, Stat } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";
import { PendingButton } from "@/components/forms/pending-button";
import { ActionForm } from "@/components/forms/action-form";

export default async function DashboardHome() {
  const s = await requireUser();
  const [stats, user, orders] = await Promise.all([customerOverview(s.sub, s.email), getCurrentUser(s.sub), listMyOrders(s.sub)]);

  return (
    <>
      <PageHeader
        title={`Welcome, ${s.name.split(" ")[0]}`}
        description="Everything about your projects with Nexovate in one place."
        actions={<ButtonLink href="/get-a-quote">Start a new project</ButtonLink>}
      />

      {user && !user.emailVerifiedAt && (
        <div className="card mb-6 border-amber-200 bg-amber-50 p-4 text-sm">
          <ActionForm action={resendVerificationAction} className="flex flex-wrap items-center justify-between gap-3 space-y-0">
            <span>Please confirm your email address ({s.email}) to keep your account secure.</span>
            <PendingButton>Resend email</PendingButton>
          </ActionForm>
        </div>
      )}

      {stats.awaitingRequirements > 0 && (
        <div className="card mb-6 border-brand/30 bg-brand-soft p-4 text-sm">
          {stats.awaitingRequirements} order{stats.awaitingRequirements > 1 ? "s need" : " needs"} your project requirements.{" "}
          <Link href="/dashboard/orders" className="font-semibold text-brand">Add them now →</Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Active orders" value={stats.activeOrders} href="/dashboard/orders" tone="dark" />
        <Stat label="Proposals to review" value={stats.openProposals} href="/dashboard/proposals" />
        <Stat label="Unpaid invoices" value={stats.unpaidInvoices} href="/dashboard/invoices" />
        <Stat label="Open tickets" value={stats.openTickets} href="/dashboard/support" />
      </div>

      <h2 className="mb-4 mt-10 text-lg">Recent orders</h2>
      {orders.length ? (
        <ul className="card divide-y divide-line">
          {orders.slice(0, 5).map((o) => (
            <li key={o._id}>
              <Link href={`/dashboard/orders/${o._id}`} className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-paper">
                <div>
                  <p className="font-semibold">{o.title}</p>
                  <p className="text-xs text-muted">{o.number} · {fmtDate(o.createdAt)} · {formatMoney(o.total, o.currency)}</p>
                </div>
                <div className="flex gap-2"><StatusBadge status={o.status} /><StatusBadge status={o.paymentStatus} /></div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No orders yet" text="Choose a package or request a custom quote to get started." action={{ label: "View pricing", href: "/pricing" }} />
      )}
    </>
  );
}
