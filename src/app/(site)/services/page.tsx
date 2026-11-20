import type { Metadata } from "next";
import { ServicesGrid } from "@/components/sections/services-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web and app development, e-commerce, custom software, AI automation, SEO, social media, branding and video — explore Nexovate's services.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="section pb-0">
        <div className="container">
          <SectionHeading
            as="h1"
            eyebrow="Services"
            title="Everything you need to build and grow online"
            description="Choose a service to see what's included, or request a custom quote for a project that combines several."
          />
          <div className="mt-14">
            <ServicesGrid />
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
