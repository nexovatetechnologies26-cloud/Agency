import Link from "next/link";
import clsx from "clsx";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Globe2,
  Layers,
  LayoutDashboard,
  MessagesSquare,
  Plus,
  Quote,
  Receipt,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { publishedServices, type ServiceCategory } from "@/content/services";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button";
import { CountUp } from "@/components/ui/count-up";
import { ServiceIcon } from "@/components/ui/service-icon";

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
            dark ? "border-white/20 text-white hover:border-white" : "border-ink/15 bg-white text-ink hover:border-ink",
          )}
        >
          {linkText}
          <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

/* Hero ------------------------------------------------------------------------ */

const heroPoints = ["Written scope & fixed price", "Live client dashboard", "Clients worldwide, any time zone"];

export function HomeHero() {
  return (
    <section className="hero-wash relative overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden className="grid-lines-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="container relative grid items-center gap-14 pb-20 pt-12 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div className="animate-page-in">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-brand/20 bg-white/80 py-1.5 pl-1.5 pr-4 text-[13px] font-medium text-ink shadow-sm backdrop-blur">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-white">
              <Sparkles size={11} aria-hidden /> Agency
            </span>
            {site.tagline}
          </p>
          <h1 id="hero-title" className="serif-heading mt-7 text-display">
            We build digital products that <em>perform.</em>
          </h1>
          <p className="mt-7 max-w-xl text-body-lg text-muted md:text-[1.2rem] md:leading-relaxed">
            Websites, custom software, AI automation and marketing — designed, engineered and grown by one senior team, for businesses worldwide.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/get-a-quote" size="lg">
              Start a project <ArrowRight size={17} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href="/book-consultation" size="lg" variant="secondary">
              Book a free consultation
            </ButtonLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {heroPoints.map((p) => (
              <li key={p} className="inline-flex items-center gap-2 text-sm font-medium text-ink/75">
                <CheckCircle2 size={16} className="text-brand" aria-hidden /> {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-page-in [animation-delay:150ms]">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

/** Decorative composition: a browser window, a project tracker and status chips. */
function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[560px] select-none">
      <div className="absolute -inset-10 rounded-full bg-brand/20 blur-3xl" />

      {/* browser */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink shadow-[0_40px_80px_-30px_rgba(23,21,31,0.6)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-[11px] text-white/40">{site.domain}</span>
        </div>
        <div className="grid-lines relative p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand/40 blur-3xl" />
          <div className="relative">
            <div className="h-2 w-16 rounded-full bg-[#B79BFF]/70" />
            <div className="mt-4 h-5 w-4/5 rounded-md bg-white/85" />
            <div className="mt-2.5 h-5 w-3/5 rounded-md bg-white/85" />
            <div className="mt-4 h-2 w-2/3 rounded-full bg-white/20" />
            <div className="mt-2 h-2 w-1/2 rounded-full bg-white/20" />
            <div className="mt-6 flex gap-2">
              <div className="h-8 w-28 rounded-full bg-brand" />
              <div className="h-8 w-24 rounded-full border border-white/20" />
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="h-6 w-6 rounded-lg bg-brand/60" />
                  <div className="mt-3 h-1.5 w-full rounded-full bg-white/20" />
                  <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* project tracker */}
      <div className="absolute -bottom-10 -left-4 w-[250px] animate-float rounded-2xl border border-line bg-white p-4 shadow-lift sm:-left-10">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">Your project</p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" /> On track
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-ink">Milestone 3 of 4 · Build</p>
        <div className="mt-3 h-2 rounded-full bg-paper">
          <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-brand to-[#9A72F0]" />
        </div>
        <div className="mt-3 flex -space-x-2">
          {["bg-brand", "bg-ink", "bg-[#9A72F0]"].map((c) => (
            <span key={c} className={`h-6 w-6 rounded-full border-2 border-white ${c}`} />
          ))}
        </div>
      </div>

      {/* status chips */}
      <div className="absolute -right-2 top-16 hidden animate-float rounded-2xl border border-line bg-white px-4 py-3 shadow-lift [animation-delay:1.5s] sm:block md:-right-8">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-soft text-brand">
            <FileText size={14} />
          </span>
          Proposal accepted
        </p>
      </div>
      <div className="absolute -right-4 bottom-20 hidden animate-float rounded-2xl border border-line bg-white px-4 py-3 shadow-lift [animation-delay:3s] sm:block md:-right-10">
        <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={14} />
          </span>
          Launched
        </p>
      </div>
    </div>
  );
}

/* Marquee — what we do, on a loop ---------------------------------------------- */

export function HomeMarquee() {
  const words = publishedServices.map((s) => s.title);
  const row = [...words, ...words];
  return (
    <section aria-label="Services overview" className="relative overflow-hidden border-y border-ink bg-ink py-6">
      <div className="flex w-max animate-marquee gap-10 hover:[animation-play-state:paused] motion-reduce:animate-none">
        {row.map((w, i) => (
          <span key={i} aria-hidden={i >= words.length} className="flex items-center gap-10 whitespace-nowrap font-display text-2xl font-semibold tracking-tight text-white/90 md:text-3xl">
            {w}
            <span aria-hidden className="text-[#B79BFF]">✦</span>
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
        <ul className={`grid grid-cols-2 overflow-hidden rounded-3xl border border-line bg-white ${cols}`}>
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
  { n: "01", t: "Build", d: "Websites, stores and apps engineered to load fast, rank well and last.", slugs: ["web-development", "wordpress-development", "ecommerce-development", "mobile-app-development"], span: "lg:col-span-2", dark: true },
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
                g.dark ? "border-ink bg-ink text-white" : "border-line bg-white",
              )}
            >
              {g.dark && <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/50 blur-3xl" />}
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
                      <span className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", g.dark ? "bg-brand text-white" : "bg-white text-brand shadow-sm")}>
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

/* Why Nexovate — real differentiators, with a client-dashboard preview --------- */

const reasons = [
  { icon: FileText, t: "Fixed price, in writing", d: "A proposal with scope, timeline and price before any work starts." },
  { icon: LayoutDashboard, t: "Your own client dashboard", d: "Track orders, approve proposals, pay invoices and message the team." },
  { icon: Layers, t: "One team, end to end", d: "Strategy, design, engineering and marketing — no vendor juggling." },
  { icon: ShieldCheck, t: "Built to last", d: "Secure, maintainable code your team can run and grow." },
];

export function HomeWhy() {
  return (
    <section className="border-t border-line bg-white py-20 lg:py-28" aria-labelledby="why-title">
      <div className="container grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionTitle
            label="Why Nexovate"
            title={
              <span id="why-title">
                Agency craft. <em>Product-grade</em> transparency.
              </span>
            }
            intro="You always know what you're getting, what it costs and where it stands."
          />
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {reasons.map(({ icon: Icon, t, d }) => (
              <li key={t}>
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 text-[17px] font-semibold">{t}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  const rows = [
    { t: "Website redesign", s: "In progress", c: "bg-brand-soft text-brand" },
    { t: "SEO retainer", s: "Active", c: "bg-emerald-50 text-emerald-700" },
    { t: "Brand identity", s: "Completed", c: "bg-paper text-muted" },
  ];
  return (
    <div aria-hidden className="relative select-none">
      <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-brand/20 via-transparent to-brand/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl border border-line bg-paper shadow-lift">
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
          <span className="font-display text-sm font-bold tracking-tight text-ink">
            Ne<span className="text-brand">x</span>ovate <span className="ml-1 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand">Client</span>
          </span>
          <span className="h-7 w-7 rounded-full bg-brand" />
        </div>
        <div className="p-5 sm:p-6">
          <p className="font-display text-lg font-semibold tracking-tight text-ink">Welcome back</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { i: LayoutDashboard, k: "Active orders", v: "2" },
              { i: Receipt, k: "Invoices due", v: "0" },
              { i: MessagesSquare, k: "Messages", v: "3" },
            ].map(({ i: I, k, v }) => (
              <div key={k} className="rounded-2xl border border-line bg-white p-3.5">
                <I size={16} className="text-brand" />
                <p className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">{v}</p>
                <p className="text-[11px] text-muted">{k}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border border-line bg-white">
            {rows.map((r, i) => (
              <div key={r.t} className={clsx("flex items-center justify-between px-4 py-3.5", i > 0 && "border-t border-line")}>
                <div>
                  <p className="text-[13px] font-semibold text-ink">{r.t}</p>
                  <div className="mt-1.5 h-1.5 w-28 rounded-full bg-paper">
                    <div className="h-1.5 rounded-full bg-brand" style={{ width: `${[65, 100, 100][i]}%` }} />
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${r.c}`}>{r.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
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

/* Process — dark band, four steps ------------------------------------------ */

const steps = [
  { t: "Discover", d: "A free call to understand your goals, users and constraints." },
  { t: "Propose", d: "Scope, timeline and a fixed price — in writing, approved online." },
  { t: "Build", d: "Milestones you review and approve in your dashboard." },
  { t: "Launch & grow", d: "We ship, hand over, and keep supporting after go-live." },
];

export function HomeProcess() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-white lg:py-28" aria-labelledby="process-title">
      <div aria-hidden className="grid-lines absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div aria-hidden className="absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-brand/30 blur-3xl" />
      <div className="container relative">
        <SectionTitle
          dark
          label="How we work"
          title={
            <span id="process-title">
              From first call to launch — <em>no surprises.</em>
            </span>
          }
          intro="Every project starts with a written scope and a fixed price, and ends with something your team can run and grow."
          href="/book-consultation"
          linkText="Book the first call"
        />
        <ol className="relative mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <span aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-brand via-white/20 to-transparent lg:block" />
          {steps.map((s, i) => (
            <li key={s.t} data-card className="relative">
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-ink font-display text-sm font-semibold text-white ring-8 ring-ink">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition-colors hover:border-white/25">
                <h3 className="font-display text-xl font-semibold tracking-tight text-white">{s.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/60">{s.d}</p>
              </div>
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
                  "card group flex h-full flex-col p-8",
                  m.featured && "!border-brand bg-gradient-to-b from-brand-soft/70 to-white ring-1 ring-brand/20",
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
    <section className="border-t border-line bg-white py-20 lg:py-28" aria-label="Testimonials">
      <div className="container">
        <SectionTitle label="Client stories" title={<>What clients <em>say</em></>} />
        <div className="mt-14 grid gap-5 lg:grid-cols-5">
          <figure data-card className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white md:p-12 lg:col-span-3">
            <div aria-hidden className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/40 blur-3xl" />
            <Quote size={36} className="relative text-[#B79BFF]" aria-hidden />
            <blockquote className="relative mt-6 font-display text-2xl font-medium leading-snug tracking-tight md:text-[1.9rem]">{first.quote}</blockquote>
            <figcaption className="relative mt-8 flex items-center gap-3">
              <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-full bg-brand font-semibold">{first.name.charAt(0)}</span>
              <span>
                <span className="block font-semibold">{first.name}</span>
                {(first.role || first.company) && <span className="block text-sm text-white/55">{[first.role, first.company].filter(Boolean).join(", ")}</span>}
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
                <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-soft to-paper">
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
    <section className="border-t border-line bg-white py-20 lg:py-28" aria-label="Frequently asked questions">
      <div className="container grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionTitle label="FAQ" title={<>Good to <em>know</em></>} intro="Quick answers to what clients ask most." />
          <Link href="/faq" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand">
            All questions <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="space-y-3 lg:col-span-7 lg:col-start-6">
          {faqs.slice(0, 6).map((f) => (
            <details key={f.q} className="group rounded-2xl border border-line bg-paper/50 px-6 transition-colors open:border-brand/30 open:bg-white [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[16px] font-semibold text-ink">
                {f.q}
                <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-brand ring-1 ring-line transition-transform duration-300 group-open:rotate-45 group-open:bg-brand group-open:text-white group-open:ring-brand">
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
        <div className="relative overflow-hidden rounded-[32px] bg-ink px-6 py-16 text-center text-white sm:px-12 lg:py-24">
          <div aria-hidden className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div aria-hidden className="absolute left-1/2 top-0 h-80 w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/60 blur-3xl" />
          <div className="relative mx-auto max-w-3xl">
            <p className="label !text-[#B79BFF] before:!bg-[#B79BFF]">Let&apos;s build</p>
            <h2 id="cta-title" className="mt-5 font-display text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-[4rem]">
              Have a project in <em className="text-gradient pr-1">mind?</em>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-body-lg text-white/65">Tell us what you&apos;re building. You&apos;ll get a clear plan, a timeline and a fixed price — free, with no obligation.</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/get-a-quote" size="lg" variant="light">
                Start a project <ArrowRight size={17} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href="/book-consultation" size="lg" variant="outline-light">
                Book a free call
              </ButtonLink>
            </div>
            <p className="mt-8 inline-flex items-center gap-2 text-sm text-white/50">
              <Globe2 size={15} aria-hidden /> Working with clients worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
