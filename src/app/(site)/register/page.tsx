import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { registerAction } from "@/server/actions/auth";
import { COUNTRIES } from "@/content/countries";
import { ActionForm, Checkbox, Field, Select, SubmitButton } from "@/components/forms/action-form";
import { TimezoneSelect } from "@/components/forms/timezone-select";
import { AuthCard } from "@/components/layout/auth-card";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  if (await getSession()) redirect("/dashboard");

  return (
    <AuthCard
      title="Create your account"
      subtitle="Track orders, proposals and projects in one place."
      footer={<>Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand">Sign in</Link></>}
    >
      <ActionForm action={registerAction}>
        <input type="hidden" name="next" value={next ?? ""} />
        <Field label="Full name" name="name" autoComplete="name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Password" name="password" type="password" autoComplete="new-password" hint="At least 8 characters" />
        <Select label="Country" name="country" placeholder="Select your country" defaultValue="" options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))} />
        <div>
          <label htmlFor="timezone" className="field-label">Timezone</label>
          <TimezoneSelect name="timezone" />
        </div>
        <Checkbox name="privacy">
          I agree to the <Link href="/terms" className="text-brand">terms</Link> and <Link href="/privacy-policy" className="text-brand">privacy policy</Link>.
        </Checkbox>
        <Checkbox name="marketing">Send me occasional news and insights (optional).</Checkbox>
        <SubmitButton className="w-full">Create account</SubmitButton>
      </ActionForm>
    </AuthCard>
  );
}
