import type { Metadata } from "next";
import { site } from "@/content/site";
import { LegalPage, LEGAL_UPDATED } from "@/components/layout/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects your personal information.`,
  alternates: { canonical: "/privacy-policy" },
};

// NOTE: plain-language starting point describing what this website actually does.
// Have it reviewed by a qualified professional before relying on it.
export default function PrivacyPage() {
  const contact = site.contact.email ? `through our contact page or by emailing ${site.contact.email}` : "through our contact page";

  return (
    <LegalPage
      title="Privacy Policy"
      updated={LEGAL_UPDATED}
      intro={`This policy explains what personal information ${site.name} collects when you use ${site.domain}, why we collect it and the choices you have.`}
      sections={[
        {
          h: "What we collect",
          p: [
            "Contact and quote forms: your name, email, country and message, and optionally your phone number, company, website, the service you are interested in, budget range, timeline and preferred contact method.",
            "Accounts: your name, email, a securely hashed password (we never store it in readable form), country, timezone and optionally your phone number and company.",
            "Consultation bookings: the time you choose, your timezone, name, email, country, topic and any notes you add.",
            "Orders, proposals, invoices and support: the project details, requirements and messages you share with us, and records of payments we have received.",
            "Attribution: the page you arrived on, the referring website and any campaign tags in the link you used (for example, utm_source).",
          ],
        },
        {
          h: "How we use it",
          p: [
            "To reply to your inquiry, prepare proposals, schedule consultations, deliver the services you order, issue invoices and provide support.",
            "To send transactional emails such as account confirmation, password resets, booking confirmations and project updates.",
            "If you opt in, to send occasional news and insights. You can unsubscribe at any time.",
          ],
        },
        {
          h: "Storage and sharing",
          p: [
            `Your information is stored in our secure database and is only accessible to authorised members of the ${site.name} team, each limited to the areas their role requires.`,
            "We use trusted service providers to run the website, such as database hosting and email delivery. They process data only on our behalf.",
            "We do not sell your personal information.",
          ],
        },
        {
          h: "Cookies",
          p: ["We use a single essential cookie to keep you signed in. See our Cookie Policy for details."],
        },
        {
          h: "How long we keep it",
          p: ["We keep inquiry, account and project records for as long as needed to provide our services and meet legal, tax and accounting obligations, then delete or anonymise them."],
        },
        {
          h: "Your choices and rights",
          p: [
            `You can ask us to access, correct, export or delete the information we hold about you ${contact}. You can update most account details yourself in your dashboard.`,
          ],
        },
      ]}
    />
  );
}
