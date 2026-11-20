import Link from "next/link";
import clsx from "clsx";
import { requireStaffPage } from "@/server/auth/session";
import { getLeadStats, listLeads } from "@/server/services/lead.service";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/constants";
import { LeadsTable } from "@/components/admin/leads-table";
import { PageHeader } from "@/components/layout/app-shell";
import { config } from "@/server/config";
import { can } from "@/lib/permissions";

export const dynamic = "force-dynamic";

type Search = { status?: string; q?: string; page?: string };

export default async function AdminPage({ searchParams }: { searchParams: Promise<Search> }) {
  const session = await requireStaffPage("leads");

  const sp = await searchParams;
  const page = Number(sp.page) || 1;

  let data: Awaited<ReturnType<typeof listLeads>> | null = null;
  let stats: Awaited<ReturnType<typeof getLeadStats>> | null = null;
  let dbError = false;
  try {
    [data, stats] = await Promise.all([listLeads({ status: sp.status, q: sp.q, page }), getLeadStats()]);
  } catch (err) {
    console.error("[admin] database error", err);
    dbError = true;
  }

  const qs = (patch: Partial<Search>) => {
    const p = new URLSearchParams();
    const merged = { status: sp.status, q: sp.q, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, String(v));
    const s = p.toString();
    return s ? `/admin/leads?${s}` : "/admin/leads";
  };

  return (
    <>

      <div>
        <PageHeader
          title="Leads"
          description="Inquiries from the website, quote form and consultation bookings."
          actions={
            <a download href="/api/admin/export/leads" className="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold hover:border-brand hover:text-brand">Export CSV</a>}
        />

        {dbError || !data || !stats ? (
          <div className="card mt-6 p-6 text-sm text-red-700" role="alert">
            Could not connect to the database. Check MONGODB_URI and your Atlas network access settings.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                ["Total leads", stats.total],
                ["New", stats.byStatus.new],
                ["Proposal sent", stats.byStatus.proposal_sent],
                ["Won", stats.byStatus.won],
              ].map(([label, value]) => (
                <div key={label} className="card p-5">
                  <p className="text-xs font-medium text-muted">{label}</p>
                  <p className="mt-2 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <Link
                  href={qs({ status: undefined, page: undefined })}
                  className={clsx(
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium",
                    !sp.status ? "border-brand bg-brand text-white" : "border-line bg-white",
                  )}
                >
                  All
                </Link>
                {LEAD_STATUSES.map((s) => (
                  <Link
                    key={s}
                    href={qs({ status: s, page: undefined })}
                    className={clsx(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium",
                      sp.status === s ? "border-brand bg-brand text-white" : "border-line bg-white",
                    )}
                  >
                    {LEAD_STATUS_LABELS[s]} ({stats.byStatus[s]})
                  </Link>
                ))}
              </div>
              <form action="/admin/leads" className="flex gap-2">
                {sp.status && <input type="hidden" name="status" value={sp.status} />}
                <input name="q" defaultValue={sp.q} placeholder="Search name, email, company…" className="field h-10 py-2 md:w-72" />
              </form>
            </div>

            <LeadsTable leads={data.items} canAi={config.ai.enabled && can(session.role, "ai")} canPropose={can(session.role, "proposals")} />

            {data.pages > 1 && (
              <nav className="mt-6 flex items-center justify-between text-sm" aria-label="Pagination">
                <span className="text-muted">Page {data.page} of {data.pages}</span>
                <div className="flex gap-2">
                  {data.page > 1 && <Link className="rounded-full border border-line bg-white px-4 py-2" href={qs({ page: String(data.page - 1) })}>Previous</Link>}
                  {data.page < data.pages && <Link className="rounded-full border border-line bg-white px-4 py-2" href={qs({ page: String(data.page + 1) })}>Next</Link>}
                </div>
              </nav>
            )}
          </>
        )}
      </div>
    </>
  );
}
