import { requireUser } from "@/server/auth/session";
import { getCurrentUser } from "@/server/queries/other";
import { changePasswordAction, updateProfileAction } from "@/server/actions/auth";
import { COUNTRIES } from "@/content/countries";
import { PageHeader } from "@/components/layout/app-shell";
import { ActionForm, Checkbox, Field, Select, SubmitButton } from "@/components/forms/action-form";
import { TimezoneSelect } from "@/components/forms/timezone-select";

export default async function Profile() {
  const s = await requireUser();
  const u = await getCurrentUser(s.sub);
  if (!u) return null;
  return (
    <>
      <PageHeader title="Profile & Security" />
      <div className="grid max-w-5xl gap-6 lg:grid-cols-2">
        <ActionForm action={updateProfileAction} className="card p-7">
          <h2 className="text-lg">Profile</h2>
          <Field label="Full name" name="name" defaultValue={u.name} autoComplete="name" />
          <Field label="Email" name="email_display" defaultValue={u.email} disabled hint="Contact support to change your email." />
          <Field label="Phone / WhatsApp" name="phone" optional defaultValue={u.phone ?? ""} placeholder="+1 555 123 4567" />
          <Field label="Company" name="company" optional defaultValue={u.company ?? ""} />
          <Select label="Country" name="country" defaultValue={u.country ?? ""} placeholder="Select your country" options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))} />
          <div>
            <label htmlFor="timezone" className="field-label">Timezone</label>
            <TimezoneSelect name="timezone" defaultValue={u.timezone ?? undefined} />
          </div>
          <Checkbox name="marketing" defaultChecked={Boolean(u.marketingConsent)}>Receive occasional news and insights</Checkbox>
          <SubmitButton>Save profile</SubmitButton>
        </ActionForm>

        <ActionForm action={changePasswordAction} resetOnSuccess className="card h-fit p-7">
          <h2 className="text-lg">Change password</h2>
          <Field label="Current password" name="current" type="password" autoComplete="current-password" />
          <Field label="New password" name="password" type="password" autoComplete="new-password" />
          <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" />
          <SubmitButton>Update password</SubmitButton>
        </ActionForm>
      </div>
    </>
  );
}
