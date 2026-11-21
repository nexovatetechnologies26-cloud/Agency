import Link from "next/link";
import { ArrowRight, Linkedin } from "lucide-react";
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
          {/* portrait in a fine violet frame */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div aria-hidden className="absolute -inset-3 rounded-[34px] border border-brand/30" />
            <div aria-hidden className="absolute -inset-6 rounded-[40px] border border-line" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-surface">
              {leader.photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- admin-provided portrait URL
                <img src={leader.photo} alt={`Portrait of ${leader.name}, ${role}`} loading="lazy" className="h-full w-full object-cover object-top" />
              ) : (
                <span aria-hidden className="flex h-full items-center justify-center font-display text-[8rem] font-semibold text-brand/40">
                  {initials(leader.name)}
                </span>
              )}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 bg-obsidian/85 px-5 py-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">{role}</p>
                <p className="mt-1 font-display text-xl font-semibold tracking-tight text-white">{leader.name}</p>
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
              <Link href="/team" className="link-underline ml-1">
                Our team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
