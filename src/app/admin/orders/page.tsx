import Link from "next/link";
import clsx from "clsx";
import { requireStaffPage } from "@/server/auth/session";
import { listOrders } from "@/server/queries/commerce";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AdminOrders({ searchParams }: { searchParams: Promise<{ status?: string; mine?: string }> }) {
  const s = await requireStaffPage("orders");
  const { status, mine } = await searchParams;
  const validStatus = status && (ORDER_STATUSES as readonly string[]).includes(status) ? status : undefined;
  // developers/designers see only orders assigned to them
  const onlyMine = mine === "1" || s.role === "developer" || s.role === "designer";
  const rows = await listOrders({ status: validStatus, assignee: onlyMine ? s.sub : undefined });

  return (
    <>
      <PageHeader title="Orders & Projects" />
      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/admin/orders" className={clsx("rounded-full border px-3.5 py-1.5 text-xs font-medium", !validStatus ? "border-brand bg-brand text-white" : "border-line bg-white")}>All</Link>
        {ORDER_STATUSES.map((st) => (
          <Link key={st} href={`/admin/orders?status=${st}`} className={clsx("rounded-full border px-3.5 py-1.5 text-xs font-medium", validStatus === st ? "border-brand bg-brand text-white" : "border-line bg-white")}>
            {ORDER_STATUS_LABELS[st]}
          </Link>
        ))}
      </div>
      {rows.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-5 py-3">Order</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Created</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Payment</th></tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o._id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4"><Link href={`/admin/orders/${o._id}`} className="font-semibold text-brand">{o.number}</Link><p className="text-xs text-muted">{o.title}</p></td>
                  <td className="px-5 py-4">{o.customer?.name}<p className="text-xs text-muted">{o.customer?.email}</p></td>
                  <td className="px-5 py-4">{formatMoney(o.total, o.currency)}</td>
                  <td className="px-5 py-4">{fmtDate(o.createdAt)}</td>
                  <td className="px-5 py-4"><StatusBadge status={o.status} /></td>
                  <td className="px-5 py-4"><StatusBadge status={o.paymentStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No orders found" />
      )}
    </>
  );
}
