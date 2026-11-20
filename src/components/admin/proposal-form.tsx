import { saveProposalAction } from "@/server/actions/commerce";
import { CURRENCIES } from "@/lib/constants";
import { ActionForm, Field, Select, SubmitButton, TextArea } from "@/components/forms/action-form";

export type ProposalFormValues = {
  id?: string;
  leadId?: string;
  clientName?: string;
  clientEmail?: string;
  clientCompany?: string;
  title?: string;
  overview?: string;
  scope?: string;
  deliverables?: string;
  exclusions?: string;
  milestones?: string;
  timeline?: string;
  revisions?: string;
  paymentTerms?: string;
  terms?: string;
  currency?: string;
  items?: string;
  discount?: string;
  validUntil?: string;
};

export function ProposalForm({ v = {} }: { v?: ProposalFormValues }) {
  return (
    <ActionForm action={saveProposalAction} className="card max-w-4xl p-7">
      <input type="hidden" name="id" value={v.id ?? ""} />
      <input type="hidden" name="leadId" value={v.leadId ?? ""} />
      <h2 className="text-lg">Client</h2>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Client name" name="clientName" defaultValue={v.clientName} />
        <Field label="Client email" name="clientEmail" type="email" defaultValue={v.clientEmail} hint="They must sign in with this email to accept." />
        <Field label="Company" name="clientCompany" optional defaultValue={v.clientCompany} />
      </div>
      <h2 className="pt-4 text-lg">Project</h2>
      <Field label="Proposal title" name="title" defaultValue={v.title} />
      <TextArea label="Project overview" name="overview" rows={4} defaultValue={v.overview} />
      <div className="grid gap-5 md:grid-cols-2">
        <TextArea label="Scope of work" name="scope" hint="One item per line" defaultValue={v.scope} />
        <TextArea label="Deliverables" name="deliverables" hint="One item per line" defaultValue={v.deliverables} />
        <TextArea label="Milestones" name="milestones" hint="One per line — become project milestones on acceptance" defaultValue={v.milestones} />
        <TextArea label="Exclusions" name="exclusions" hint="One item per line" defaultValue={v.exclusions} />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Timeline" name="timeline" optional defaultValue={v.timeline} placeholder="e.g. 6 weeks" />
        <Field label="Revisions" name="revisions" optional defaultValue={v.revisions} placeholder="e.g. 2 rounds" />
        <Field label="Valid until" name="validUntil" type="date" optional defaultValue={v.validUntil} />
      </div>
      <h2 className="pt-4 text-lg">Pricing</h2>
      <div className="grid gap-5 sm:grid-cols-3">
        <Select label="Currency" name="currency" defaultValue={v.currency ?? "USD"} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
        <Field label="Discount" name="discount" optional defaultValue={v.discount} placeholder="0" />
      </div>
      <TextArea
        label="Line items"
        name="items"
        rows={5}
        defaultValue={v.items}
        hint='One per line: Description | quantity | unit price — e.g. "Website design | 1 | 1500"'
        className="font-mono"
      />
      <Field label="Payment terms" name="paymentTerms" optional defaultValue={v.paymentTerms} placeholder="e.g. 50% upfront, 50% on delivery" />
      <TextArea label="Terms" name="terms" optional rows={4} defaultValue={v.terms} />
      <SubmitButton>Save proposal</SubmitButton>
    </ActionForm>
  );
}
