import {
  HomeClients,
  HomeCta,
  HomeFaq,
  HomeHero,
  HomeInsights,
  HomeNumbers,
  HomeProcess,
  HomeServices,
  HomeStatement,
  HomeTestimonials,
  HomeWork,
} from "@/components/home/editorial";
import { TeamSection } from "@/components/sections/team";
import {
  listProjects,
  listPublishedClientLogos,
  listPublishedPosts,
  listPublishedStats,
  listTeamMembers,
  listTestimonials,
} from "@/server/queries/other";
import { safe } from "@/server/lib/safe";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

// Homepage. Every data-backed section (logos, numbers, work, testimonials, team,
// insights) is managed in the admin panel and stays hidden until it has real content.
export default async function HomePage() {
  const [projects, team, stats, logos, testimonials, posts] = await Promise.all([
    safe(() => listProjects(), [], "home-projects"),
    safe(listTeamMembers, [], "home-team"),
    safe(listPublishedStats, [], "home-stats"),
    safe(listPublishedClientLogos, [], "home-logos"),
    safe(listTestimonials, [], "home-testimonials"),
    safe(() => listPublishedPosts(), [], "home-posts"),
  ]);

  return (
    <div className="bg-paper">
      <HomeHero />
      <HomeClients logos={logos} />
      <HomeNumbers stats={stats} />
      <HomeServices />
      <HomeWork projects={projects} />
      <HomeProcess />
      <HomeTestimonials items={testimonials} />
      <TeamSection members={team} limit={3} />
      <HomeInsights posts={posts} />
      <HomeFaq />
      <HomeStatement />
      <HomeCta />
    </div>
  );
}
