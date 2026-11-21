import type { Metadata } from "next";
import Link from "next/link";
import { listTeamMembers } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";
import { seniorityDisplay } from "@/lib/constants";
import { TeamGrid } from "@/components/sections/team";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

// Profiles are managed in Admin → Team Profiles; refreshed every 5 minutes and on every edit.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the people at Nexovate who design, build and grow your digital products.",
  alternates: { canonical: "/team" },
};

// What working with the team looks like — all true of how Nexovate operates.
const assurances = [
  { t: "Free consultation", d: "A no-obligation call to understand what you need." },
  { t: "Written proposal first", d: "Scope, timeline and a fixed price before any work starts." },
  { t: "Your time zone", d: "Calls and updates scheduled around your working hours." },
  { t: "Your own dashboard", d: "Milestones, updates and invoices in one place." },
];

export default async function TeamPage() {
  const team = await safe(listTeamMembers, [], "team-page");

  // real counts per seniority level, e.g. "6 people · 2 lead · 2 senior"
  const counts = [...team.reduce((acc, m) => {
    const label = seniorityDisplay(m.seniority);
    if (label) acc.set(label, (acc.get(label) ?? 0) + 1);
    return acc;
  }, new Map<string, number>())];

  return (
    <div className="bg-paper">
      {/* intro */}
      <section className="pb-16 pt-16 lg:pb-24 lg:pt-28">
        <div className="container grid gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="label">Our team</p>
            <h1 className="serif-heading mt-6 text-display">
              The people behind the <em>work</em>
            </h1>
          </Reveal>
          <Reveal index={1} className="self-end lg:col-span-4 lg:col-start-9">
            <p className="max-w-measure text-body text-muted">
              Designers, engineers and marketers who stay with your project from the first call to launch — and long after it.
            </p>
            {team.length > 0 && (
              <p className="label-plain mt-8">
                {team.length} {team.length === 1 ? "person" : "people"}
                {counts.map(([label, n]) => ` · ${n} ${label.toLowerCase()}`).join("")}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {/* members */}
      <section className="border-t border-line py-16 lg:py-24" aria-label="Team members">
        <div className="container">
          {team.length ? (
            <TeamGrid members={team} />
          ) : (
            <p className="max-w-measure text-body text-muted">
              Team profiles are on their way. In the meantime,{" "}
              <Link href="/book-consultation" className="link-underline">
                book a call
              </Link>{" "}
              and meet the people you&apos;d be working with.
            </p>
          )}
        </div>
      </section>

      {/* closing — one floating white card */}
      <section className="border-t border-line py-20 lg:py-28" aria-labelledby="team-cta">
        <div className="container">
          <div className="card card-float relative grid gap-12 overflow-hidden !rounded-[32px] px-7 py-12 md:px-14 md:py-16 lg:grid-cols-12">
            <span aria-hidden className="absolute left-0 top-0 h-[3px] w-24 bg-brand" />
            <div className="lg:col-span-6">
              <h2 id="team-cta" className="serif-heading text-section">
                Work with <em>this team.</em>
              </h2>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <ButtonLink href="/book-consultation" size="lg">
                  Book a free consultation
                </ButtonLink>
                <ButtonLink href="/get-a-quote" size="lg" variant="secondary">
                  Start a project
                </ButtonLink>
              </div>
            </div>
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
              {assurances.map((a) => (
                <li key={a.t} className="border-t border-brand/20 pb-6 pt-5">
                  <p className="font-semibold text-ink">{a.t}</p>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{a.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
