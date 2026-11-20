import { requireStaffPage } from "@/server/auth/session";
import { connectDB } from "@/server/db/mongodb";
import { AuditLog } from "@/server/models/content.model";
import { plain } from "@/server/lib/plain";
import { fmtDateTime, humanize } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AuditPage() {
  await requireStaffPage("team");
  await connectDB();
  const rows = plain(await AuditLog.find().sort({ createdAt: -1 }).limit(300).lean());
  return (
    <>
      <PageHeader title="Audit Log" description="Sensitive actions: logins, role changes, pricing changes, payments, refunds, exports." />
      {rows.length ? (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
              <tr><th className="px-5 py-3">When</th><th className="px-5 py-3">Who</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Record</th><th className="px-5 py-3">Detail</th></tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r._id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 text-muted">{fmtDateTime(r.createdAt)}</td>
                  <td className="px-5 py-3">{r.actor}</td>
                  <td className="px-5 py-3">{humanize(r.action)}</td>
                  <td className="px-5 py-3 text-muted">{[r.entity, r.entityId].filter(Boolean).join(" ")}</td>
                  <td className="px-5 py-3 text-muted">{r.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No audit entries yet" />
      )}
    </>
  );
}
