import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Cookie Policy", alternates: { canonical: "/cookie-policy" } };

export default function CookiePage() {
  return (
    <LegalPage
      title="Cookie Policy"
      sections={[
        { h: "Essential cookies only", p: ["This website currently uses one essential cookie (nx_session) to keep you signed in to your account. It is removed when you sign out or after 7 days."] },
        { h: "No advertising or analytics cookies", p: ["We do not currently use advertising or third-party analytics cookies. If we add any, we will update this page and ask for your consent where required."] },
        { h: "Managing cookies", p: ["You can delete cookies in your browser settings. Blocking the session cookie will prevent you from signing in."] },
      ]}
    />
  );
}
