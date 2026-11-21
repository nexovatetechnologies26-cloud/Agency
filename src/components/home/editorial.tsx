import Link from "next/link";
import { publishedServices } from "@/content/services";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

// Homepage sections — compact and calm: short copy, consistent headings,
// and no invented data.

/** One heading style for every homepage section: small label, serif title, optional link. */
function SectionTitle({ label, title, href, linkText }: { label: string; title: React.ReactNode; href?: string; linkText?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="label">{label}</p>
        <h2 className="serif-heading mt-3 text-[2rem] leading-tight md:text-[2.5rem]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="link-underline !text-sm">
          {linkText} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}

/* Hero — text only ------------------------------------------------------- */

export function HomeHero() {
  return (
    <section className="pb-20 pt-16 lg:pb-28 lg:pt-24">
      <div className="container">
        <Reveal className="max-w-4xl">
          <p className="label">Digital &amp; technology agency</p>
          <h1 className="serif-heading mt-6 text-[2.75rem] leading-[1.05] tracking-[-0.02em] md:text-[4rem] lg:text-[4.75rem]">
            We build digital things that <em>work</em> as well as they look.
          </h1>
        </Reveal>
        <Reveal index={1} className="mt-8 max-w-2xl">
          <p className="text-body-lg text-muted">Websites, software, AI automation and marketing — one team and one clear process, for businesses worldwide.</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <ButtonLink href="/get-a-quote" size="lg">
              Start a project
            </ButtonLink>
            <Link href="/book-consultation" className="link-underline">
              Book a free consultation <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Numbers — admin-managed figures (Admin → Numbers); hidden until published ---- */

export type HomeStat = { _id: string; value: string; label: string; note?: string | null };

export function HomeNumbers({ stats }: { stats: HomeStat[] }) {
  if (!stats.length) return null;
  const cols = stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <section className="pb-16 lg:pb-24" aria-label="Nexovate in numbers">
      <div className="container">
        <ul className={`grid grid-cols-2 gap-4 ${cols}`}>
          {stats.map((st, i) => (
            <Reveal as="li" key={st._id} index={i} className="card px-6 py-7">
              <p className="font-serif text-[2.75rem] leading-none tracking-[-0.02em] text-brand md:text-[3.5rem]">{st.value}</p>
              <p className="mt-3 text-[15px] font-medium text-ink">{st.label}</p>
              {st.note && <p className="mt-1 text-xs text-muted">{st.note}</p>}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Services — a simple index of names; full cards live on /services ---------- */

export function HomeServices() {
  return (
    <section className="border-t border-line py-16 lg:py-24" aria-label="Services">
      <div className="container">
        <SectionTitle label="Services" title={<>What we <em>do</em></>} href="/services" linkText="Explore services" />
        <ul className="mt-10 grid border-t border-line sm:grid-cols-2 sm:gap-x-12">
          {publishedServices.map((s) => (
            <li key={s.slug} className="border-b border-line">
              <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-4 py-5">
                <span className="text-lg font-medium text-ink transition-colors group-hover:text-brand">{s.title}</span>
                <span aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Selected work — only real projects, hidden when there are none ---------- */

export type WorkItem = { slug: string; title: string; images: string[]; industry?: string | null; serviceSlug?: string | null };

export function HomeWork({ projects }: { projects: WorkItem[] }) {
  const items = projects.filter((p) => p.images[0]).slice(0, 2);
  if (!items.length) return null;
  const category = (p: WorkItem) => p.industry || publishedServices.find((s) => s.slug === p.serviceSlug)?.title || "Project";

  return (
    <section className="border-t border-line py-16 lg:py-24" aria-label="Selected work">
      <div className="container">
        <SectionTitle label="Selected work" title={<>Recent <em>projects</em></>} href="/portfolio" linkText="All work" />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {items.map((p) => (
            <Link key={p.slug} href={`/portfolio/${p.slug}`} className="card group block overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden bg-line">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided project image */}
                <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-[1.03]" />
              </div>
              <div className="flex items-baseline justify-between gap-4 p-6">
                <span className="font-serif text-2xl text-ink transition-colors group-hover:text-brand">{p.title}</span>
                <span className="label shrink-0">{category(p)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Process — four short steps --------------------------------------------- */

const steps = [
  { t: "Discover", d: "We learn your goals and requirements." },
  { t: "Propose", d: "Scope, timeline and a fixed price in writing." },
  { t: "Build", d: "Milestones you review in your dashboard." },
  { t: "Launch", d: "We ship, hand over and keep supporting." },
];

export function HomeProcess() {
  return (
    <section className="border-t border-line py-16 lg:py-24" aria-label="Process">
      <div className="container">
        <SectionTitle label="Process" title={<>How we <em>work</em></>} />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.t} index={i} className="card p-6">
              <span className="font-serif text-2xl italic text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight text-ink">{s.t}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{s.d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Dark statement — the page's single dark section ------------------------ */

export function HomeStatement() {
  return (
    <section className="bg-ink py-16 text-bone lg:py-24" aria-label="Our promise">
      <div className="container">
        <Reveal as="p" className="max-w-4xl font-serif text-[1.75rem] leading-snug text-bone md:text-[2.4rem]">
          Every project starts with a written scope and a fixed price — and ends with something your team can run and{" "}
          <em className="italic text-bone/60">grow.</em>
        </Reveal>
      </div>
    </section>
  );
}

/* Final call to action ------------------------------------------------------ */

export function HomeCta() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="cta-title">
      <div className="container flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div>
          <h2 id="cta-title" className="serif-heading text-[2rem] leading-tight md:text-[2.75rem]">
            Have a project in <em>mind</em>?
          </h2>
          <p className="mt-3 text-body text-muted">Tell us what you&apos;re building — we&apos;ll reply with a clear plan and price.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <ButtonLink href="/get-a-quote" size="lg">
            Start a project
          </ButtonLink>
          <Link href="/book-consultation" className="link-underline">
            Book a call <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
