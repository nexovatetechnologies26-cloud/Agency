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
  title: "Case Studies",
  description: "How Nexovate approaches real business problems — challenge, approach and solution.",
  alternates: { canonical: "/case-studies" },
};

export default async function CaseStudiesPage() {
  const projects = await safe(() => listProjects({ caseStudiesOnly: true }), [], "case-studies");
  return (
    <>
      <PageHero eyebrow="Case studies" title={<>The problem, our approach, <em>the solution.</em></>} description="Deep dives into real client work, published only with our clients' permission." />
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
              <EmptyState title="Case studies are on the way" text="We publish case studies only with client permission. Contact us to discuss relevant work." action={{ label: "Contact us", href: "/contact" }} />
            )}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}
