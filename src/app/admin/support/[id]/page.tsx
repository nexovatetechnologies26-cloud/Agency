import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, UserRound } from "lucide-react";
import { requireStaffPage } from "@/server/auth/session";
import { getTicketAdmin } from "@/server/queries/other";
import { replyTicketAction, setTicketStatusAction } from "@/server/actions/support";
import { TICKET_STATUSES } from "@/lib/constants";
import { humanize } from "@/lib/format";
import { StatusBadge } from "@/components/ui/badge";
import { Thread } from "@/components/support/thread";
import { PendingButton } from "@/components/forms/pending-button";
import { ActionForm, SubmitButton, TextArea } from "@/components/forms/action-form";

export default async function AdminTicket({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage("support");
  const t = await getTicketAdmin((await params).id);
  if (!t) notFound();
  const name = t.customer?.name ?? "Client";

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/inbox" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand">
        <ArrowLeft size={15} aria-hidden /> Inbox
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-bold text-white">
            {name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="text-[1.6rem] tracking-[-0.03em]">{t.subject}</h1>
            <p className="mt-0.5 text-sm text-muted">
              {name} · <a href={`mailto:${t.customer?.email}`} className="hover:text-brand">{t.customer?.email}</a> · {t.number}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-3 py-1.5 text-xs font-semibold text-ink/70">
            <UserRound size={13} aria-hidden /> Client message · {t.category}
          </span>
          <StatusBadge status={t.status} />
        </div>
      </header>

      {t.order && (
        <Link href={`/admin/orders/${t.order}`} className="mt-4 inline-block text-sm font-semibold text-brand">
          Related order →
        </Link>
      )}

      <section aria-label="Conversation" className="mt-6 rounded-2xl border border-line bg-surface p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand">Conversation</p>
        <div className="mt-4">
          <Thread messages={t.messages} staffView />
        </div>

        <div className="mt-6 border-t border-line pt-5">
          {t.status !== "closed" ? (
            <ActionForm action={replyTicketAction} resetOnSuccess className="space-y-4">
              <input type="hidden" name="id" value={t._id} />
              <TextArea label="Your reply" name="body" rows={5} hint="The client is emailed and sees your reply in their dashboard (Support & Messages)." />
              <SubmitButton>Send reply</SubmitButton>
            </ActionForm>
          ) : (
            <p className="text-sm text-muted">This conversation is closed. Re-open it below to reply.</p>
          )}
        </div>
      </section>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm text-muted">Mark as</span>
        {TICKET_STATUSES.filter((st) => st !== t.status).map((st) => (
          <form key={st} action={setTicketStatusAction}>
            <input type="hidden" name="id" value={t._id} />
            <input type="hidden" name="status" value={st} />
            <PendingButton>{humanize(st)}</PendingButton>
          </form>
        ))}
      </div>
    </div>
  );
}
