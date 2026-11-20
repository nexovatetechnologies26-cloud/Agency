import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { getService, publishedServices } from "@/content/services";
import { site } from "@/content/site";
import { ServiceIcon } from "@/components/ui/service-icon";
import { ButtonLink } from "@/components/ui/button";
import { Process } from "@/components/sections/process";
import { Cta } from "@/components/sections/cta";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedServices.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.summary,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const service = getService((await params).slug);
  if (!service) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: { "@type": "Organization", name: site.name, url: site.url },
        areaServed: "Worldwide",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/services` },
          { "@type": "ListItem", position: 3, name: service.title, item: `${site.url}/services/${service.slug}` },
        ],
      },
    ],
  };

  const others = publishedServices.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="section pb-12">
        <div className="container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-brand">Home</Link>
            <ChevronRight size={14} aria-hidden />
            <Link href="/services" className="hover:text-brand">Services</Link>
            <ChevronRight size={14} aria-hidden />
            <span className="text-ink">{service.title}</span>
          </nav>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <ServiceIcon name={service.icon} className="h-6 w-6" />
              </span>
              <h1 className="mt-6 text-4xl leading-tight md:text-5xl">{service.title}</h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{service.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={`/get-a-quote?service=${service.slug}`} size="lg">
                  Get a Custom Quote <ArrowRight size={18} />
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary" size="lg">
                  Ask a Question
                </ButtonLink>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-lg">What we offer</h2>
              <ul className="mt-5 space-y-3.5">
                {service.offerings.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Process />

      <section className="section bg-paper">
        <div className="container">
          <h2 className="text-2xl">Related services</h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="card block p-6 transition hover:border-brand/40">
                  <ServiceIcon name={s.icon} className="h-5 w-5 text-brand" />
                  <p className="mt-4 font-semibold">{s.title}</p>
                  <p className="mt-1.5 text-sm text-muted">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cta title={`Let's talk about your ${service.title.toLowerCase()} project`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
