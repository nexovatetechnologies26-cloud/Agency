import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { requireUser } from "@/server/auth/session";
import { getMyOrder } from "@/server/queries/commerce";
import { submitRequirementsAction } from "@/server/actions/commerce";
import { config } from "@/server/config";
import { formatMoney } from "@/lib/money";
import { fmtDate, fmtDateTime } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { ItemsTable } from "@/components/commerce/items-table";
import { ActionForm, SubmitButton, TextArea } from "@/components/forms/action-form";
import { ButtonLink } from "@/components/ui/button";

export default async function MyOrder({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> }) {
  const s = await requireUser();
  const [{ id }, { new: isNew }] = await Promise.all([params, searchParams]);
  const o = await getMyOrder(s.sub, id);
  if (!o) notFound();

  const balance = o.total - o.amountPaid;
  const canEditRequirements = o.status === "pending" || o.status === "awaiting_requirements";

  return (
    <>
      {isNew && (
        <p className="card mb-6 border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          Your order has been placed. We&apos;ve emailed you a confirmation.
        </p>
      )}
      <PageHeader
        title={o.title}
        description={`${o.number} · placed ${fmtDate(o.createdAt)}`}
        actions={<ButtonLink href={`/dashboard/support/new?order=${o._id}`} variant="secondary">Message the team</ButtonLink>}
      />
      <div className="mb-6 flex flex-wrap gap-2"><StatusBadge status={o.status} /><StatusBadge status={o.paymentStatus} /></div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* milestones — real milestones set by the team, no invented percentages */}
          <section className="card p-6">
            <h2 className="text-lg">Milestones</h2>
            {o.milestones.length ? (
              <ol className="mt-4 space-y-3">
                {o.milestones.map((m) => (
                  <li key={m._id} className="flex items-start gap-3 text-sm">
                    {m.status === "done" ? <CheckCircle2 size={18} className="text-emerald-600" /> : m.status === "in_progress" ? <Clock size={18} className="text-brand" /> : <Circle size={18} className="text-line" />}
                    <div>
                      <p className="font-medium">{m.title}</p>
                      {m.dueDate && <p className="text-xs text-muted">Target: {fmtDate(m.dueDate)}</p>}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-muted">Milestones will appear here once your project is planned.</p>
            )}
          </section>

          <section className="card p-6">
            <h2 className="text-lg">Project updates</h2>
            {o.updates.length ? (
              <ul className="mt-4 space-y-4">
                {[...o.updates].reverse().map((u) => (
                  <li key={u._id} className="border-l-2 border-brand pl-4">
                    <p className="whitespace-pre-wrap text-sm">{u.body}</p>
                    <p className="mt-1 text-xs text-muted">{u.author} · {fmtDateTime(u.createdAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">No updates yet.</p>
            )}
          </section>

          <section className="card p-6">
            <h2 className="text-lg">Requirements</h2>
            {canEditRequirements ? (
              <ActionForm action={submitRequirementsAction} className="mt-4">
                <input type="hidden" name="id" value={o._id} />
                <TextArea label="Describe what you need" name="requirements" rows={7} defaultValue={o.requirements ?? ""} hint="Goals, features, references, links to files (e.g. Google Drive), brand details." />
                <SubmitButton>Save requirements</SubmitButton>
              </ActionForm>
            ) : (
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink/85">{o.requirements || "—"}</p>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-lg">Summary</h2>
            <div className="mt-4">
              <ItemsTable items={o.items} currency={o.currency} subtotal={o.subtotal} discount={o.discount} total={o.total} paid={o.amountPaid - (o.amountRefunded ?? 0)} />
            </div>
            <Link href="/dashboard/invoices" className="mt-4 inline-block text-sm font-semibold text-brand">View invoices →</Link>
          </section>

          {balance > 0 && !["cancelled", "refunded"].includes(o.status) && (
            <section className="card p-6">
              <h2 className="text-lg">How to pay</h2>
              <p className="mt-2 text-sm text-muted">Balance due: <strong className="text-ink">{formatMoney(balance, o.currency)}</strong></p>
              {config.payment.manualInstructions ? (
                <>
                  <p className="mt-4 whitespace-pre-wrap rounded-xl bg-paper p-4 text-sm">{config.payment.manualInstructions}</p>
                  <p className="mt-3 text-xs text-muted">Please include <strong>{o.number}</strong> as the payment reference. Your payment status updates after our team confirms receipt.</p>
                </>
              ) : (
                <p className="mt-4 text-sm text-muted">Our team will contact you with payment details for this order.</p>
              )}
            </section>
          )}
        </div>
      </div>
    </>
  );
}
