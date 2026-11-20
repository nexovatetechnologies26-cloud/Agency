import { requireUser } from "@/server/auth/session";
import { listMyOrders } from "@/server/queries/commerce";
import { createTicketAction } from "@/server/actions/support";
import { TICKET_CATEGORIES } from "@/lib/constants";
import { PageHeader } from "@/components/layout/app-shell";
import { ActionForm, Field, Select, SubmitButton, TextArea } from "@/components/forms/action-form";

export default async function NewTicket({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const s = await requireUser();
  const [{ order }, orders] = await Promise.all([searchParams, listMyOrders(s.sub)]);
  return (
    <>
      <PageHeader title="New request" />
      <ActionForm action={createTicketAction} className="card max-w-2xl p-7">
        <Field label="Subject" name="subject" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Category" name="category" defaultValue="General" options={TICKET_CATEGORIES.map((c) => ({ value: c, label: c }))} />
          <Select label="Related order" name="orderId" optional placeholder="None" defaultValue={order ?? ""} options={orders.map((o) => ({ value: o._id, label: `${o.number} — ${o.title}` }))} />
        </div>
        <TextArea label="Message" name="body" rows={6} />
        <SubmitButton>Send</SubmitButton>
      </ActionForm>
    </>
  );
}
