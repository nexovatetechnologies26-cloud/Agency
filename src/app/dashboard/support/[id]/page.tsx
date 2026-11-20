import { notFound } from "next/navigation";
import { requireUser } from "@/server/auth/session";
import { getMyTicket } from "@/server/queries/other";
import { replyTicketAction } from "@/server/actions/support";
import { PageHeader } from "@/components/layout/app-shell";
import { StatusBadge } from "@/components/ui/badge";
import { Thread } from "@/components/support/thread";
import { ActionForm, SubmitButton, TextArea } from "@/components/forms/action-form";

export default async function MyTicket({ params }: { params: Promise<{ id: string }> }) {
  const s = await requireUser();
  const t = await getMyTicket(s.sub, (await params).id);
  if (!t) notFound();
  return (
    <>
      <PageHeader title={t.subject} description={`${t.number} · ${t.category}`} actions={<StatusBadge status={t.status} />} />
      <div className="max-w-3xl space-y-6">
        <Thread messages={t.messages} />
        {t.status !== "closed" ? (
          <ActionForm action={replyTicketAction} resetOnSuccess className="card p-6">
            <input type="hidden" name="id" value={t._id} />
            <TextArea label="Reply" name="body" rows={4} />
            <SubmitButton>Send reply</SubmitButton>
          </ActionForm>
        ) : (
          <p className="text-sm text-muted">This conversation is closed. Start a new request if you need more help.</p>
        )}
      </div>
    </>
  );
}
