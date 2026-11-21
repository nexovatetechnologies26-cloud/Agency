import type { Metadata } from "next";
import { getService } from "@/content/services";
import { SectionHeading } from "@/components/ui/section-heading";
import { LeadForm } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: "Tell us about your project and receive a custom proposal from Nexovate.",
  alternates: { canonical: "/get-a-quote" },
};

const steps = ["Share your project details", "We review and may ask a few questions", "You receive a clear proposal"];

export default async function QuotePage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  const preselected = service && getService(service) ? service : undefined;

  return (
    <section className="section hero-wash">
      <div className="container grid gap-14 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="Get a quote"
            title="Tell us about your project"
            description="Every project is different. Share what you need and we'll prepare a proposal with scope, timeline and pricing."
          />
          <ol className="mt-10 space-y-4">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-4 text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
        <LeadForm type="quote" defaultService={preselected} />
      </div>
    </section>
  );
}
