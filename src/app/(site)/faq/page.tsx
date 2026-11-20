import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { Faq } from "@/components/sections/faq";
import { SectionHeading } from "@/components/ui/section-heading";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about working with Nexovate.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <>
      <section className="section pb-0">
        <div className="container">
          <SectionHeading as="h1" eyebrow="FAQ" title="Frequently asked questions" />
        </div>
      </section>
      <Faq heading={false} />
      <Cta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
