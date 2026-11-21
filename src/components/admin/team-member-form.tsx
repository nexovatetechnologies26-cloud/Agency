import { deleteTeamMemberAction, saveTeamMemberAction } from "@/server/actions/content";
import { SENIORITY_SUGGESTIONS } from "@/lib/constants";
import { ActionForm, Checkbox, Field, SubmitButton, TextArea } from "@/components/forms/action-form";
import { PendingButton } from "@/components/forms/pending-button";

export type TeamMemberFormValues = {
  id?: string;
  name?: string;
  title?: string;
  seniority?: string;
  yearsExperience?: string;
  bio?: string;
  quote?: string;
  expertise?: string;
  responsibilities?: string;
  notableWork?: string;
  languages?: string;
  photo?: string;
  linkedin?: string;
  links?: string;
  email?: string;
  whatsapp?: string;
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
          <div>
            <Field label="Seniority / position" name="seniority" list="seniority-suggestions" defaultValue={v.seniority} placeholder="e.g. Founder, CEO, Lead" hint="Pick a suggestion or type your own." />
            <datalist id="seniority-suggestions">
              {SENIORITY_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
          <Field label="Years of experience" name="yearsExperience" type="number" min={0} max={60} optional defaultValue={v.yearsExperience} />
          <Field label="Location" name="location" optional defaultValue={v.location} placeholder="e.g. Lahore, Pakistan" />
        </div>
        <TextArea label="About / bio" name="bio" optional rows={6} maxLength={2000} defaultValue={v.bio} hint="A short paragraph or two about their background and how they work. Blank line = new paragraph." />
        <TextArea label="Personal quote" name="quote" optional rows={2} maxLength={300} defaultValue={v.quote} hint="One sentence in their own words — shown large on their profile." />
        <TextArea
          label="What they do"
          name="responsibilities"
          optional
          rows={4}
          defaultValue={v.responsibilities}
          hint='One per line: "Title | short description" — e.g. "Technical architecture | Plans how each project is built and scaled."'
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Expertise" name="expertise" optional defaultValue={v.expertise} hint="Comma separated, e.g. Next.js, AI automation, UX" />
          <Field label="Languages" name="languages" optional defaultValue={v.languages} hint="Comma separated, e.g. English, Urdu, Arabic" />
        </div>
        <TextArea label="Notable work" name="notableWork" optional rows={3} defaultValue={v.notableWork} hint="One per line — real projects or achievements only." />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Photo URL" name="photo" optional defaultValue={v.photo} placeholder="https://…" hint="Portrait works best (4:5). Leave empty to show initials." />
          <Field label="LinkedIn URL" name="linkedin" optional defaultValue={v.linkedin} placeholder="https://www.linkedin.com/in/…" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" name="email" type="email" optional defaultValue={v.email} placeholder="name@nexovate.solutions" hint="Shown as an Email button on their profile." />
          <Field label="WhatsApp number" name="whatsapp" type="tel" optional defaultValue={v.whatsapp} placeholder="+923001234567" hint="International format with country code. Opens a WhatsApp chat." />
        </div>
        <TextArea
          label="Profile links"
          name="links"
          optional
          rows={4}
          defaultValue={v.links}
          placeholder={"https://www.instagram.com/…\nhttps://github.com/…\nPortfolio | https://…"}
          hint='As many as you like, one per line. Facebook, Instagram, X, GitHub, YouTube, Behance… are recognised automatically. Optional custom name: "Portfolio | https://…"'
        />
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
