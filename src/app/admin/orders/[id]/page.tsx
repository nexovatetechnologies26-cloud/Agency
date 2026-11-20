import { notFound } from "next/navigation";
import { requireStaffPage } from "@/server/auth/session";
import { getOrderAdmin } from "@/server/queries/commerce";
import { listStaff } from "@/server/queries/other";
import {
  addInternalNoteAction,
  addMilestoneAction,
  addOrderUpdateAction,
  assignOrderAction,
  recordPaymentAction,
  setMilestoneStatusAction,
  updateOrderStatusAction,
} from "@/server/actions/commerce";
import { nextStatuses } from "@/lib/order-status";
import { MILESTONE_STATUSES, ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/constants";
import { can } from "@/lib/permissions";
import { formatMoney } from "@/lib/money";
import { fmtDate, fmtDateTime, humanize } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { ItemsTable } from "@/components/commerce/items-table";
import { PendingButton } from "@/components/forms/pending-button";
import { ActionForm, Field, Select, SubmitButton } from "@/components/forms/action-form";

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireStaffPage("orders");
  const o = await getOrderAdmin((await params).id);
  if (!o) notFound();
  if ((s.role === "developer" || s.role === "designer") && o.assignee !== s.sub) notFound();
  const staff = (await listStaff()).filter((u) => u.active !== false);
  const finance = can(s.role, "finance");

  return (
    <>
      <PageHeader title={`${o.number} — ${o.title}`} description={`${o.customer?.name} · ${o.customer?.email} · created ${fmtDate(o.createdAt)}`} />
      <div className="mb-6 flex flex-wrap gap-2"><StatusBadge status={o.status} /><StatusBadge status={o.paymentStatus} /></div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-base">Change status</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {nextStatuses(o.status as OrderStatus)
                .filter((st) => st !== "refunded" || finance)
                .map((st) => (
                  <form key={st} action={updateOrderStatusAction}>
                    <input type="hidden" name="id" value={o._id} />
                    <input type="hidden" name="status" value={st} />
                    <PendingButton tone={st === "cancelled" ? "danger" : "default"} confirm={`Change status to "${ORDER_STATUS_LABELS[st]}"? The customer is emailed.`}>
                      → {ORDER_STATUS_LABELS[st]}
                    </PendingButton>
                  </form>
                ))}
              {nextStatuses(o.status as OrderStatus).length === 0 && <p className="text-sm text-muted">No further status changes.</p>}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="text-base">Milestones</h2>
            <ul className="mt-3 divide-y divide-line">
              {o.milestones.map((m) => (
                <li key={m._id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
                  <div><p className="font-medium">{m.title}</p>{m.dueDate && <p className="text-xs text-muted">Due {fmtDate(m.dueDate)}</p>}</div>
                  <div className="flex gap-1.5">
                    {MILESTONE_STATUSES.map((st) => (
                      <form key={st} action={setMilestoneStatusAction}>
                        <input type="hidden" name="id" value={o._id} />
                        <input type="hidden" name="milestoneId" value={m._id} />
                        <input type="hidden" name="status" value={st} />
                        <PendingButton tone={m.status === st ? "primary" : "default"}>{humanize(st)}</PendingButton>
                      </form>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
            <form action={addMilestoneAction} className="mt-4 flex flex-wrap gap-2">
              <input type="hidden" name="id" value={o._id} />
              <input name="title" required placeholder="New milestone" className="field h-10 flex-1 py-2" aria-label="Milestone title" />
              <input name="dueDate" type="date" className="field h-10 w-40 py-2" aria-label="Due date" />
              <PendingButton tone="primary">Add</PendingButton>
            </form>
          </section>

          <section className="card p-6">
            <h2 className="text-base">Customer-visible updates</h2>
            <ul className="mt-3 space-y-3">
              {o.updates.map((u) => (
                <li key={u._id} className="border-l-2 border-brand pl-3 text-sm"><p className="whitespace-pre-wrap">{u.body}</p><p className="text-xs text-muted">{u.author} · {fmtDateTime(u.createdAt)}</p></li>
              ))}
            </ul>
            <form action={addOrderUpdateAction} className="mt-4 space-y-2">
              <input type="hidden" name="id" value={o._id} />
              <textarea name="body" required rows={3} className="field" placeholder="Post an update — the customer is emailed" aria-label="Update" />
              <PendingButton tone="primary">Post update</PendingButton>
            </form>
          </section>

          <section className="card p-6">
            <h2 className="text-base">Internal notes <span className="text-xs font-normal text-muted">(staff only)</span></h2>
            <ul className="mt-3 space-y-3">
              {(o.internalNotes ?? []).map((n) => (
                <li key={n._id} className="rounded-xl bg-paper p-3 text-sm"><p className="whitespace-pre-wrap">{n.body}</p><p className="text-xs text-muted">{n.author} · {fmtDateTime(n.createdAt)}</p></li>
              ))}
            </ul>
            <form action={addInternalNoteAction} className="mt-4 space-y-2">
              <input type="hidden" name="id" value={o._id} />
              <textarea name="body" required rows={2} className="field" placeholder="Add an internal note" aria-label="Internal note" />
              <PendingButton>Add note</PendingButton>
            </form>
          </section>

          <section className="card p-6">
            <h2 className="text-base">Requirements</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm">{o.requirements || "Not provided yet."}</p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="text-base">Summary</h2>
            <div className="mt-3"><ItemsTable items={o.items} currency={o.currency} subtotal={o.subtotal} discount={o.discount} total={o.total} paid={o.amountPaid - (o.amountRefunded ?? 0)} /></div>
          </section>

          <section className="card p-6">
            <h2 className="text-base">Assignment</h2>
            <form action={assignOrderAction} className="mt-3 flex gap-2">
              <input type="hidden" name="id" value={o._id} />
              <select name="assignee" defaultValue={o.assignee ?? ""} className="field h-10 py-2" aria-label="Assignee">
                <option value="">Unassigned</option>
                {staff.map((u) => <option key={u._id} value={u._id}>{u.name} ({humanize(u.role)})</option>)}
              </select>
              <PendingButton>Save</PendingButton>
            </form>
          </section>

          {finance && (
            <section className="card p-6">
              <h2 className="text-base">Payments</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {o.payments.length === 0 && <li className="text-muted">No payments recorded.</li>}
                {o.payments.map((p) => (
                  <li key={p._id} className="flex justify-between gap-3">
                    <span>{p.amount < 0 ? "Refund" : "Payment"} · {p.method}{p.reference ? ` · ${p.reference}` : ""}<br /><span className="text-xs text-muted">{p.recordedBy} · {fmtDateTime(p.createdAt)}</span></span>
                    <span className="font-medium">{formatMoney(Math.abs(p.amount), o.currency)}</span>
                  </li>
                ))}
              </ul>
              <ActionForm action={recordPaymentAction} className="mt-5 border-t border-line pt-5" resetOnSuccess>
                <input type="hidden" name="id" value={o._id} />
                <div className="grid grid-cols-2 gap-3">
                  <Select label="Type" name="kind" defaultValue="payment" options={[{ value: "payment", label: "Payment received" }, { value: "refund", label: "Refund issued" }]} />
                  <Field label={`Amount (${o.currency})`} name="amount" inputMode="decimal" />
                </div>
                <Field label="Method" name="method" placeholder="Bank transfer, card, Payoneer…" />
                <Field label="Reference" name="reference" optional placeholder="Transaction ID" />
                <SubmitButton>Record</SubmitButton>
                <p className="text-xs text-muted">Only record money you have actually received or returned. Every entry is audit-logged.</p>
              </ActionForm>
            </section>
          )}

          <section className="card p-6">
            <h2 className="text-base">Activity</h2>
            <ul className="mt-3 space-y-1.5 text-xs text-muted">
              {[...(o.activity ?? [])].reverse().slice(0, 30).map((a, i) => (
                <li key={i}>{fmtDateTime(a.createdAt)} · {a.actor} · {humanize(a.action ?? "")} {a.detail ? `(${a.detail})` : ""}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
