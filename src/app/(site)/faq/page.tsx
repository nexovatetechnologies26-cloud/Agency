import type { Metadata } from "next";
import { faqs } from "@/content/faqs";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/ui/page-hero";
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
      <PageHero eyebrow="FAQ" title={<>Frequently asked <em>questions.</em></>} description="How we work, pricing, timelines and support. Can't find your answer? Ask us directly." />
      <Faq heading={false} />
      <Cta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
