import Link from "next/link";
import { requireStaffPage } from "@/server/auth/session";
import { listProposals } from "@/server/queries/commerce";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default async function AdminProposals() {
  await requireStaffPage("proposals");
  const rows = await listProposals();
  return (
    <>
      <PageHeader title="Proposals" actions={<ButtonLink href="/admin/proposals/new">New proposal</ButtonLink>} />
      {rows.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-5 py-3">Proposal</th><th className="px-5 py-3">Client</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Created</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p._id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4"><Link href={`/admin/proposals/${p._id}`} className="font-semibold text-brand">{p.number}</Link><p className="text-xs text-muted">{p.title}</p></td>
                  <td className="px-5 py-4">{p.clientName}<p className="text-xs text-muted">{p.clientEmail}</p></td>
                  <td className="px-5 py-4">{formatMoney(p.total, p.currency)}</td>
                  <td className="px-5 py-4">{fmtDate(p.createdAt)}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No proposals yet" text="Create one from a lead or from scratch." action={{ label: "New proposal", href: "/admin/proposals/new" }} />
      )}
    </>
  );
}
