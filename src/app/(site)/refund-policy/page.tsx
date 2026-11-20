import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";

export const metadata: Metadata = { title: "Refund and Cancellation Policy", alternates: { canonical: "/refund-policy" } };

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund and Cancellation Policy"
      sections={[
        { h: "Before work starts", p: ["If you cancel an order before work has started, contact us and we will review a full or partial refund of any amount paid."] },
        { h: "After work has started", p: ["Once work has begun, refunds are assessed based on the work completed and any costs already incurred. Specific terms stated in your proposal take priority over this general policy."] },
        { h: "Monthly services", p: ["Monthly services can be cancelled before the next billing period. Payments for a period that has already started are generally non-refundable."] },
        { h: "How to request", p: ["Open a support ticket from your dashboard or use our contact page, including your order number. Approved refunds are returned using the original payment method where possible."] },
      ]}
    />
  );
}
