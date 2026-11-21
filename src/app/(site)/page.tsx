import { HomeCta, HomeHero, HomeNumbers, HomeProcess, HomeServices, HomeStatement, HomeWork } from "@/components/home/editorial";
import { TeamSection } from "@/components/sections/team";
import { listProjects, listPublishedStats, listTeamMembers } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

// Homepage: hero, services, selected work (real projects only), process,
// team (when published), one dark statement, call to action.
export default async function HomePage() {
  const [projects, team, stats] = await Promise.all([
    safe(() => listProjects(), [], "home-projects"),
    safe(listTeamMembers, [], "home-team"),
    safe(listPublishedStats, [], "home-stats"),
  ]);

  return (
    <div className="bg-paper">
      <HomeHero />
      <HomeNumbers stats={stats} />
      <HomeServices />
      <HomeWork projects={projects} />
      <HomeProcess />
      <TeamSection members={team} limit={3} />
      <HomeStatement />
      <HomeCta />
    </div>
  );
}
