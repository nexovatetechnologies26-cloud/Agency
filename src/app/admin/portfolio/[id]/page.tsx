import { notFound } from "next/navigation";
import { requireStaffPage } from "@/server/auth/session";
import { getProjectAdmin } from "@/server/queries/other";
import { PageHeader } from "@/components/layout/app-shell";
import { ProjectForm } from "@/components/admin/project-form";

export default async function EditProject({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage("content");
  const p = await getProjectAdmin((await params).id);
  if (!p) notFound();
  return (
    <>
      <PageHeader title={`Edit: ${p.title}`} />
      <ProjectForm
        v={{
          id: p._id,
          title: p.title,
          slug: p.slug,
          clientName: p.clientName ?? "",
          industry: p.industry ?? "",
          serviceSlug: p.serviceSlug ?? "",
          summary: p.summary ?? "",
          challenge: p.challenge ?? "",
          solution: p.solution ?? "",
          results: p.results ?? "",
          technologies: p.technologies.join(", "),
          images: p.images.join("\n"),
          liveUrl: p.liveUrl ?? "",
          isCaseStudy: Boolean(p.isCaseStudy),
          published: Boolean(p.published),
          sort: String(p.sort ?? 0),
        }}
      />
    </>
  );
}
