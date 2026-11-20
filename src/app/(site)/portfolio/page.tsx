import type { Metadata } from "next";
import { listProjects } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/sections/project-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work by Nexovate.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const projects = await safe(() => listProjects(), [], "portfolio");
  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHeading as="h1" eyebrow="Portfolio" title="Selected work" description="A look at projects we've designed, built and grown." />
          <div className="mt-14">
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
