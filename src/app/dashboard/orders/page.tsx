import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { listMyOrders } from "@/server/queries/commerce";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default async function MyOrders() {
  const s = await requireUser();
  const orders = await listMyOrders(s.sub);
  return (
    <>
      <PageHeader title="Orders & Projects" />
      {orders.length ? (
        <ul className="card divide-y divide-line">
          {orders.map((o) => (
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
        <EmptyState title="No orders yet" action={{ label: "View pricing", href: "/pricing" }} />
      )}
    </>
  );
}
