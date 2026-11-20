import type { Metadata } from "next";
import Link from "next/link";
import { forgotPasswordAction } from "@/server/actions/auth";
import { ActionForm, Field, SubmitButton } from "@/components/forms/action-form";
import { AuthCard } from "@/components/layout/auth-card";

export const metadata: Metadata = { title: "Forgot password", robots: { index: false } };

export default function ForgotPage() {
  return (
    <AuthCard title="Reset your password" subtitle="We'll email you a link to choose a new password." footer={<Link href="/login" className="text-brand">Back to sign in</Link>}>
      <ActionForm action={forgotPasswordAction}>
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <SubmitButton className="w-full">Send reset link</SubmitButton>
      </ActionForm>
    </AuthCard>
  );
}
