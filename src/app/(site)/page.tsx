import { ArrowRight, CalendarClock, Clock, Globe2, Languages } from "lucide-react";
import { Hero } from "@/components/sections/hero";
import { ServicesGrid } from "@/components/sections/services-grid";
import { WhyUs } from "@/components/sections/why-us";
import { Process } from "@/components/sections/process";
import { Faq } from "@/components/sections/faq";
import { Cta } from "@/components/sections/cta";
import { ProjectCard } from "@/components/sections/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { listProjects, listTestimonials } from "@/server/queries/other";
import { listActivePackages } from "@/server/queries/commerce";
import { safe } from "@/server/lib/safe";
import { formatMoney } from "@/lib/money";
import { services } from "@/content/services";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

export default async function HomePage() {
  // Sections backed by data only appear when real content exists.
  const [projects, testimonials, packages] = await Promise.all([
    safe(() => listProjects(), [], "home-projects"),
    safe(listTestimonials, [], "home-testimonials"),
    safe(listActivePackages, [], "home-packages"),
  ]);
  const featuredPackages = packages.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <Hero />

      <section className="section">
        <div className="container">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="What we do"
              title="Digital services for every stage of your business"
              description="Build, automate, market and grow — everything you need, delivered by one team."
            />
            <ButtonLink href="/services" variant="secondary">
              All services <ArrowRight size={16} />
            </ButtonLink>
          </div>
          <div className="mt-12">
            <ServicesGrid limit={6} />
          </div>
        </div>
      </section>

      <WhyUs />
      <Process />

      {projects.length > 0 && (
        <section className="section bg-paper">
          <div className="container">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <SectionHeading eyebrow="Portfolio" title="Recent work" />
              <ButtonLink href="/portfolio" variant="secondary">View portfolio <ArrowRight size={16} /></ButtonLink>
            </div>
            <ul className="mt-12 grid gap-6 md:grid-cols-3">
              {projects.slice(0, 3).map((p) => <li key={p.slug}><ProjectCard p={p} /></li>)}
            </ul>
          </div>
        </section>
      )}

      {featuredPackages.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Pricing" title="Popular packages" align="center" />
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {featuredPackages.map((p) => (
                <li key={p._id} className="card flex flex-col p-7">
                  <p className="text-xs font-semibold text-brand">{services.find((s) => s.slug === p.serviceSlug)?.title}</p>
                  <h3 className="mt-2 text-lg">{p.name}</h3>
                  <p className="mt-4 text-3xl font-semibold">{formatMoney(p.price, p.currency)}{p.billing === "monthly" && <span className="text-sm text-muted"> / mo</span>}</p>
                  <ButtonLink href={`/checkout/${p._id}`} variant="secondary" className="mt-6">Select</ButtonLink>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center"><ButtonLink href="/pricing" variant="ghost">See all pricing <ArrowRight size={16} /></ButtonLink></div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Global collaboration"
            title="Working with businesses wherever they are"
            description="We work remotely with clients around the world, with clear processes that make distance a non-issue."
          />
          <ul className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Clock, t: "Your timezone", d: "Calls and updates scheduled around your working hours." },
              { icon: Languages, t: "Clear English communication", d: "Written updates and documentation you can share with your team." },
              { icon: Globe2, t: "Multi-currency quotes", d: "Proposals and invoices in the currency you work in." },
              { icon: CalendarClock, t: "Easy to start", d: "Book a consultation online in a few clicks." },
            ].map(({ icon: Icon, t, d }) => (
              <li key={t} className="card p-6">
                <Icon size={20} className="text-brand" aria-hidden />
                <p className="mt-4 font-semibold">{t}</p>
                <p className="mt-1 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="section bg-paper">
          <div className="container">
            <SectionHeading eyebrow="Clients" title="What our clients say" align="center" />
            <ul className="mt-12 grid gap-5 md:grid-cols-3">
              {testimonials.map((t) => (
                <li key={t._id} className="card p-7">
                  <blockquote className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</blockquote>
                  <p className="mt-5 text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <Faq limit={4} />
      <Cta />
    </>
  );
}
