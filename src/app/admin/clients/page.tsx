import { requireStaffPage } from "@/server/auth/session";
import { listClientLogosAdmin } from "@/server/queries/other";
import { deleteClientLogoAction, saveClientLogoAction } from "@/server/actions/content";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { PendingButton } from "@/components/forms/pending-button";
import { ActionForm, Checkbox, Field, SubmitButton } from "@/components/forms/action-form";

export default async function AdminClients() {
  await requireStaffPage("content");
  const rows = await listClientLogosAdmin();

  return (
    <>
      <PageHeader
        title="Clients"
        description="Logos for the “Trusted by” strip on the homepage. Add only clients who agreed to be listed — the strip stays hidden until at least one logo is published."
      />

      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r._id} className="card p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-28 items-center justify-center rounded-tile border border-line bg-paper p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided logo URL */}
                  <img src={r.logo} alt={r.name} className="max-h-full max-w-full object-contain" />
                </span>
                <p className="font-semibold">{r.name}</p>
              </div>
              {r.published ? <Badge tone="green">Published</Badge> : <Badge>Hidden</Badge>}
            </div>
            <ActionForm action={saveClientLogoAction} className="grid items-end gap-4 space-y-0 md:grid-cols-[1fr_1.4fr_1.2fr_80px]">
              <input type="hidden" name="id" value={r._id} />
              <Field label="Client name" id={`name-${r._id}`} name="name" defaultValue={r.name} />
              <Field label="Logo URL" id={`logo-${r._id}`} name="logo" defaultValue={r.logo} />
              <Field label="Website" id={`url-${r._id}`} name="url" optional defaultValue={r.url ?? ""} />
              <Field label="Order" id={`sort-${r._id}`} name="sort" type="number" defaultValue={String(r.sort ?? 0)} />
              <div className="flex flex-wrap items-center gap-4 md:col-span-4">
                <Checkbox name="published" id={`published-${r._id}`} defaultChecked={Boolean(r.published)}>
                  Published
                </Checkbox>
                <SubmitButton>Save</SubmitButton>
              </div>
            </ActionForm>
            <form action={deleteClientLogoAction} className="mt-3">
              <input type="hidden" name="id" value={r._id} />
              <PendingButton tone="danger" confirm={`Remove ${r.name}?`}>
                Delete
              </PendingButton>
            </form>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-6">
        <h2 className="text-lg">Add a client</h2>
        <p className="mt-1 text-sm text-muted">Tip: a transparent SVG or PNG logo looks best. Logos are shown in grey and turn to colour on hover.</p>
        <ActionForm action={saveClientLogoAction} resetOnSuccess className="mt-4 grid items-end gap-4 space-y-0 md:grid-cols-[1fr_1.4fr_1.2fr_80px]">
          <Field label="Client name" id="name-new" name="name" />
          <Field label="Logo URL" id="logo-new" name="logo" placeholder="https://…/logo.svg" />
          <Field label="Website" id="url-new" name="url" optional placeholder="https://" />
          <Field label="Order" id="sort-new" name="sort" type="number" defaultValue="0" />
          <div className="flex flex-wrap items-center gap-4 md:col-span-4">
            <Checkbox name="published" id="published-new">
              Published
            </Checkbox>
            <SubmitButton>Add client</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </>
  );
}
