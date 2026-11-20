import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { listMyInvoices } from "@/server/queries/commerce";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default async function MyInvoices() {
  const s = await requireUser();
  const invoices = await listMyInvoices(s.sub);
  return (
    <>
      <PageHeader title="Invoices & Payments" />
      {invoices.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-5 py-3">Invoice</th><th className="px-5 py-3">Issued</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Paid</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody>
              {invoices.map((i) => (
                <tr key={i._id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4"><Link href={`/dashboard/invoices/${i._id}`} className="font-semibold text-brand">{i.number}</Link></td>
                  <td className="px-5 py-4">{fmtDate(i.issuedAt)}</td>
                  <td className="px-5 py-4">{formatMoney(i.total, i.currency)}</td>
                  <td className="px-5 py-4">{formatMoney(i.amountPaid, i.currency)}</td>
                  <td className="px-5 py-4"><StatusBadge status={i.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No invoices yet" />
      )}
    </>
  );
}
