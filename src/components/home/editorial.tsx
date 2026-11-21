import Link from "next/link";
import { publishedServices } from "@/content/services";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

// Homepage sections. Typography and whitespace only — no icons, cards or invented data.

/* 2 · Hero ----------------------------------------------------------------- */

export function HomeHero() {
  return (
    <section className="pb-24 pt-16 lg:pb-45 lg:pt-35">
      <div className="container">
        <Reveal>
          <h1 className="serif-heading max-w-[18ch] text-display">
            We build digital things that <em>work</em> as well as they look.
          </h1>
        </Reveal>
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12">
          <Reveal index={1} as="p" className="max-w-measure text-body-lg text-muted lg:col-span-5">
            Nexovate designs, builds and markets websites, software and automation for businesses around the world.
          </Reveal>
          <Reveal index={2} className="flex flex-wrap items-center gap-x-8 gap-y-5 lg:col-span-6 lg:col-start-7">
            <ButtonLink href="/get-a-quote" size="lg">
              Start a project
            </ButtonLink>
            <Link href="/services" className="link-underline">
              See our services <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* 3 · Services — numbered editorial list -------------------------------- */

export function HomeServices() {
  return (
    <section className="border-t border-line py-20 lg:py-35" aria-labelledby="services-title">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="label">Services</p>
            <h2 id="services-title" className="serif-heading mt-6 text-section">
              What we <em>do</em>
            </h2>
          </Reveal>
          <Reveal index={1} as="p" className="max-w-measure self-end text-body text-muted lg:col-span-5 lg:col-start-8">
            Every discipline sits under one roof, so strategy, design, engineering and marketing are planned together. Most projects draw on two or three of them.
          </Reveal>
        </div>

        <ol className="mt-16 border-t border-line lg:mt-24">
          {publishedServices.map((s, i) => (
            <li key={s.slug} className="border-b border-line">
              <Link
                href={`/services/${s.slug}`}
                className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-x-4 gap-y-2 py-8 lg:grid-cols-12 lg:gap-x-8 lg:py-10"
              >
                <span className="label lg:col-span-1">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-serif text-row text-ink transition-transform duration-300 ease-out-cubic group-hover:translate-x-2 lg:col-span-5">
                  {s.title}
                </span>
                <span aria-hidden className="text-2xl text-muted transition-colors duration-300 group-hover:text-brand lg:order-last lg:col-span-1 lg:justify-self-end">
                  →
                </span>
                <span className="col-start-2 max-w-measure text-body text-muted transition-transform duration-300 ease-out-cubic group-hover:translate-x-2 lg:col-span-5 lg:col-start-auto">
                  {s.summary}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 4 · Selected work — only real projects, hidden when there are none ---- */

export type WorkItem = { slug: string; title: string; images: string[]; industry?: string | null; serviceSlug?: string | null; createdAt?: string | null };

export function HomeWork({ projects }: { projects: WorkItem[] }) {
  const items = projects.filter((p) => p.images[0]).slice(0, 2);
  if (!items.length) return null;

  const category = (p: WorkItem) => p.industry || publishedServices.find((s) => s.slug === p.serviceSlug)?.title || "Project";
  const year = (p: WorkItem) => (p.createdAt ? new Date(p.createdAt).getFullYear() : null);

  return (
    <section className="border-t border-line py-20 lg:py-35" aria-labelledby="work-title">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <p className="label">Selected work</p>
            <h2 id="work-title" className="serif-heading mt-6 text-section">
              Recent <em>projects</em>
            </h2>
          </Reveal>
          <Link href="/portfolio" className="link-underline">
            All work <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="mt-16 grid gap-16 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {items.map((p, i) => (
            <Reveal key={p.slug} as="figure" index={i} className={i === 0 ? "lg:col-span-7" : "lg:col-span-5 lg:mt-45"}>
              <Link href={`/portfolio/${p.slug}`} className="group block">
                <div className={`overflow-hidden rounded-tile bg-line ${i === 0 ? "aspect-[4/3]" : "aspect-[4/5]"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided project image */}
                  <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-[1.02]" />
                </div>
                <figcaption className="mt-6 flex items-baseline justify-between gap-6">
                  <span className="font-serif text-3xl text-ink transition-colors group-hover:text-brand">{p.title}</span>
                  <span className="label shrink-0">
                    {category(p)}
                    {year(p) ? ` · ${year(p)}` : ""}
                  </span>
                </figcaption>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 5 · Process — four steps on one line ---------------------------------- */

const steps = [
  { t: "Discover", d: "We learn how your business works and what the project has to achieve." },
  { t: "Propose", d: "You get scope, milestones and a fixed price in writing before anything starts." },
  { t: "Build", d: "We design and develop in milestones you can review in your own dashboard." },
  { t: "Launch", d: "We ship, hand over the keys and stay on for support and growth." },
];

export function HomeProcess() {
  return (
    <section className="border-t border-line py-20 lg:py-35" aria-labelledby="process-title">
      <div className="container">
        <Reveal className="max-w-2xl">
          <p className="label">Process</p>
          <h2 id="process-title" className="serif-heading mt-6 text-section">
            How a project <em>runs</em>
          </h2>
        </Reveal>

        <ol className="relative mt-16 grid gap-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-8">
          {/* the thin connecting rule */}
          <span aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px bg-ink/20 lg:block" />
          {steps.map((s, i) => (
            <Reveal as="li" key={s.t} index={i} className="relative lg:pr-6">
              <span aria-hidden className="relative hidden h-[11px] w-[11px] rounded-full border border-ink/40 bg-paper lg:block" />
              <p className="label lg:mt-8">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-4 font-serif text-[2rem] font-normal leading-tight tracking-[-0.01em]">{s.t}</h3>
              <p className="mt-3 max-w-[30ch] text-body text-muted">{s.d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* 6 · Dark statement — the page's single dark section -------------------- */

export function HomeStatement() {
  return (
    <section className="bg-ink py-24 text-bone lg:py-45" aria-label="How we work">
      <div className="container grid gap-10 lg:grid-cols-12">
        <p className="label !text-bone/50 lg:col-span-3">How we work</p>
        <Reveal as="p" className="font-serif text-statement text-bone lg:col-span-9">
          Every project starts with a written scope and a fixed price, and ends with something your team can run, change and
          grow <em className="italic text-bone/60">long after we hand it over.</em>
        </Reveal>
      </div>
    </section>
  );
}

/* 7 · Final call to action (footer follows) ----------------------------- */

export function HomeCta() {
  return (
    <section className="py-24 lg:py-45" aria-labelledby="cta-title">
      <div className="container grid gap-12 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <h2 id="cta-title" className="serif-heading text-section lg:text-[4rem]">
            Have a project in <em>mind</em>?
          </h2>
        </Reveal>
        <Reveal index={1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="max-w-measure text-body text-muted">
            Tell us what you&apos;re building. We&apos;ll reply with a few questions, then a written proposal with scope, timeline and price.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink href="/get-a-quote" size="lg">
              Start a project
            </ButtonLink>
            <Link href="/book-consultation" className="link-underline">
              Book a call <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
