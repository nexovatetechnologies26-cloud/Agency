import type { Metadata } from "next";
import { listActivePackages } from "@/server/queries/commerce";
import { safe } from "@/server/lib/safe";
import { PageHero } from "@/components/ui/page-hero";
import { PackagesList } from "@/components/sections/packages-list";
import { EmptyState } from "@/components/ui/empty-state";
import { Cta } from "@/components/sections/cta";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Pricing",
  description: "Fixed-price packages and custom quotes from Nexovate.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const packages = await safe(listActivePackages, [], "packages");
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title={<>Clear packages. Custom quotes <em>when you need them.</em></>}
        description="Choose a fixed-price package to get started quickly, or request a custom quote for anything bigger or more specific."
      />
      <section className="bg-paper py-16 lg:py-24">
        <div className="container">
          <div>
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
        </div>
      </section>
      <Cta title="Need something" accent="tailored?" />
    </>
  );
}
