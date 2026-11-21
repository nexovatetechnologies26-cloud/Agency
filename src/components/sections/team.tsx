import { SENIORITY_LABELS, type Seniority } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";

// Admin-managed public team profiles (Admin → Team Profiles).
// Leadership (founder / director) is presented larger, with bios.

export type TeamMemberCard = {
  _id: string;
  name: string;
  title: string;
  seniority?: string | null;
  yearsExperience?: number | null;
  bio?: string | null;
  expertise?: string[];
  photo?: string | null;
  linkedin?: string | null;
  location?: string | null;
};

const LEADERSHIP = new Set(["founder", "director"]);

function meta(m: TeamMemberCard) {
  const level = m.seniority ? SENIORITY_LABELS[m.seniority as Seniority] : null;
  return [level, m.yearsExperience != null ? `${m.yearsExperience} yrs experience` : null, m.location].filter(Boolean).join(" · ");
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function Portrait({ m, large }: { m: TeamMemberCard; large?: boolean }) {
  return (
    <div className="group/portrait aspect-[4/5] overflow-hidden rounded-tile bg-line">
      {m.photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-provided portrait URL
        <img
          src={m.photo}
          alt={`Portrait of ${m.name}`}
          loading="lazy"
          className="h-full w-full object-cover grayscale-[35%] transition duration-700 ease-out-cubic group-hover/portrait:scale-[1.02] group-hover/portrait:grayscale-0"
        />
      ) : (
        <div className="flex h-full items-end p-6">
          <span aria-hidden className={`font-serif leading-none text-ink/20 ${large ? "text-[7rem]" : "text-[5rem]"}`}>
            {initials(m.name)}
          </span>
        </div>
      )}
    </div>
  );
}

function Person({ m, large, index }: { m: TeamMemberCard; large?: boolean; index: number }) {
  return (
    <Reveal as="li" index={index}>
      <article>
        <Portrait m={m} large={large} />
        <div className="mt-6">
          <h3 className={`font-serif font-normal leading-tight text-ink ${large ? "text-[2.25rem]" : "text-[1.75rem]"}`}>{m.name}</h3>
          <p className="mt-1 text-[15px] text-ink/80">{m.title}</p>
          {meta(m) && <p className="label mt-3">{meta(m)}</p>}
          {m.bio && <p className={`mt-4 text-body text-muted ${large ? "max-w-measure" : "line-clamp-3"}`}>{m.bio}</p>}
          {m.expertise && m.expertise.length > 0 && <p className="mt-4 text-sm text-ink/70">{m.expertise.join(" / ")}</p>}
          {m.linkedin && (
            <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="link-underline mt-5 !text-sm">
              LinkedIn <span aria-hidden>→</span>
              <span className="sr-only"> profile of {m.name}</span>
            </a>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export function TeamSection({ members, headingLevel = "h2" }: { members: TeamMemberCard[]; headingLevel?: "h1" | "h2" }) {
  if (!members.length) return null;
  const leaders = members.filter((m) => LEADERSHIP.has(m.seniority ?? ""));
  const others = members.filter((m) => !LEADERSHIP.has(m.seniority ?? ""));
  const Heading = headingLevel;

  return (
    <section className="border-t border-line bg-paper py-20 lg:py-35" aria-labelledby="team-title">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="label">Team</p>
            <Heading id="team-title" className="serif-heading mt-6 text-section">
              The people behind the <em>work</em>
            </Heading>
          </Reveal>
          <Reveal index={1} as="p" className="max-w-measure self-end text-body text-muted lg:col-span-5 lg:col-start-8">
            A small senior team that stays with your project from the first call to launch and beyond. You&apos;ll always know who is doing the work.
          </Reveal>
        </div>

        {leaders.length > 0 && (
          <ul className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:mt-24">
            {leaders.map((m, i) => (
              <Person key={m._id} m={m} large index={i} />
            ))}
          </ul>
        )}

        {others.length > 0 && (
          <ul className={`grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 ${leaders.length ? "mt-20 border-t border-line pt-16 lg:mt-28" : "mt-16 lg:mt-24"}`}>
            {others.map((m, i) => (
              <Person key={m._id} m={m} index={i} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
