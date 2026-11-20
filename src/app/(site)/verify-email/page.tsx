import type { Metadata } from "next";
import { verifyEmailToken } from "@/server/queries/other";
import { ButtonLink } from "@/components/ui/button";
import { AuthCard } from "@/components/layout/auth-card";

export const metadata: Metadata = { title: "Verify email", robots: { index: false } };

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const ok = await verifyEmailToken(token).catch(() => false);
  return (
    <AuthCard title={ok ? "Email confirmed" : "Link not valid"}>
      <p className="text-sm text-muted">
        {ok ? "Thanks — your email address is confirmed." : "This verification link is invalid or was already used. You can request a new one from your dashboard."}
      </p>
      <ButtonLink href="/dashboard" className="mt-6">Go to dashboard</ButtonLink>
    </AuthCard>
  );
}
