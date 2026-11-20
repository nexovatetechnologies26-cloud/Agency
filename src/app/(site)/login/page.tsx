import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/server/auth/session";
import { loginAction } from "@/server/actions/auth";
import { isStaff } from "@/lib/permissions";
import { ActionForm, Field, SubmitButton } from "@/components/forms/action-form";
import { AuthCard } from "@/components/layout/auth-card";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; reset?: string }> }) {
  const { next, reset } = await searchParams;
  const session = await getSession();
  if (session) redirect(isStaff(session.role) ? "/admin" : "/dashboard");

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Nexovate account."
      footer={<>New to Nexovate? <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-brand">Create an account</Link></>}
    >
      {reset && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Password updated. Please sign in.</p>}
      <ActionForm action={loginAction}>
        <input type="hidden" name="next" value={next ?? ""} />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field label="Password" name="password" type="password" autoComplete="current-password" />
        <div className="flex items-center justify-between">
          <SubmitButton>Sign in</SubmitButton>
          <Link href="/forgot-password" className="text-sm text-muted hover:text-brand">Forgot password?</Link>
        </div>
      </ActionForm>
    </AuthCard>
  );
}
