import type { Metadata } from "next";
import { ServicesGrid, type FromPrice } from "@/components/sections/services-grid";
import { listActivePackages } from "@/server/queries/commerce";
import { safe } from "@/server/lib/safe";

// "Starting from" prices come from Admin → Packages; refreshed every 5 minutes and on every edit.
export const revalidate = 300;
import { PageHero } from "@/components/ui/page-hero";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web and app development, e-commerce, custom software, AI automation, SEO, social media, branding and video — explore Nexovate's services.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const packages = await safe(listActivePackages, [], "services-from-prices");
  // lowest active package per service (compared within the same currency)
  const fromPrices: Record<string, FromPrice> = {};
  for (const p of packages) {
    const cur = fromPrices[p.serviceSlug];
    if (!cur || (cur.currency === p.currency && p.price < cur.price)) {
      fromPrices[p.serviceSlug] = { price: p.price, currency: p.currency, billing: p.billing };
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={<>Everything you need to build and <em>grow online.</em></>}
        description="Choose a service to see what's included, or request a custom quote for a project that combines several."
      />
      <section className="bg-paper py-16 lg:py-24">
        <div className="container">
          <ServicesGrid fromPrices={fromPrices} />
        </div>
      </section>
      <Cta />
    </>
  );
}
