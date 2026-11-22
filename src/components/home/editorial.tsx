import Link from "next/link";
import clsx from "clsx";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Compass,
  Gauge,
  LifeBuoy,
  MousePointerClick,
  Globe2,
  Layers,
  Plus,
  Quote,
} from "lucide-react";
import { publishedServices, type ServiceCategory } from "@/content/services";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { ServiceIcon } from "@/components/ui/service-icon";
import { PricingCard, type PackageCard } from "@/components/sections/packages-list";

// Homepage sections. Every data-backed section (logos, numbers, work, testimonials,
// insights) is managed in the admin panel and stays hidden until it has real content —
// nothing on this page is invented.

/** One heading style for every homepage section: eyebrow, display title, optional intro and link. */
export function SectionTitle({
  label,
  title,
  intro,
  href,
  linkText,
  dark = false,
  center = false,
}: {
  label: string;
  title: React.ReactNode;
  intro?: string;
  href?: string;
  linkText?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={clsx("flex flex-wrap items-end justify-between gap-6", center && "flex-col items-center text-center")}>
      <div className={clsx("max-w-2xl", center && "mx-auto")}>
        <p className={clsx("label", dark && "!text-[#B79BFF] before:!bg-[#B79BFF]")}>{label}</p>
        <h2 className={clsx("serif-heading mt-4 text-section", dark && "!text-white [&_em]:!text-[#B79BFF]")}>{title}</h2>
        {intro && <p className={clsx("mt-5 max-w-xl text-body-lg", dark ? "text-white/60" : "text-muted", center && "mx-auto")}>{intro}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className={clsx(
            "group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
            dark ? "border-white/20 text-white hover:border-white" : "border-ink/15 bg-surface text-ink hover:border-ink",
          )}
        >
          {linkText}
          <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/* Hero — centred, type-led: one message, two actions, three proof points ------- */

const heroPoints = ["Written scope & fixed price", "Live client dashboard", "Clients worldwide, any time zone"];

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-line" aria-labelledby="hero-title">
      <div aria-hidden className="grid-lines absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container flex flex-col items-center py-20 text-center lg:py-28 xl:py-32">
        <p className="hero-rise inline-flex items-center gap-2.5 rounded-full bg-brand-tint px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-deep">
          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-brand" />
          {site.tagline}
        </p>
        <h1 id="hero-title" className="serif-heading hero-rise mx-auto mt-8 max-w-5xl text-[2.7rem] leading-[1.02] tracking-[-0.045em] [animation-delay:80ms] sm:text-[3.6rem] lg:text-[4.6rem] xl:text-[5.2rem]">
          We build digital experiences that <em>move</em> businesses forward.
        </h1>
        <p className="hero-rise mx-auto mt-7 max-w-2xl text-body-lg text-muted [animation-delay:180ms]">
          From ambitious ideas to powerful digital products, we help businesses innovate, scale and stand out.
        </p>
        <div className="hero-rise mt-10 flex flex-wrap items-center justify-center gap-3 [animation-delay:260ms]">
          <ButtonLink href="/portfolio" size="lg">
            Explore our work <ArrowRight size={17} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
          </ButtonLink>
          <ButtonLink href="/get-a-quote" size="lg" variant="secondary">
            Start a project
          </ButtonLink>
        </div>
        <ul className="hero-rise mt-12 flex flex-wrap justify-center gap-x-7 gap-y-3 [animation-delay:340ms]">
          {heroPoints.map((p) => (
            <li key={p} className="inline-flex items-center gap-2 text-sm text-ink/75">
              <CheckCircle2 size={15} className="text-brand" aria-hidden /> {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Marquee — what we do, on a loop ---------------------------------------------- */

export function HomeMarquee() {
  const words = publishedServices.map((s) => s.title);
  const row = [...words, ...words];
  return (
    <section aria-label="Services overview" className="relative overflow-hidden border-y border-brand/25 bg-surface py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row.map((w, i) => (
          <span key={i} aria-hidden={i >= words.length} className="flex items-center gap-10 whitespace-nowrap font-display text-xl font-semibold tracking-tight text-ink/80 transition-colors hover:text-brand md:text-2xl">
            {w}
            <span aria-hidden className="h-2 w-2 rotate-45 bg-brand" />
          </span>
        ))}
      </div>
    </section>
  );
}

/* Trusted by — client logos from Admin → Clients; hidden until published ------- */

export type ClientLogoItem = { _id: string; name: string; logo: string; url?: string | null };

export function HomeClients({ logos }: { logos: ClientLogoItem[] }) {
  if (!logos.length) return null;
  return (
    <section className="py-14 lg:py-20" aria-label="Clients">
      <div className="container">
        <p className="text-center text-sm font-medium text-muted">Trusted by ambitious teams</p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
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

/* Numbers — admin-managed figures (Admin → Numbers); hidden until published ---- */

export type HomeStat = { _id: string; value: string; label: string; note?: string | null };

export function HomeNumbers({ stats }: { stats: HomeStat[] }) {
  if (!stats.length) return null;
  const cols = stats.length >= 4 ? "lg:grid-cols-4" : stats.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <section className="py-14 lg:py-20" aria-label="Nexovate in numbers">
      <div className="container">
        <ul className={`grid grid-cols-2 overflow-hidden rounded-3xl border border-brand/30 bg-surface ${cols}`}>
          {stats.map((st, i) => (
            <li key={st._id} className={clsx("px-6 py-8 md:px-8 md:py-10", i > 0 && "border-l border-line", i >= 2 && "max-lg:border-t")}>
              <p className="font-display text-[2.75rem] font-semibold leading-none tracking-[-0.04em] text-ink md:text-[3.5rem]">
                <CountUp value={st.value} />
              </p>
              <p className="mt-3 text-[15px] font-semibold text-ink">{st.label}</p>
              {st.note && <p className="mt-1 text-sm text-muted">{st.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Capabilities — services grouped into four outcome pillars (bento) ------------ */

const PILLARS = [
  { n: "01", t: "Build", d: "Websites, stores and apps engineered to load fast, rank well and last.", slugs: ["web-development", "wordpress-development", "ecommerce-development", "mobile-app-development"], span: "lg:col-span-2", dark: false },
  { n: "02", t: "Automate", d: "Software and AI that remove busywork from your day.", slugs: ["custom-software", "ai-automation"], span: "", dark: false },
  { n: "03", t: "Market", d: "Get found — and chosen — by the people who matter.", slugs: ["digital-marketing-seo", "social-media-management"], span: "", dark: false },
  { n: "04", t: "Grow", d: "A brand and content that earn trust on sight.", slugs: ["graphic-design-branding", "video-content-production"], span: "lg:col-span-2", dark: false },
];

export function HomeServices() {
  const groups = PILLARS.map((p) => ({
    ...p,
    items: p.slugs.map((s) => publishedServices.find((x) => x.slug === s)).filter((x): x is ServiceCategory => Boolean(x)),
  })).filter((g) => g.items.length);

  return (
    <section className="py-20 lg:py-28" aria-labelledby="services-title">
      <div className="container">
        <SectionTitle
          label="What we do"
          title={
            <span id="services-title">
              Everything you need, <em>under one roof.</em>
            </span>
          }
          intro="Four disciplines, one team. Pick a single service or combine them — we plan it all as one project."
          href="/services"
          linkText="Explore services"
        />
        <ul className="mt-14 grid gap-5 lg:grid-cols-3">
          {groups.map((g) => (
            <li
              key={g.t}
              data-card
              className={clsx(
                "group relative flex flex-col overflow-hidden rounded-3xl border p-7 md:p-9",
                g.span,
                g.dark ? "border-ink bg-charcoal text-white" : "border-brand/30 bg-surface",
              )}
            >
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className={clsx("font-accent text-2xl italic", g.dark ? "text-[#B79BFF]" : "text-brand")}>{g.n}</span>
                  <h3 className={clsx("mt-2 font-display text-[2.25rem] font-semibold leading-none tracking-[-0.04em] md:text-[2.75rem]", g.dark ? "text-white" : "text-ink")}>
                    {g.t}
                  </h3>
                  <p className={clsx("mt-4 max-w-sm text-[15px] leading-relaxed", g.dark ? "text-white/65" : "text-muted")}>{g.d}</p>
                </div>
              </div>
              <ul className={clsx("relative mt-8 grid gap-2.5", g.span && "sm:grid-cols-2")}>
                {g.items.map((it) => (
                  <li key={it.slug}>
                    <Link
                      href={`/services/${it.slug}`}
                      className={clsx(
                        "group/item flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-[15px] font-medium transition-colors",
                        g.dark ? "border-white/10 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/[0.08]" : "border-line bg-paper/60 text-ink hover:border-brand/40 hover:bg-brand-soft/60",
                      )}
                    >
                      <span className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", g.dark ? "bg-brand text-white" : "bg-surface text-brand shadow-sm")}>
                        <ServiceIcon name={it.icon} className="h-[18px] w-[18px]" />
                      </span>
                      <span className="flex-1">{it.title}</span>
                      <ArrowUpRight size={16} aria-hidden className="opacity-40 transition-all group-hover/item:-translate-y-0.5 group-hover/item:translate-x-0.5 group-hover/item:opacity-100" />
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

/* Why Nexovate — six real strengths ------------------------------------------- */

const reasons = [
  { icon: Compass, t: "Strategic thinking", d: "We start from your business goals, not a template — then choose the right technology." },
  { icon: Layers, t: "Custom-built solutions", d: "Software, websites and automations designed around how your team actually works." },
  { icon: Code2, t: "Modern engineering", d: "Clean, secure, maintainable code your team can run and grow with confidence." },
  { icon: Gauge, t: "Performance-focused", d: "Fast pages, efficient systems and measurable results — speed is a feature." },
  { icon: MousePointerClick, t: "User-centred design", d: "Interfaces your customers understand instantly, on every screen size." },
  { icon: LifeBuoy, t: "Long-term support", d: "We stay after launch — maintenance, improvements and a team you can reach." },
];

export function HomeWhy() {
  return (
    <section className="border-t border-line py-20 lg:py-28" aria-labelledby="why-title">
      <div className="container">
        <SectionTitle
          label="Why Nexovate"
          title={
            <span id="why-title">
              Agency craft. <em>Product-grade</em> engineering.
            </span>
          }
          intro="What you can expect from day one — and long after launch."
        />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map(({ icon: Icon, t, d }, i) => (
            <li key={t} data-card className="card group p-8 transition duration-300 ease-out-cubic hover:-translate-y-1 hover:border-brand/40 hover:shadow-lift lg:p-10">
              <div className="flex items-center justify-between">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line text-brand transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="font-display text-sm font-semibold text-muted/60">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-8 font-display text-xl font-semibold tracking-tight">{t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
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
  const items = projects.filter((p) => p.images[0]).slice(0, 4);
  if (!items.length) return null;
  const category = (p: WorkItem) => p.industry || publishedServices.find((s) => s.slug === p.serviceSlug)?.title || "Project";

  return (
    <section className="border-t border-line py-20 lg:py-28" aria-label="Selected work">
      <div className="container">
        <SectionTitle label="Selected work" title={<>Recent <em>projects</em></>} href="/portfolio" linkText="View all work" />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {items.map((p, i) => (
            <Link key={p.slug} href={`/portfolio/${p.slug}`} className={clsx("group block", i % 2 === 1 && "md:mt-16")}>
              <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-line">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin-provided project image */}
                <img src={p.images[0]} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-[1.04]" />
              </div>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="label-plain">{category(p)}</p>
                  <p className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-brand">{p.title}</p>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line transition-colors group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                  <ArrowUpRight size={18} aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Process — six steps on a timeline (dark band) ------------------------------ */

const steps = [
  { t: "Discovery", d: "A free call to understand your goals, users and constraints." },
  { t: "Strategy", d: "Scope, milestones, timeline and a fixed price — in a written proposal." },
  { t: "Design", d: "Flows and interfaces you review and approve before we build." },
  { t: "Development", d: "Engineering in milestones you can follow in your dashboard." },
  { t: "Testing", d: "Quality, performance and device checks before anything goes live." },
  { t: "Launch & support", d: "We ship, hand over and keep improving after go-live." },
];

export function HomeProcess() {
  return (
    <section className="border-t border-line py-20 lg:py-28" aria-labelledby="process-title">
      <div className="container">
        <SectionTitle
          label="How we work"
          title={
            <span id="process-title">
              From first call to launch — <em>no surprises.</em>
            </span>
          }
          intro="Six clear stages. You approve every one, and always know what happens next."
          href="/book-consultation"
          linkText="Book the first call"
        />
        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.t} data-card className="card group relative overflow-hidden p-8 transition duration-300 ease-out-cubic hover:-translate-y-1 hover:shadow-lift lg:p-9">
              <span aria-hidden className="absolute left-0 top-0 h-[3px] w-16 bg-brand transition-all duration-500 group-hover:w-full" />
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-semibold text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted/70">Step {i + 1} of {steps.length}</span>
              </div>
              <h3 className="mt-7 font-display text-xl font-semibold tracking-tight">{s.t}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* Ways to work together --------------------------------------------------------- */

const models = [
  { t: "Fixed-price project", d: "A defined build — website, app, store or system — quoted in a written proposal.", cta: "Get a quote", href: "/get-a-quote", featured: true },
  { t: "Ready-made packages", d: "Clear, fixed packages you can buy and start today, shown in your currency.", cta: "See pricing", href: "/pricing", featured: false },
  { t: "Ongoing partnership", d: "Monthly support for marketing, maintenance and continuous improvement.", cta: "Talk to us", href: "/contact", featured: false },
];

export function HomeModels() {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="models-title">
      <div className="container">
        <SectionTitle
          center
          label="Engagement"
          title={
            <span id="models-title">
              Ways to <em>work together</em>
            </span>
          }
          intro="Start small or go big. Every option comes with the same team, process and dashboard."
        />
        <ul className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
          {models.map((m) => (
            <li key={m.t}>
              <Link
                href={m.href}
                className={clsx(
                  "card card-float group flex h-full flex-col p-8",
                  m.featured && "!border-brand ring-1 ring-brand/30",
                )}
              >
                {m.featured && <span className="mb-5 self-start rounded-full bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">Best for new builds</span>}
                <h3 className="font-display text-2xl font-semibold tracking-tight">{m.t}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{m.d}</p>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  {m.cta} <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Testimonials — verified quotes from Admin → Testimonials ---------------------- */

export type QuoteItem = { _id: string; name: string; role?: string | null; company?: string | null; quote: string };

export function HomeTestimonials({ items }: { items: QuoteItem[] }) {
  if (!items.length) return null;
  const [first, ...rest] = items;
  return (
    <section className="border-t border-line py-20 lg:py-28" aria-label="Testimonials">
      <div className="container">
        <SectionTitle label="Client stories" title={<>What clients <em>say</em></>} />
        <div className="mt-14 grid gap-5 lg:grid-cols-5">
          <figure data-card className="card relative overflow-hidden !rounded-3xl p-8 md:p-12 lg:col-span-3">
            <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
            <Quote size={36} className="relative text-brand" aria-hidden />
            <blockquote className="relative mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-[1.9rem]">{first.quote}</blockquote>
            <figcaption className="relative mt-8 flex items-center gap-3">
              <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-brand font-semibold text-white">{first.name.charAt(0)}</span>
              <span>
                <span className="block font-semibold text-ink">{first.name}</span>
                {(first.role || first.company) && <span className="block text-sm text-muted">{[first.role, first.company].filter(Boolean).join(", ")}</span>}
              </span>
            </figcaption>
          </figure>
          {rest.length > 0 && (
            <ul className="grid gap-5 lg:col-span-2">
              {rest.slice(0, 2).map((t) => (
                <li key={t._id} className="card flex flex-col p-7">
                  <blockquote className="flex-1 text-[15px] leading-relaxed text-ink/85">&ldquo;{t.quote}&rdquo;</blockquote>
                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand">{t.name.charAt(0)}</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{t.name}</p>
                      {(t.role || t.company) && <p className="text-xs text-muted">{[t.role, t.company].filter(Boolean).join(", ")}</p>}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

/* Insights — latest published articles --------------------------------------- */

export type PostItem = { slug: string; title: string; excerpt?: string | null; category?: string | null; coverImage?: string | null; publishedAt?: string | null };

export function HomeInsights({ posts }: { posts: PostItem[] }) {
  if (!posts.length) return null;
  return (
    <section className="border-t border-line py-20 lg:py-28" aria-label="Insights">
      <div className="container">
        <SectionTitle label="Insights" title={<>From the <em>journal</em></>} href="/blog" linkText="All articles" />
        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}`} className="card group flex h-full flex-col overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden bg-paper">
                  {p.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- admin-provided cover image
                    <img src={p.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 ease-out-cubic group-hover:scale-[1.04]" />
                  ) : (
                    <div className="flex h-full items-end p-6 font-display text-3xl font-bold tracking-tight text-brand/20">Nexovate</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {p.category && <p className="label-plain">{p.category}</p>}
                  <h3 className="mt-2 text-xl leading-snug transition-colors group-hover:text-brand">{p.title}</h3>
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
    <section className="border-t border-line py-20 lg:py-28" aria-label="Frequently asked questions">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionTitle label="FAQ" title={<>Good to <em>know</em></>} intro="Quick answers to what clients ask most." />
          <Link href="/faq" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand">
            All questions <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="space-y-3 lg:col-span-7 lg:col-start-6">
          {faqs.slice(0, 6).map((f) => (
            <details key={f.q} className="group rounded-2xl border border-brand/30 bg-surface px-6 transition-colors open:border-brand/30 open:bg-surface [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-semibold text-ink">
                {f.q}
                <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-brand ring-1 ring-line transition-transform duration-300 group-open:rotate-45 group-open:bg-brand group-open:text-white group-open:ring-brand">
                  <Plus size={16} />
                </span>
              </summary>
              <p className="-mt-1 max-w-measure pb-6 text-[15px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Final call to action ------------------------------------------------------ */

export function HomeCta() {
  return (
    <section className="py-16 lg:py-24" aria-labelledby="cta-title">
      <div className="container">
        <div className="card card-float relative overflow-hidden !rounded-[32px] px-6 py-20 text-center sm:px-12 lg:py-24">
          <span aria-hidden className="absolute left-1/2 top-0 h-[3px] w-28 -translate-x-1/2 bg-brand" />
          <div aria-hidden className="grid-lines absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative mx-auto max-w-4xl">
            <p className="label">Start a project</p>
            <h2 id="cta-title" className="serif-heading mt-6 text-[2.6rem] leading-[1] tracking-[-0.045em] md:text-[4.5rem]">
              Let&apos;s build something <em>extraordinary.</em>
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-body-lg text-muted">
              Tell us what you&apos;re building. You&apos;ll get a clear plan, a timeline and a fixed price — free, with no obligation.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/get-a-quote" size="lg">
                Start a project <ArrowRight size={17} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href="/book-consultation" size="lg" variant="secondary">
                Book a free call
              </ButtonLink>
            </div>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand-soft/60 px-4 py-1.5 text-sm font-medium text-brand">
              <Globe2 size={15} aria-hidden /> Working with clients worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Pricing preview — real packages from Admin → Packages; hidden when none -------- */

export function HomePricing({ packages }: { packages: PackageCard[] }) {
  if (!packages.length) return null;
  const featured = packages.filter((p) => p.featured);
  const pick = [...featured, ...packages.filter((p) => !p.featured)].slice(0, 3);
  return (
    <section className="border-t border-line py-20 lg:py-28" aria-labelledby="pricing-title">
      <div className="container">
        <SectionTitle
          label="Pricing"
          title={
            <span id="pricing-title">
              Clear packages, <em>fixed prices.</em>
            </span>
          }
          intro="Start fast with a package — or get a written quote for anything bigger."
          href="/pricing"
          linkText="All pricing"
        />
        <ul className="mt-14 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
          {pick.map((p) => (
            <li key={p._id}>
              <PricingCard p={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
