import { savePackageAction } from "@/server/actions/commerce";
import { services } from "@/content/services";
import { CURRENCIES } from "@/lib/constants";
import { ActionForm, Checkbox, Field, Select, SubmitButton, TextArea } from "@/components/forms/action-form";

export type PackageFormValues = {
  id?: string;
  serviceSlug?: string;
  name?: string;
  description?: string;
  price?: string;
  currency?: string;
  billing?: string;
  deliverables?: string;
  exclusions?: string;
  revisions?: string;
  deliveryDays?: string;
  terms?: string;
  featured?: boolean;
  active?: boolean;
  sort?: string;
};

export function PackageForm({ v = {} }: { v?: PackageFormValues }) {
  return (
    <ActionForm action={savePackageAction} className="card max-w-3xl p-7">
      <input type="hidden" name="id" value={v.id ?? ""} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select label="Service" name="serviceSlug" placeholder="Select a service" defaultValue={v.serviceSlug ?? ""} options={services.map((s) => ({ value: s.slug, label: s.title }))} />
        <Field label="Package name" name="name" defaultValue={v.name} placeholder="e.g. Starter Website" />
      </div>
      <TextArea label="Short description" name="description" optional rows={2} defaultValue={v.description} />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Price" name="price" inputMode="decimal" defaultValue={v.price} placeholder="499" />
        <Select label="Currency" name="currency" defaultValue={v.currency ?? "USD"} options={CURRENCIES.map((c) => ({ value: c, label: c }))} />
        <Select label="Billing" name="billing" defaultValue={v.billing ?? "one_time"} options={[{ value: "one_time", label: "One-time" }, { value: "monthly", label: "Monthly" }]} />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <TextArea label="Deliverables" name="deliverables" hint="One per line" defaultValue={v.deliverables} />
        <TextArea label="Exclusions" name="exclusions" hint="One per line" optional defaultValue={v.exclusions} />
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Revisions" name="revisions" type="number" min={0} optional defaultValue={v.revisions} />
        <Field label="Delivery (days)" name="deliveryDays" type="number" min={1} optional defaultValue={v.deliveryDays} />
        <Field label="Sort order" name="sort" type="number" optional defaultValue={v.sort ?? "0"} />
      </div>
      <TextArea label="Package terms" name="terms" optional rows={3} defaultValue={v.terms} />
      <Checkbox name="featured" defaultChecked={v.featured}>Highlight as &quot;Most popular&quot;</Checkbox>
      <Checkbox name="active" defaultChecked={v.active}>Active — visible and purchasable on the Pricing page</Checkbox>
      <SubmitButton>Save package</SubmitButton>
    </ActionForm>
  );
}
