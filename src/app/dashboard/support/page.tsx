import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { listMyTickets } from "@/server/queries/other";
import { fmtDateTime } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ButtonLink } from "@/components/ui/button";

export default async function MySupport() {
  const s = await requireUser();
  const tickets = await listMyTickets(s.sub);
  return (
    <>
      <PageHeader title="Support & Messages" actions={<ButtonLink href="/dashboard/support/new">New request</ButtonLink>} />
      {tickets.length ? (
        <ul className="card divide-y divide-line">
          {tickets.map((t) => (
            <li key={t._id}>
              <Link href={`/dashboard/support/${t._id}`} className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-paper">
                <div>
                  <p className="font-semibold">{t.subject}</p>
                  <p className="text-xs text-muted">{t.number} · {t.category} · updated {fmtDateTime(t.updatedAt)}</p>
                </div>
                <StatusBadge status={t.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No conversations yet" text="Questions about a project or invoice? Send us a message." action={{ label: "New request", href: "/dashboard/support/new" }} />
      )}
    </>
  );
}
