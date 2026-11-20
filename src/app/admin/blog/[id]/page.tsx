import { notFound } from "next/navigation";
import { requireStaffPage } from "@/server/auth/session";
import { getPostAdmin } from "@/server/queries/other";
import { PageHeader } from "@/components/layout/app-shell";
import { PostForm } from "@/components/admin/post-form";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await requireStaffPage("content");
  const p = await getPostAdmin((await params).id);
  if (!p) notFound();
  return (
    <>
      <PageHeader title={`Edit: ${p.title}`} />
      <PostForm
        v={{
          id: p._id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? "",
          content: p.content,
          coverImage: p.coverImage ?? "",
          category: p.category ?? "",
          tags: p.tags.join(", "),
          seoTitle: p.seoTitle ?? "",
          seoDescription: p.seoDescription ?? "",
          status: p.status,
        }}
      />
    </>
  );
}
