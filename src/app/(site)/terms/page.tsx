import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Terms and Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      sections={[
        { h: "Using this website", p: ["By using this website and our client dashboard you agree to these terms. If you do not agree, please do not use the site."] },
        { h: "Services and scope", p: ["The scope, deliverables, timeline, price and payment schedule for each engagement are defined in the package description you purchase or in the written proposal you accept. Work outside that scope is quoted separately."] },
        { h: "Your responsibilities", p: ["You agree to provide accurate information, the content and access we need, and timely feedback. Delays in providing these may affect delivery dates."] },
        { h: "Payments", p: ["Payments are due according to the terms shown on your order, proposal or invoice. Work may be paused while payments are overdue."] },
        { h: "Revisions and approvals", p: ["The number of revisions included is stated in your package or proposal. Additional revisions may be charged."] },
        { h: "Intellectual property", p: ["Ownership of final deliverables transfers to you once full payment has been received, unless your proposal states otherwise. Third-party assets remain subject to their own licences."] },
        { h: "Liability", p: ["We take care to deliver high-quality work but cannot guarantee specific business results such as search rankings, sales or advertising performance."] },
        { h: "Contact", p: ["Questions about these terms can be sent through our contact page."] },
      ]}
    />
  );
}
