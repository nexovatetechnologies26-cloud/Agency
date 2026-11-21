import Link from "next/link";
import { seniorityDisplay } from "@/lib/constants";
import { Reveal } from "@/components/ui/reveal";

// Admin-managed public team profiles (Admin → Team Profiles).
// Cards are ordered by seniority and each one opens the member's own page.

export type TeamMemberCard = {
  _id: string;
  slug?: string | null;
  name: string;
  title: string;
  seniority?: string | null;
  yearsExperience?: number | null;
  bio?: string | null;
  quote?: string | null;
  expertise?: string[];
  responsibilities?: { title: string; description?: string | null }[];
  notableWork?: string[];
  languages?: string[];
  photo?: string | null;
  linkedin?: string | null;
  links?: { label?: string | null; url: string }[];
  email?: string | null;
  whatsapp?: string | null;
  location?: string | null;
};

export const memberHref = (m: { slug?: string | null; _id: string }) => `/team/${m.slug || m._id}`;
export const seniorityLabel = (s?: string | null) => seniorityDisplay(s);

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/** Circular avatar with a thin ring; initials when no photo is set. */
export function Portrait({ m, size = "md", eager = false }: { m: TeamMemberCard; size?: "md" | "lg"; eager?: boolean }) {
  const box = size === "lg" ? "h-56 w-56 md:h-64 md:w-64" : "h-28 w-28";
  return (
    <div
      className={`relative mx-auto shrink-0 overflow-hidden rounded-full bg-brand-soft ring-2 ring-brand/70 ring-offset-4 ring-offset-white transition-[box-shadow] duration-300 group-hover:ring-brand ${box}`}
    >
      {m.photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-provided portrait URL
        <img
          src={m.photo}
          alt={`Portrait of ${m.name}`}
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <span aria-hidden className={`flex h-full w-full items-center justify-center font-serif text-brand ${size === "lg" ? "text-7xl" : "text-4xl"}`}>
          {initials(m.name)}
        </span>
      )}
    </div>
  );
}

export function TeamCard({ m, index = 0 }: { m: TeamMemberCard; index?: number }) {
  const level = seniorityLabel(m.seniority);
  return (
    <Reveal as="li" index={index % 3} className="h-full">
      <Link
        href={memberHref(m)}
        className="group relative flex h-full flex-col items-center overflow-hidden rounded-tile border border-line bg-white px-6 pb-7 pt-10 text-center transition duration-300 ease-out-cubic hover:-translate-y-1.5 hover:border-brand/50"
        aria-label={`${m.name}, ${m.title} — view profile`}
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] bg-brand" />
        <Portrait m={m} />
        <h3 className="mt-6 font-serif text-[1.65rem] font-semibold leading-tight text-ink transition-colors group-hover:text-brand">{m.name}</h3>
        <p className="mt-1.5 text-sm font-medium text-brand">{m.title}</p>
        {level && (
          <p className="mt-2 inline-flex items-center gap-2 text-xs text-muted">
            <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-brand" />
            {level}
            {m.yearsExperience != null && ` · ${m.yearsExperience} yrs experience`}
          </p>
        )}
        <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-brand transition-colors group-hover:text-brand-deep">
          View profile <span aria-hidden className="transition-transform duration-300 ease-out-cubic group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </Reveal>
  );
}

export function TeamGrid({ members }: { members: TeamMemberCard[] }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((m, i) => (
        <TeamCard key={m._id} m={m} index={i} />
      ))}
    </ul>
  );
}

/** Team preview for the homepage and About page. Hidden until a profile is published. */
export function TeamSection({ members, limit = 6 }: { members: TeamMemberCard[]; limit?: number }) {
  if (!members.length) return null;
  return (
    <section className="border-t border-line bg-paper py-16 lg:py-24" aria-labelledby="team-title">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label">Team</p>
            <h2 id="team-title" className="serif-heading mt-3 text-[2rem] leading-tight md:text-[2.5rem]">
              The people behind the <em>work</em>
            </h2>
          </div>
          <Link href="/team" className="link-underline !text-sm">
            Meet the full team <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-10">
          <TeamGrid members={members.slice(0, limit)} />
        </div>
      </div>
    </section>
  );
}
