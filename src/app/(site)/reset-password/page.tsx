import type { Metadata } from "next";
import Link from "next/link";
import { resetPasswordAction } from "@/server/actions/auth";
import { ActionForm, Field, SubmitButton } from "@/components/forms/action-form";
import { AuthCard } from "@/components/layout/auth-card";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false } };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <AuthCard title="Choose a new password" footer={<Link href="/forgot-password" className="text-brand">Request a new link</Link>}>
      {!token ? (
        <p className="text-sm text-muted">This link is missing its token. Please use the link from your email.</p>
      ) : (
        <ActionForm action={resetPasswordAction}>
          <input type="hidden" name="token" value={token} />
          <Field label="New password" name="password" type="password" autoComplete="new-password" hint="At least 8 characters" />
          <Field label="Confirm password" name="confirm" type="password" autoComplete="new-password" />
          <SubmitButton className="w-full">Update password</SubmitButton>
        </ActionForm>
      )}
    </AuthCard>
  );
}
