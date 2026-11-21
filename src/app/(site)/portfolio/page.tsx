import type { Metadata } from "next";
import { listProjects } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";
import { PageHero } from "@/components/ui/page-hero";
import { ProjectCard } from "@/components/sections/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Cta } from "@/components/sections/cta";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work by Nexovate.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const projects = await safe(() => listProjects(), [], "portfolio");
  return (
    <>
      <PageHero eyebrow="Portfolio" title={<>Selected <em>work.</em></>} description="A look at projects we've designed, built and grown." />
      <section className="bg-paper py-16 lg:py-24">
        <div className="container">
          <div>
            {projects.length ? (
              <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => (
                  <li key={p.slug}>
                    <ProjectCard p={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="Our portfolio is coming soon" text="We're preparing project write-ups. Ask us for relevant examples for your industry." action={{ label: "Contact us", href: "/contact" }} />
            )}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
