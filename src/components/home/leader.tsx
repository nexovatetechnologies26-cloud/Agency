import { ArrowRight, Linkedin, Users } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { initials, memberHref, seniorityLabel, type TeamMemberCard } from "@/components/sections/team";

// Homepage leadership spotlight. Shows the published team profile whose
// seniority is CEO (or chief executive); falls back to a founder / co-founder.
// Everything comes from Admin → Team Profiles. Hidden when no such profile exists.

const isCeo = (s?: string | null) => /\bceo\b|chief executive/i.test(seniorityLabel(s) ?? "");
const isFounder = (s?: string | null) => /founder/i.test(seniorityLabel(s) ?? "");

export function pickLeader(members: TeamMemberCard[]) {
  return members.find((m) => isCeo(m.seniority) || isCeo(m.title)) ?? members.find((m) => isFounder(m.seniority) || isFounder(m.title)) ?? null;
}

/** First sentence of the bio, used when no personal quote is set. */
function firstSentence(text?: string | null) {
  const t = (text ?? "").trim();
  if (!t) return null;
  const m = t.match(/^.+?[.!?](\s|$)/);
  return (m ? m[0] : t).trim();
}

export function HomeLeader({ leader }: { leader: TeamMemberCard | null }) {
  if (!leader) return null;
  const role = seniorityLabel(leader.seniority) ?? "Leadership";
  const words = leader.quote?.trim() || firstSentence(leader.bio);
  const first = leader.name.split(/\s+/)[0];
  const meta = [leader.yearsExperience != null ? `${leader.yearsExperience} years of experience` : null, leader.location].filter(Boolean).join(" · ");

  return (
    <section className="relative overflow-hidden border-t border-line py-20 lg:py-28" aria-labelledby="leader-title">
      <div aria-hidden className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_50%,black,transparent_65%)]" />
      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* the whole portrait is one floating card — lifted, brand border, soft violet light below */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="card card-float group relative aspect-[4/5] overflow-hidden !rounded-[28px] border-2 bg-surface p-2">
              <div className="relative h-full w-full overflow-hidden rounded-[22px]">
                {leader.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- admin-provided portrait URL
                  <img src={leader.photo} alt={`Portrait of ${leader.name}, ${role}`} loading="lazy" className="h-full w-full object-cover object-top" />
                ) : (
                  <span aria-hidden className="flex h-full items-center justify-center font-display text-[8rem] font-semibold text-brand/40">
                    {initials(leader.name)}
                  </span>
                )}

                {/* name plate inside the picture */}
                <div className="absolute inset-x-3 bottom-3 flex items-center gap-4 rounded-2xl border border-line bg-surface/95 py-3.5 pl-3.5 pr-5 shadow-lift">
                  <span aria-hidden className="h-11 w-[3px] shrink-0 rounded-full bg-brand" />
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.22em] text-brand">
                      <span className="h-1.5 w-1.5 rotate-45 bg-brand" />
                      {role}
                    </p>
                    <p className="mt-0.5 truncate font-display text-[1.35rem] font-semibold leading-tight tracking-tight">{leader.name}</p>
                    {meta && <p className="mt-0.5 truncate text-[12px] text-muted">{meta}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* words */}
          <div>
            <p className="label">A word from our {role.toLowerCase().includes("ceo") ? "CEO" : role}</p>
            {words && (
              <blockquote className="mt-8">
                <span aria-hidden className="block font-accent text-[5rem] leading-[0.6] text-brand">&ldquo;</span>
                <p id="leader-title" className="mt-2 font-accent text-[1.9rem] italic leading-[1.25] text-ink md:text-[2.5rem]">
                  {words}
                </p>
              </blockquote>
            )}

            <div className="mt-10 flex items-center gap-4 border-t border-line pt-8">
              <span aria-hidden className="h-px w-12 bg-brand" />
              <div>
                <p className="font-accent text-2xl italic text-ink">{leader.name}</p>
                <p className="mt-0.5 text-sm text-muted">
                  {leader.title}
                  {meta && <span className="text-muted/70"> · {meta}</span>}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ButtonLink href={memberHref(leader)} size="lg">
                Meet {first} <ArrowRight size={17} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
              </ButtonLink>
              {leader.linkedin && (
                <a
                  href={leader.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[52px] items-center gap-2.5 rounded-btn border border-line px-6 text-[15px] font-semibold text-ink transition-colors hover:border-ink"
                >
                  <Linkedin size={17} aria-hidden /> LinkedIn
                </a>
              )}
              <ButtonLink href="/team" size="lg" variant="secondary">
                <Users size={17} aria-hidden /> Our team
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
