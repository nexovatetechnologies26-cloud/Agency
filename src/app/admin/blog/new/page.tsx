import { requireStaffPage } from "@/server/auth/session";
import { PageHeader } from "@/components/layout/app-shell";
import { PostForm } from "@/components/admin/post-form";

export default async function NewPost() {
  await requireStaffPage("content");
  return (
    <>
      <PageHeader title="New post" />
      <PostForm />
    </>
  );
}
