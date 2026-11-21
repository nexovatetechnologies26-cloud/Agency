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
              <p className="label mt-8">
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

      {/* closing — the page's single dark section */}
      <section className="bg-ink py-24 text-bone lg:py-35" aria-labelledby="team-cta">
        <div className="container grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="team-cta" className="font-serif text-section text-bone">
              Work with <em className="italic text-bone/60">this team.</em>
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
              <ButtonLink href="/book-consultation" size="lg" variant="light">
                Book a free consultation
              </ButtonLink>
              <Link href="/get-a-quote" className="link-underline !text-bone hover:!text-white">
                Start a project <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-5 lg:col-start-8">
            {assurances.map((a) => (
              <li key={a.t} className="border-t border-bone/15 pb-6 pt-5">
                <p className="font-medium text-bone">{a.t}</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-bone/60">{a.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
