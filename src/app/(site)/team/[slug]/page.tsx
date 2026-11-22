import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedTeamMember, listTeamMembers } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";
import { site } from "@/content/site";
import { TeamGrid, initials, memberHref, seniorityLabel, type TeamMemberCard } from "@/components/sections/team";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ContactButtons, MailIcon, WhatsAppIcon, mailHref, whatsappHref } from "@/components/ui/contact-buttons";
import { PlatformBadge, linkLabel, type ProfileLink } from "@/components/ui/social-links";
import { RemoteImage } from "@/components/ui/remote-image";

// Rendered on first visit, then cached; refreshed every 5 minutes and on every admin edit.
export const revalidate = 300;
// cache every profile / post / project after its first visit (ISR) instead of querying the database on each request
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = await safe(() => getPublishedTeamMember(slug), null, "team-member-meta");
  if (!m) return { title: "Team" };
  return {
    title: `${m.name} — ${m.title}`,
    description: m.bio?.slice(0, 160) || `${m.name}, ${m.title} at ${site.name}.`,
    alternates: { canonical: memberHref(m) },
    openGraph: m.photo ? { images: [m.photo] } : undefined,
  };
}

/* ------------------------------------------------------------ building blocks */

/**
 * Profile card in the brand language: a violet top rule, violet label marker,
 * serif title. `tone="dark"` uses the brand charcoal for the key card.
 */
function Card({
  label,
  title,
  children,
  tone = "light",
  className = "",
}: {
  label: string;
  title?: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`relative overflow-hidden rounded-tile p-7 md:p-9 ${dark ? "bg-charcoal text-bone" : "border border-brand/30 bg-surface"} ${className}`}
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
      <p className={`flex items-center gap-2.5 text-label font-medium uppercase ${dark ? "text-bone/55" : "text-muted"}`}>
        <span aria-hidden className="h-2 w-2 rotate-45 bg-brand" />
        {label}
      </p>
      {title && <h2 className={`mt-4 font-serif text-[2rem] font-semibold leading-tight ${dark ? "text-bone" : "text-ink"}`}>{title}</h2>}
      <div className={title ? "mt-7" : "mt-5"}>{children}</div>
    </div>
  );
}

function ProfilePhoto({ m }: { m: TeamMemberCard }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-tile border border-line bg-brand-soft">
      {m.photo ? (
        <RemoteImage src={m.photo} alt={`Portrait of ${m.name}`} sizes="(min-width: 1024px) 420px, 92vw" priority className="object-cover object-top" />
      ) : (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center font-serif text-[10rem] leading-none text-brand/40">
          {initials(m.name)}
        </span>
      )}
    </div>
  );
}

/** One contact line in the sidebar card: icon and channel name only (Email, WhatsApp, LinkedIn…) — the address or number stays in the link. */
function ContactRow({ href, icon, label, external }: { href: string; icon: React.ReactNode; label: string; external?: boolean }) {
  return (
    <li>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={label}
        className="group/row flex items-center gap-4 border-b border-line py-3.5 last:border-0"
      >
        {icon}
        <span className="flex-1 text-[15px] font-semibold text-ink transition-colors group-hover/row:text-brand">{label}</span>
        <span aria-hidden className="text-muted/60 transition-transform duration-300 group-hover/row:translate-x-1 group-hover/row:text-brand">→</span>
      </a>
    </li>
  );
}

/**
 * Splits a bio into a short intro (first sentence or two, ~200 chars) and the rest,
 * so the About card stays compact and the full text is one click away.
 */
function splitBio(paragraphs: string[]) {
  if (!paragraphs.length) return { intro: "", rest: [] as string[] };
  const [first, ...others] = paragraphs;
  if (first.length <= 180) return { intro: first, rest: others };
  const sentences = first.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g) ?? [first];
  let intro = "";
  for (const sentence of sentences) {
    if (intro && (intro + sentence).length > 180) break;
    intro += sentence;
  }
  intro = intro.trim();
  if (intro.length > 220) intro = `${first.slice(0, 177).trimEnd()}…`;
  const remainder = first.slice(intro.replace(/…$/, "").length).trim();
  return { intro, rest: remainder ? [remainder, ...others] : others };
}

