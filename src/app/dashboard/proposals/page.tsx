import Link from "next/link";
import { requireUser } from "@/server/auth/session";
import { listMyProposals } from "@/server/queries/commerce";
import { formatMoney } from "@/lib/money";
import { fmtDate } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

export default async function MyProposals() {
  const s = await requireUser();
  const proposals = await listMyProposals(s.email);
  return (
    <>
      <PageHeader title="Proposals" description={`Proposals sent to ${s.email}`} />
      {proposals.length ? (
        <ul className="card divide-y divide-line">
          {proposals.map((p) => (
            <li key={p._id}>
              <Link href={`/proposals/${p.accessToken}`} className="flex flex-wrap items-center justify-between gap-3 p-5 hover:bg-paper">
                <div>
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-xs text-muted">{p.number} · {fmtDate(p.sentAt ?? p.createdAt)} · {formatMoney(p.total, p.currency)}</p>
                </div>
                <StatusBadge status={p.status} />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState title="No proposals yet" text="Request a custom quote and we'll prepare a proposal for you." action={{ label: "Get a quote", href: "/get-a-quote" }} />
      )}
    </>
  );
}
