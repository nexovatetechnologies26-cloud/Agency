import { requireStaffPage } from "@/server/auth/session";
import { listStatsAdmin } from "@/server/queries/other";
import { addExampleStatsAction, deleteStatAction, saveStatAction } from "@/server/actions/content";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { PendingButton } from "@/components/forms/pending-button";
import { ActionForm, Checkbox, Field, SubmitButton } from "@/components/forms/action-form";

export default async function AdminStats() {
  await requireStaffPage("content");
  const rows = await listStatsAdmin();
  const live = rows.filter((r) => r.published).length;

  return (
    <>
      <PageHeader
        title="Numbers"
        description="The figures shown on the homepage (e.g. “60+ Projects delivered”). Only published figures appear — use real, verifiable numbers."
      />

      {rows.length === 0 && (
        <div className="card mb-6 flex flex-wrap items-center justify-between gap-4 p-6">
          <p className="text-sm text-muted">No figures yet. Start from four hidden examples and replace them with your real numbers.</p>
          <form action={addExampleStatsAction}>
            <PendingButton tone="primary">Add example figures</PendingButton>
          </form>
        </div>
      )}

      {rows.length > 0 && (
        <p className="mb-4 text-sm text-muted">
          {live} of {rows.length} published{live === 0 ? " — the Numbers section stays hidden on the website until you publish at least one." : "."}
        </p>
      )}

      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r._id} className="card p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-serif text-2xl text-ink">
                {r.value} <span className="font-sans text-sm text-muted">{r.label}</span>
              </p>
              {r.published ? <Badge tone="green">Published</Badge> : <Badge>Hidden</Badge>}
            </div>
            <ActionForm action={saveStatAction} className="grid items-end gap-4 space-y-0 md:grid-cols-[110px_1fr_1fr_80px]">
              <input type="hidden" name="id" value={r._id} />
              <Field label="Figure" id={`value-${r._id}`} name="value" defaultValue={r.value} placeholder="60+" />
              <Field label="Label" id={`label-${r._id}`} name="label" defaultValue={r.label} placeholder="Projects delivered" />
              <Field label="Small note" id={`note-${r._id}`} name="note" optional defaultValue={r.note ?? ""} placeholder="e.g. since 2021" />
              <Field label="Order" id={`sort-${r._id}`} name="sort" type="number" defaultValue={String(r.sort ?? 0)} />
              <div className="flex flex-wrap items-center gap-4 md:col-span-4">
                <Checkbox name="published" id={`published-${r._id}`} defaultChecked={Boolean(r.published)}>
                  Published
                </Checkbox>
                <SubmitButton>Save</SubmitButton>
              </div>
            </ActionForm>
            <form action={deleteStatAction} className="mt-3">
              <input type="hidden" name="id" value={r._id} />
              <PendingButton tone="danger" confirm={`Delete “${r.value} ${r.label}”?`}>
                Delete
              </PendingButton>
            </form>
          </div>
        ))}
      </div>

      <div className="card mt-8 p-6">
        <h2 className="text-lg">Add a figure</h2>
        <ActionForm action={saveStatAction} resetOnSuccess className="mt-4 grid items-end gap-4 space-y-0 md:grid-cols-[110px_1fr_1fr_80px]">
          <Field label="Figure" id="value-new" name="value" placeholder="60+" />
          <Field label="Label" id="label-new" name="label" placeholder="Projects delivered" />
          <Field label="Small note" id="note-new" name="note" optional placeholder="e.g. since 2021" />
          <Field label="Order" id="sort-new" name="sort" type="number" defaultValue="0" />
          <div className="flex flex-wrap items-center gap-4 md:col-span-4">
            <Checkbox name="published" id="published-new">
              Published
            </Checkbox>
            <SubmitButton>Add figure</SubmitButton>
          </div>
        </ActionForm>
      </div>
    </>
  );
}
