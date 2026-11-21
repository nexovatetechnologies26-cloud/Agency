import { HomeCta, HomeHero, HomeProcess, HomeServices, HomeStatement, HomeWork } from "@/components/home/editorial";
import { listProjects } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

// Homepage: navbar, hero, services, selected work (real projects only),
// process, one dark statement, final call to action, footer.
export default async function HomePage() {
  const projects = await safe(() => listProjects(), [], "home-projects");

  return (
    <div className="bg-paper">
      <HomeHero />
      <HomeServices />
      <HomeWork projects={projects} />
      <HomeProcess />
      <HomeStatement />
      <HomeCta />
    </div>
  );
}
