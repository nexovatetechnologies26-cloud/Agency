import Link from "next/link";
import clsx from "clsx";
import { requireStaffPage } from "@/server/auth/session";
import { listTickets } from "@/server/queries/other";
import { TICKET_STATUSES } from "@/lib/constants";
import { fmtDateTime, humanize } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default async function AdminSupport({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireStaffPage("support");
  const { status } = await searchParams;
  const valid = status && (TICKET_STATUSES as readonly string[]).includes(status) ? status : undefined;
  const rows = await listTickets(valid);
  return (
    <>
      <PageHeader title="Support" description={valid ? undefined : "Showing open and awaiting-customer tickets."} />
      <div className="mb-5 flex flex-wrap gap-2">
        <Link href="/admin/support" className={clsx("rounded-full border px-3.5 py-1.5 text-xs font-medium", !valid ? "border-brand bg-brand text-white" : "border-line bg-surface")}>Active</Link>
        {TICKET_STATUSES.map((st) => (
          <Link key={st} href={`/admin/support?status=${st}`} className={clsx("rounded-full border px-3.5 py-1.5 text-xs font-medium", valid === st ? "border-brand bg-brand text-white" : "border-line bg-surface")}>{humanize(st)}</Link>
        ))}
      </div>
      {rows.length ? (
        <ul className="card divide-y divide-line">
          {rows.map((t) => (
            <li key={t._id}>
              <Link href={`/admin/support/${t._id}`} className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-paper">
                <div>
                  <p className="font-semibold">{t.subject}</p>
                  <p className="text-xs text-muted">{t.number} · {t.customer?.name} · {t.category} · {humanize(t.priority ?? "normal")} · {fmtDateTime(t.updatedAt)}</p>
                </div>
                <StatusBadge status={t.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No tickets here" />
      )}
    </>
  );
}