/* ------------------------------------------------------------------- page */

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const [m, everyone] = await Promise.all([getPublishedTeamMember(slug), safe(listTeamMembers, [], "team-others")]);
  if (!m) notFound();

  const first = m.name.split(/\s+/)[0];
  const level = seniorityLabel(m.seniority);
  const others = everyone.filter((x) => x._id !== m._id).slice(0, 3);
  const paragraphs = (m.bio ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const bio = splitBio(paragraphs);
  const responsibilities = m.responsibilities ?? [];
  const expertise = m.expertise ?? [];
  const notable = m.notableWork ?? [];
  const languages = m.languages ?? [];
  const links: ProfileLink[] = [...(m.linkedin ? [{ url: m.linkedin }] : []), ...(m.links ?? [])].filter(
    (l, i, all) => all.findIndex((x) => x.url === l.url) === i,
  );
  const hasContact = Boolean(m.email || m.whatsapp || links.length);
  const hasSidebar = hasContact || expertise.length > 0;
  const hasMain = paragraphs.length > 0 || responsibilities.length > 0 || notable.length > 0;

  // stat cards — only what the admin actually entered
  const facts = [
    m.yearsExperience != null ? { k: "Experience", v: `${m.yearsExperience}`, unit: m.yearsExperience === 1 ? "year" : "years" } : null,
    level ? { k: "Seniority", v: level } : null,
    m.location ? { k: "Based in", v: m.location } : null,
    languages.length ? { k: languages.length === 1 ? "Language" : "Languages", v: languages.join(", ") } : null,
  ].filter((f): f is { k: string; v: string; unit?: string } => Boolean(f));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: m.name,
    jobTitle: m.title,
    image: m.photo || undefined,
    description: m.bio || undefined,
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
    sameAs: links.length ? links.map((l) => l.url) : undefined,
    email: m.email || undefined,
    knowsAbout: expertise.length ? expertise : undefined,
    knowsLanguage: languages.length ? languages : undefined,
  };

  return (
    <div className="bg-paper">
      {/* 1 · hero */}
      <section className="pb-16 pt-10 lg:pb-20 lg:pt-14">
        <div className="container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted">
            <Link href="/team" className="transition-colors hover:text-brand">Team</Link>
            <span aria-hidden>/</span>
            <span className="text-ink">{m.name}</span>
          </nav>

          <div className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-5">
              <ProfilePhoto m={m} />
            </Reveal>

            <div className="flex flex-col lg:col-span-7 lg:pl-6">
              <Reveal>
                {level && (
                  <p className="label">
                    {level}
                  </p>
                )}
                <h1 className="serif-heading mt-6 text-display">{m.name}</h1>
                <p className="mt-5 text-xl font-medium text-brand md:text-2xl">{m.title}</p>
              </Reveal>

              <Reveal index={1} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
                <ButtonLink href="/get-a-quote" size="lg">
                  Start a project with {first}
                </ButtonLink>
                <ContactButtons email={m.email} whatsapp={m.whatsapp} firstName={first} siteName={site.name} />
              </Reveal>

              {facts.length > 0 && (
                <Reveal index={2} className="mt-auto pt-12">
                  <dl className={`grid gap-3 ${facts.length >= 4 ? "grid-cols-2 xl:grid-cols-4" : facts.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
                    {facts.map((f) => (
                      <div key={f.k} className="relative overflow-hidden rounded-tile border border-brand/30 bg-surface px-5 pb-5 pt-6">
                        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
                        <dt className="label-plain">{f.k}</dt>
                        <dd className={`mt-3 break-words font-serif leading-tight text-brand ${f.v.length > 14 ? "text-[1.15rem]" : f.v.length > 9 ? "text-[1.45rem]" : "text-[1.9rem] leading-none"}`}>
                          {f.v}
                          {f.unit && <span className="ml-1.5 font-sans text-sm text-muted">{f.unit}</span>}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2 · profile body: main column + sticky sidebar */}
      {(hasMain || hasSidebar) && (
        <section className="border-t border-line py-16 lg:py-24">
          <div className={`container grid gap-6 ${hasMain && hasSidebar ? "lg:grid-cols-12" : ""}`}>
            {hasMain && (
              <div className={`space-y-6 ${hasSidebar ? "lg:col-span-8" : ""}`}>
                {paragraphs.length > 0 && (
                  <Reveal>
                    <Card label="Profile" title={`Meet ${first}`}>
                      <div className="grid gap-6 md:grid-cols-[3px_1fr] md:gap-7">
                        <span aria-hidden className="hidden rounded-full bg-brand md:block" />
                        <div>
                          <p className="max-w-measure text-body-lg leading-relaxed text-ink/85">{bio.intro}</p>
                          <p className="mt-5 text-sm text-muted">
                            <span className="font-medium text-ink">{m.name}</span> · {m.title}
                          </p>
                        </div>
                      </div>
                      {bio.rest.length > 0 && (
                        <details className="group/bio mt-7 border-t border-line pt-5 [&_summary::-webkit-details-marker]:hidden">
                          <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-sm font-medium text-brand hover:text-brand-deep">
                            <span className="group-open/bio:hidden">Read full bio</span>
                            <span className="hidden group-open/bio:inline">Show less</span>
                            <span aria-hidden className="transition-transform duration-300 group-open/bio:rotate-180">↓</span>
                          </summary>
                          <div className="mt-5 max-w-measure space-y-4 text-body text-ink/80">
                            {bio.rest.map((t, i) => (
                              <p key={i}>{t}</p>
                            ))}
                          </div>
                        </details>
                      )}
                    </Card>
                  </Reveal>
                )}

                {responsibilities.length > 0 && (
                  <Reveal>
                    <Card label="Role" title={`What ${first} does`}>
                      <ol className="grid gap-4 sm:grid-cols-2">
                        {responsibilities.map((r, i) => (
                          <li
                            key={r.title}
                            className="group/card relative overflow-hidden rounded-tile border border-brand/30 border-l-[3px] border-l-brand bg-surface p-6 transition-colors duration-300 hover:bg-brand-soft"
                          >
                            <span className="font-serif text-4xl italic leading-none text-brand">{String(i + 1).padStart(2, "0")}</span>
                            <h3 className="mt-4 text-lg font-semibold tracking-tight text-ink">{r.title}</h3>
                            {r.description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{r.description}</p>}
                          </li>
                        ))}
                      </ol>
                    </Card>
                  </Reveal>
                )}

                {notable.length > 0 && (
                  <Reveal>
                    <Card label="Track record" title="Notable work">
                      <ul>
                        {notable.map((n, i) => (
                          <li key={n} className="grid grid-cols-[3rem_1fr] items-baseline border-t border-line py-5 first:border-t-0 first:pt-0 last:pb-0">
                            <span className="font-serif text-2xl italic text-brand">{String(i + 1).padStart(2, "0")}</span>
                            <span className="text-body text-ink/85">{n}</span>
                          </li>
                        ))}
                      </ul>
                    </Card>
                  </Reveal>
                )}
              </div>
            )}

            {hasSidebar && (
              <aside className={hasMain ? "lg:col-span-4" : ""} aria-label={`About ${first} — details`}>
                <div className="space-y-6 lg:sticky lg:top-28">
                  {hasContact && (
                    <Reveal>
                      <Card label="Direct line" title={`Talk to ${first}`}>
                        <ul className="-my-4">
                          {m.email && (
                            <ContactRow
                              href={mailHref(m.email, site.name)}
                              label="Email"
                              icon={
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                                  <MailIcon className="h-[18px] w-[18px]" />
                                </span>
                              }
                            />
                          )}
                          {m.whatsapp && (
                            <ContactRow
                              href={whatsappHref(m.whatsapp, first, site.name)}
                              external
                              label="WhatsApp"
                              icon={
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
                                  <WhatsAppIcon className="h-5 w-5" />
                                </span>
                              }
                            />
                          )}
                          {links.map((l) => (
                            <ContactRow key={l.url} href={l.url} external label={linkLabel(l)} icon={<PlatformBadge url={l.url} />} />
                          ))}
                        </ul>
                      </Card>
                    </Reveal>
                  )}

                  {expertise.length > 0 && (
                    <Reveal>
                      <Card label="Expertise" title="Skills">
                        <ul className="flex flex-wrap gap-2">
                          {expertise.map((e) => (
                            <li key={e} className="rounded-full bg-brand-soft px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand hover:text-white">
                              {e}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </Reveal>
                  )}

                </div>
              </aside>
            )}
          </div>
        </section>
      )}

      {/* 3 · in their words — one floating white card */}
      {m.quote && (
        <section className="border-t border-line py-20 lg:py-28" aria-label={`In ${first}'s words`}>
          <div className="container">
            <Reveal as="figure" className="card card-float relative mx-auto max-w-5xl overflow-hidden !rounded-[32px] px-7 py-12 md:px-14 md:py-16">
              <span aria-hidden className="absolute left-0 top-0 h-[3px] w-24 bg-brand" />
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-3">
                  <p className="label">In {first}&apos;s words</p>
                  <span aria-hidden className="mt-6 block font-accent text-[6rem] leading-[0.6] text-brand">&ldquo;</span>
                </div>
                <div className="lg:col-span-9">
                  <blockquote className="font-accent text-[1.9rem] leading-[1.25] text-ink md:text-[2.5rem]">{m.quote}</blockquote>
                  <figcaption className="mt-10 flex items-center gap-4 border-t border-brand/20 pt-6">
                    <span aria-hidden className="h-2 w-2 rotate-45 bg-brand" />
                    <span>
                      <span className="block font-display text-lg font-semibold tracking-tight text-ink">{m.name}</span>
                      {m.title && <span className="block text-sm text-muted">{m.title}</span>}
                    </span>
                  </figcaption>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* 4 · work with */}
      <section className="border-t border-line py-20 lg:py-35" aria-labelledby="work-with">
        <div className="container grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 id="work-with" className="serif-heading text-section lg:text-[4rem]">
              Work with <em>{first}</em>
            </h2>
          </Reveal>
          <Reveal index={1} className="lg:col-span-4 lg:col-start-9 lg:self-end">
            <p className="max-w-measure text-body text-muted">
              Tell us about your project and we&apos;ll bring the right people in — starting with a free consultation and a written proposal.
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

      {/* 5 · more of the team */}
      {others.length > 0 && (
        <section className="border-t border-line py-20 lg:py-28" aria-labelledby="more-team">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="more-team" className="serif-heading text-section">
                More of the <em>team</em>
              </h2>
              <Link href="/team" className="link-underline">
                Everyone <span aria-hidden>→</span>
              </Link>
            </div>
            <div className="mt-14">
              <TeamGrid members={others} />
            </div>
          </div>
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
