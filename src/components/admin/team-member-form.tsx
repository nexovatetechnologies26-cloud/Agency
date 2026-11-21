import { deleteTeamMemberAction, saveTeamMemberAction } from "@/server/actions/content";
import { SENIORITY_LABELS, SENIORITY_LEVELS } from "@/lib/constants";
import { ActionForm, Checkbox, Field, Select, SubmitButton, TextArea } from "@/components/forms/action-form";
import { PendingButton } from "@/components/forms/pending-button";

export type TeamMemberFormValues = {
  id?: string;
  name?: string;
  title?: string;
  seniority?: string;
  yearsExperience?: string;
  bio?: string;
  expertise?: string;
  photo?: string;
  linkedin?: string;
  location?: string;
  published?: boolean;
  sort?: string;
};

export function TeamMemberForm({ v = {} }: { v?: TeamMemberFormValues }) {
  return (
    <div className="max-w-3xl space-y-4">
      <ActionForm action={saveTeamMemberAction} className="card p-7">
        <input type="hidden" name="id" value={v.id ?? ""} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="name" defaultValue={v.name} />
          <Field label="Job title" name="title" defaultValue={v.title} placeholder="e.g. Lead Full-Stack Engineer" />
        </div>
        <div className="grid gap-5 sm:grid-cols-3">
          <Select
            label="Seniority"
            name="seniority"
            defaultValue={v.seniority ?? "senior"}
            options={SENIORITY_LEVELS.map((s) => ({ value: s, label: SENIORITY_LABELS[s] }))}
          />
          <Field label="Years of experience" name="yearsExperience" type="number" min={0} max={60} optional defaultValue={v.yearsExperience} />
          <Field label="Location" name="location" optional defaultValue={v.location} placeholder="e.g. Lahore, Pakistan" />
        </div>
        <TextArea label="Short bio" name="bio" optional rows={4} maxLength={600} defaultValue={v.bio} hint="Two or three sentences. Shown on the website." />
        <Field label="Expertise" name="expertise" optional defaultValue={v.expertise} hint="Comma separated, e.g. Next.js, AI automation, UX" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Photo URL" name="photo" optional defaultValue={v.photo} placeholder="https://…" hint="Portrait works best (4:5). Leave empty to show initials." />
          <Field label="LinkedIn URL" name="linkedin" optional defaultValue={v.linkedin} placeholder="https://www.linkedin.com/in/…" />
        </div>
        <Field label="Sort order" name="sort" type="number" optional defaultValue={v.sort ?? "0"} hint="Lower numbers appear first." />
        <Checkbox name="published" defaultChecked={v.published}>
          Published — show this profile on the website
        </Checkbox>
        <SubmitButton>Save profile</SubmitButton>
      </ActionForm>
      {v.id && (
        <form action={deleteTeamMemberAction}>
          <input type="hidden" name="id" value={v.id} />
          <PendingButton tone="danger" confirm="Delete this team profile permanently?">
            Delete profile
          </PendingButton>
        </form>
      )}
    </div>
  );
}
