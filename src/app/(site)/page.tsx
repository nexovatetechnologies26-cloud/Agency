import {
  HomeClients,
  HomeCta,
  HomeFaq,
  HomeHero,
  HomeInsights,
  HomeMarquee,
  HomeModels,
  HomeNumbers,
  HomePricing,
  HomeProcess,
  HomeServices,
  HomeTestimonials,
  HomeWhy,
  HomeWork,
} from "@/components/home/editorial";
import { TeamSection } from "@/components/sections/team";
import { HomeLeader, pickLeader } from "@/components/home/leader";
import {
  listProjects,
  listPublishedClientLogos,
  listPublishedPosts,
  listPublishedStats,
  listTeamMembers,
  listTestimonials,
} from "@/server/queries/other";
import { listActivePackages } from "@/server/queries/commerce";
import { safe } from "@/server/lib/safe";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

// Homepage. Every data-backed section (logos, numbers, work, testimonials, team,
// insights) is managed in the admin panel and stays hidden until it has real content.
export default async function HomePage() {
  const [projects, team, stats, logos, testimonials, posts, packages] = await Promise.all([
    safe(() => listProjects(), [], "home-projects"),
    safe(listTeamMembers, [], "home-team"),
    safe(listPublishedStats, [], "home-stats"),
    safe(listPublishedClientLogos, [], "home-logos"),
    safe(listTestimonials, [], "home-testimonials"),
    safe(() => listPublishedPosts(), [], "home-posts"),
    safe(listActivePackages, [], "home-packages"),
  ]);

  return (
    <div>
      <HomeHero />
      <HomeMarquee />
      <HomeClients logos={logos} />
      <HomeNumbers stats={stats} />
      <HomeLeader leader={pickLeader(team)} />
      <HomeServices />
      <HomeWhy />
      <HomeWork projects={projects} />
      <HomeProcess />
      <HomeModels />
      <HomePricing packages={packages} />
      <HomeTestimonials items={testimonials} />
      <TeamSection members={team} />
      <HomeInsights posts={posts} />
      <HomeFaq />
      <HomeCta />
    </div>
  );
}
