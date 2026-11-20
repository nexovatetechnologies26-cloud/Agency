import { requireStaffPage } from "@/server/auth/session";
import { listCustomers } from "@/server/queries/other";
import { toggleUserActiveAction } from "@/server/actions/team";
import { can } from "@/lib/permissions";
import { COUNTRIES } from "@/content/countries";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PendingButton } from "@/components/forms/pending-button";

export default async function AdminCustomers({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const s = await requireStaffPage("customers");
  const { q } = await searchParams;
  const rows = await listCustomers(q);
  const canManage = can(s.role, "team");

  return (
    <>
      <PageHeader
        title="Customers"
        actions={
          <form action="/admin/customers">
            <input name="q" defaultValue={q} placeholder="Search name, email, company…" className="field h-10 py-2 md:w-72" aria-label="Search customers" />
          </form>
        }
      />
      {rows.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Country</th><th className="px-5 py-3">Joined</th><th className="px-5 py-3">Email</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id} className="border-b border-line last:border-0">
                  <td className="px-5 py-4"><p className="font-semibold">{u.name}</p><p className="text-xs text-muted">{u.email}{u.company ? ` · ${u.company}` : ""}</p></td>
                  <td className="px-5 py-4">{COUNTRIES.find((c) => c.code === u.country)?.name ?? "—"}</td>
                  <td className="px-5 py-4">{fmtDate(u.createdAt)}</td>
                  <td className="px-5 py-4">{u.emailVerifiedAt ? <Badge tone="green">Verified</Badge> : <Badge tone="amber">Unverified</Badge>} {u.active === false && <Badge tone="red">Disabled</Badge>}</td>
                  <td className="px-5 py-4 text-right">
                    {canManage && (
                      <form action={toggleUserActiveAction}>
                        <input type="hidden" name="id" value={u._id} />
                        <PendingButton tone={u.active === false ? "default" : "danger"}>{u.active === false ? "Enable" : "Disable"}</PendingButton>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No customers found" />
      )}
    </>
  );
}
