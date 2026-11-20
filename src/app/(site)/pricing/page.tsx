import type { Metadata } from "next";
import { listActivePackages } from "@/server/queries/commerce";
import { safe } from "@/server/lib/safe";
import { SectionHeading } from "@/components/ui/section-heading";
import { PackagesList } from "@/components/sections/packages-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Fixed-price packages and custom quotes from Nexovate.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const packages = await safe(listActivePackages, [], "packages");
  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHeading
            as="h1"
            eyebrow="Pricing"
            title="Clear packages. Custom quotes when you need them."
            description="Choose a fixed-price package to get started quickly, or request a custom quote for anything bigger or more specific."
          />
          <div className="mt-14">
            {packages.length ? (
              <PackagesList packages={packages} />
            ) : (
              <EmptyState
                title="Every project is quoted individually"
                text="We haven't published fixed packages yet. Tell us about your project and we'll send a proposal with clear pricing."
                action={{ label: "Get a Custom Quote", href: "/get-a-quote" }}
              />
            )}
          </div>
          <p className="mt-10 text-sm text-muted">
            All prices are shown in the package currency. Taxes, if applicable, are shown at checkout. Custom work is always confirmed in a written proposal.
          </p>
        </div>
      </section>
      <Cta title="Need something tailored?" />
    </>
  );
}
