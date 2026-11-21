import { HomeCta, HomeHero, HomeProcess, HomeServices, HomeStatement, HomeWork } from "@/components/home/editorial";
import { TeamSection } from "@/components/sections/team";
import { listProjects, listTeamMembers } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

// Homepage: navbar, hero, services, selected work (real projects only),
// process, one dark statement, final call to action, footer.
export default async function HomePage() {
  const [projects, team] = await Promise.all([
    safe(() => listProjects(), [], "home-projects"),
    safe(listTeamMembers, [], "home-team"),
  ]);

  return (
    <div className="bg-paper">
      <HomeHero />
      <HomeServices />
      <HomeWork projects={projects} />
      <HomeProcess />
      <TeamSection members={team} />
      <HomeStatement />
      <HomeCta />
    </div>
  );
}
