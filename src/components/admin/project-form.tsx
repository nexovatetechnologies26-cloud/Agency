import { deleteProjectAction, saveProjectAction } from "@/server/actions/content";
import { services } from "@/content/services";
import { ActionForm, Checkbox, Field, Select, SubmitButton, TextArea } from "@/components/forms/action-form";
import { PendingButton } from "@/components/forms/pending-button";

export type ProjectFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  clientName?: string;
  industry?: string;
  serviceSlug?: string;
  summary?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  technologies?: string;
  images?: string;
  liveUrl?: string;
  isCaseStudy?: boolean;
  published?: boolean;
  sort?: string;
};

export function ProjectForm({ v = {} }: { v?: ProjectFormValues }) {
  return (
    <div className="max-w-4xl space-y-4">
      <ActionForm action={saveProjectAction} className="card p-7">
        <input type="hidden" name="id" value={v.id ?? ""} />
        <Field label="Project title" name="title" defaultValue={v.title} />
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="URL slug" name="slug" optional defaultValue={v.slug} />
          <Field label="Client name" name="clientName" optional defaultValue={v.clientName} hint="Only with the client's permission" />
          <Field label="Industry" name="industry" optional defaultValue={v.industry} />
        </div>
        <Select label="Service" name="serviceSlug" optional placeholder="—" defaultValue={v.serviceSlug ?? ""} options={services.map((s) => ({ value: s.slug, label: s.title }))} />
        <TextArea label="Short summary" name="summary" optional rows={2} defaultValue={v.summary} />
        <TextArea label="Challenge" name="challenge" optional rows={5} defaultValue={v.challenge} />
        <TextArea label="Approach & solution" name="solution" optional rows={6} defaultValue={v.solution} />
        <TextArea label="Results" name="results" optional rows={4} defaultValue={v.results} hint="Verified results only — leave empty if you can't confirm them." />
        <Field label="Technologies" name="technologies" optional defaultValue={v.technologies} hint="Comma separated" />
        <TextArea label="Image URLs" name="images" optional rows={3} defaultValue={v.images} hint="One full URL per line. The first is the cover." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Live URL" name="liveUrl" optional defaultValue={v.liveUrl} placeholder="https://…" />
          <Field label="Sort order" name="sort" type="number" optional defaultValue={v.sort ?? "0"} />
        </div>
        <Checkbox name="isCaseStudy" defaultChecked={v.isCaseStudy}>Show as a case study</Checkbox>
        <Checkbox name="published" defaultChecked={v.published}>Published</Checkbox>
        <SubmitButton>Save project</SubmitButton>
      </ActionForm>
      {v.id && (
        <form action={deleteProjectAction}>
          <input type="hidden" name="id" value={v.id} />
          <PendingButton tone="danger" confirm="Delete this project permanently?">Delete project</PendingButton>
        </form>
      )}
    </div>
  );
}
