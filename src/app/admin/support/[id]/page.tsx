import Link from "next/link";
import { notFound } from "next/navigation";
import { requireStaffPage } from "@/server/auth/session";
import { getTicketAdmin } from "@/server/queries/other";
import { replyTicketAction, setTicketStatusAction } from "@/server/actions/support";
import { TICKET_STATUSES } from "@/lib/constants";
import { humanize } from "@/lib/format";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { Thread } from "@/components/support/thread";
import { PendingButton } from "@/components/forms/pending-button";
import { ActionForm, SubmitButton, TextArea } from "@/components/forms/action-form";

export default async function AdminTicket({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage("support");
  const t = await getTicketAdmin((await params).id);
  if (!t) notFound();
  return (
    <>
      <PageHeader title={t.subject} description={`${t.number} · ${t.customer?.name} (${t.customer?.email}) · ${t.category}`} actions={<StatusBadge status={t.status} />} />
      {t.order && <Link href={`/admin/orders/${t.order}`} className="mb-4 inline-block text-sm font-semibold text-brand">Related order →</Link>}
      <div className="max-w-3xl space-y-6">
        <Thread messages={t.messages} staffView />
        {t.status !== "closed" ? (
          <ActionForm action={replyTicketAction} resetOnSuccess className="card p-6">
            <input type="hidden" name="id" value={t._id} />
            <TextArea label="Reply to customer" name="body" rows={4} hint="The customer is notified by email." />
            <SubmitButton>Send reply</SubmitButton>
          </ActionForm>
        ) : (
          <p className="card p-5 text-sm text-muted">This ticket is closed. Re-open it below to reply.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {TICKET_STATUSES.filter((st) => st !== t.status).map((st) => (
            <form key={st} action={setTicketStatusAction}>
              <input type="hidden" name="id" value={t._id} />
              <input type="hidden" name="status" value={st} />
              <PendingButton>Mark {humanize(st).toLowerCase()}</PendingButton>
            </form>
          ))}
        </div>
      </div>
    </>
  );
}
