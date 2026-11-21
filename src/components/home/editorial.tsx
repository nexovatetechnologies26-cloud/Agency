import Link from "next/link";
import { publishedServices } from "@/content/services";
import { faqs } from "@/content/faqs";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";

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
              <p className="font-serif text-[2.75rem] leading-none tracking-[-0.02em] text-brand md:text-[3.5rem]">
                <CountUp value={st.value} />
              </p>
              <p className="mt-3 text-[15px] font-medium text-ink">{st.label}</p>
              {st.note && <p className="mt-1 text-xs text-muted">{st.note}</p>}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Capabilities — services grouped into four outcome pillars ---------------------- */

const PILLARS = [
  { n: "01", t: "Build", d: "Websites, stores and apps engineered to last.", slugs: ["web-development", "wordpress-development", "ecommerce-development", "mobile-app-development"] },
  { n: "02", t: "Automate", d: "Software and AI that remove busywork.", slugs: ["custom-software", "ai-automation"] },
  { n: "03", t: "Market", d: "Get found by the people who matter.", slugs: ["digital-marketing-seo", "social-media-management"] },
  { n: "04", t: "Grow", d: "A brand that earns trust on sight.", slugs: ["graphic-design-branding", "video-content-production"] },
];

export function HomeServices() {
  const groups = PILLARS.map((p) => ({ ...p, items: p.slugs.map((s) => publishedServices.find((x) => x.slug === s)).filter((x): x is NonNullable<typeof x> => Boolean(x)) })).filter(
    (g) => g.items.length,
  );
  return (
    <section className="border-t border-line py-16 lg:py-24" aria-label="Capabilities">
      <div className="container">
        <SectionTitle label="Capabilities" title={<>Everything you need, <em>under one roof</em></>} href="/services" linkText="Explore services" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g) => (
            <li key={g.t} className="card flex flex-col p-7">
              <span className="font-serif text-2xl italic text-brand">{g.n}</span>
              <h3 className="mt-4 font-serif text-[2rem] font-normal leading-none text-ink">{g.t}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{g.d}</p>
              <ul className="mt-6 space-y-0.5 border-t border-line pt-4">
                {g.items.map((it) => (
                  <li key={it.slug}>
                    <Link href={`/services/${it.slug}`} className="group flex items-center justify-between gap-3 py-1.5 text-[15px] text-ink/85 transition-colors hover:text-brand">
                      {it.title}
                      <span aria-hidden className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-brand">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Trusted by — client logos from Admin → Clients; hidden until published ------- */

export type ClientLogoItem = { _id: string; name: string; logo: string; url?: string | null };

export function HomeClients({ logos }: { logos: ClientLogoItem[] }) {
  if (!logos.length) return null;
  return (
    <section className="pb-14 lg:pb-20" aria-label="Clients">
      <div className="container">
        <p className="label text-center">Trusted by teams at</p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
          {logos.map((l) => {
            // eslint-disable-next-line @next/next/no-img-element -- admin-provided logo URL
            const img = <img src={l.logo} alt={l.name} loading="lazy" className="h-8 w-auto max-w-[140px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:h-9" />;
            return (
              <li key={l._id}>
                {l.url ? (
                  <a href={l.url} target="_blank" rel="noopener noreferrer" aria-label={l.name}>
                    {img}
                  </a>
                ) : (
                  img
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* Testimonials — verified quotes from Admin → Testimonials ---------------------- */

export type QuoteItem = { _id: string; name: string; role?: string | null; company?: string | null; quote: string };

export function HomeTestimonials({ items }: { items: QuoteItem[] }) {
  if (!items.length) return null;
  return (
    <section className="border-t border-line py-16 lg:py-24" aria-label="Testimonials">
      <div className="container">
        <SectionTitle label="Testimonials" title={<>What clients <em>say</em></>} />
        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((t) => (
            <li key={t._id} className="card flex flex-col p-7">
              <span aria-hidden className="font-serif text-5xl leading-none text-brand">&ldquo;</span>
              <blockquote className="mt-2 flex-1 text-[15px] leading-relaxed text-ink/85">{t.quote}</blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft font-serif text-lg text-brand">
                  {t.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  {(t.role || t.company) && <p className="text-xs text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</p>}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Insights — latest published articles --------------------------------------- */

export type PostItem = { slug: string; title: string; excerpt?: string | null; category?: string | null; coverImage?: string | null; publishedAt?: string | null };

export function HomeInsights({ posts }: { posts: PostItem[] }) {
  if (!posts.length) return null;
  return (
    <section className="border-t border-line py-16 lg:py-24" aria-label="Insights">
      <div className="container">
        <SectionTitle label="Insights" title={<>From the <em>journal</em></>} href="/blog" linkText="All articles" />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="card group flex h-full flex-col overflow-hidden">
                <div className="aspect-[16/9] overflow-hidden bg-paper">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-provided cover image
                    <img src={p.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-full items-end p-5 font-serif text-3xl text-ink/10">Nexovate</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {p.category && <p className="label">{p.category}</p>}
                  <h3 className="mt-2 font-serif text-2xl leading-tight text-ink transition-colors group-hover:text-brand">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 line-clamp-2 text-[15px] text-muted">{p.excerpt}</p>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* FAQ — compact accordion ---------------------------------------------------- */

export function HomeFaq() {
  return (
    <section className="border-t border-line py-16 lg:py-24" aria-label="Frequently asked questions">
      <div className="container grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionTitle label="FAQ" title={<>Good to <em>know</em></>} />
          <Link href="/faq" className="link-underline mt-6 !text-sm">
            All questions <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="border-t border-line lg:col-span-7 lg:col-start-6">
          {faqs.slice(0, 5).map((f) => (
            <details key={f.q} className="group border-b border-line [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[17px] font-medium text-ink transition-colors hover:text-brand">
                {f.q}
                <span aria-hidden className="mt-0.5 text-xl leading-none text-brand transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="-mt-1 max-w-measure pb-6 text-[15px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
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
