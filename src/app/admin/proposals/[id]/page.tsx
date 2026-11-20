import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffPage } from "@/server/auth/session";
import { getProposalAdmin } from "@/server/queries/commerce";
import { sendProposalAction } from "@/server/actions/commerce";
import { config } from "@/server/config";
import { formatMoney, minorFactor } from "@/lib/money";
import { fmtDateTime } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { PendingButton } from "@/components/forms/pending-button";
import { ProposalForm } from "@/components/admin/proposal-form";


export default async function AdminProposal({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage("proposals");
  const p = await getProposalAdmin((await params).id);
  if (!p) notFound();
  const link = `${config.siteUrl}/proposals/${p.accessToken}`;
  const editable = !["accepted", "declined"].includes(p.status);
  const toMajor = (minor: number) => String(minor / minorFactor(p.currency));

  return (
    <>
      <PageHeader
        title={`${p.number} — ${p.title}`}
        description={`${p.clientName} · ${p.clientEmail} · ${formatMoney(p.total, p.currency)} · v${p.version}`}
        actions={
          editable ? (
            <form action={sendProposalAction}>
              <input type="hidden" name="id" value={p._id} />
              <PendingButton tone="primary" confirm={`Email this proposal to ${p.clientEmail}?`}>
                {p.status === "draft" ? "Send to client" : "Re-send"}
              </PendingButton>
            </form>
          ) : undefined
        }
      />
      <div className="card mb-6 space-y-2 p-5 text-sm">
        <div className="flex flex-wrap items-center gap-3"><StatusBadge status={p.status} />
          {p.sentAt && <span className="text-muted">Sent {fmtDateTime(p.sentAt)}</span>}
          {p.viewedAt && <span className="text-muted">· Viewed {fmtDateTime(p.viewedAt)}</span>}
          {p.respondedAt && <span className="text-muted">· Responded {fmtDateTime(p.respondedAt)}</span>}
        </div>
        {p.status !== "draft" && <p className="break-all text-muted">Client link: <a href={link} className="text-brand" target="_blank" rel="noreferrer">{link}</a></p>}
        {p.declineReason && <p>Decline reason: {p.declineReason}</p>}
        {p.order && <Link href={`/admin/orders/${p.order}`} className="font-semibold text-brand">Open order →</Link>}
      </div>
      {editable ? (
        <ProposalForm
          v={{
            id: p._id,
            leadId: p.lead ?? "",
            clientName: p.clientName,
            clientEmail: p.clientEmail,
            clientCompany: p.clientCompany ?? "",
            title: p.title,
            overview: p.overview ?? "",
            scope: p.scope.join("\n"),
            deliverables: p.deliverables.join("\n"),
            exclusions: p.exclusions.join("\n"),
            milestones: p.milestones.join("\n"),
            timeline: p.timeline ?? "",
            revisions: p.revisions ?? "",
            paymentTerms: p.paymentTerms ?? "",
            terms: p.terms ?? "",
            currency: p.currency,
            items: p.items.map((i) => `${i.description} | ${i.quantity} | ${toMajor(i.unitAmount)}`).join("\n"),
            discount: p.discount ? toMajor(p.discount) : "",
            validUntil: p.validUntil ? p.validUntil.slice(0, 10) : "",
          }}
        />
      ) : (
        <p className="text-sm text-muted">This proposal is {p.status} and can no longer be edited. <a href={link} className="text-brand" target="_blank" rel="noreferrer">View client copy</a></p>
      )}
    </>
  );
}
