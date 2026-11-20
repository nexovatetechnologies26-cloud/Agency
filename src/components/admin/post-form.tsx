import { deletePostAction, savePostAction } from "@/server/actions/content";
import { ActionForm, Field, Select, SubmitButton, TextArea } from "@/components/forms/action-form";
import { PendingButton } from "@/components/forms/pending-button";

export type PostFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  tags?: string;
  seoTitle?: string;
  seoDescription?: string;
  status?: string;
};

export function PostForm({ v = {} }: { v?: PostFormValues }) {
  return (
    <div className="max-w-4xl space-y-4">
      <ActionForm action={savePostAction} className="card p-7">
        <input type="hidden" name="id" value={v.id ?? ""} />
        <Field label="Title" name="title" defaultValue={v.title} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="URL slug" name="slug" optional defaultValue={v.slug} hint="Leave empty to generate from the title" />
          <Field label="Category" name="category" optional defaultValue={v.category} />
        </div>
        <TextArea label="Excerpt" name="excerpt" optional rows={2} defaultValue={v.excerpt} />
        <TextArea
          label="Content"
          name="content"
          rows={18}
          defaultValue={v.content}
          hint='Format: "## Heading", "### Subheading", "- list item", blank line between paragraphs.'
        />
        <Field label="Cover image URL" name="coverImage" optional defaultValue={v.coverImage} placeholder="https://…" />
        <Field label="Tags" name="tags" optional defaultValue={v.tags} hint="Comma separated" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="SEO title" name="seoTitle" optional maxLength={70} defaultValue={v.seoTitle} />
          <Field label="SEO description" name="seoDescription" optional maxLength={170} defaultValue={v.seoDescription} />
        </div>
        <Select label="Status" name="status" defaultValue={v.status ?? "draft"} options={[{ value: "draft", label: "Draft" }, { value: "published", label: "Published" }]} />
        <SubmitButton>Save post</SubmitButton>
      </ActionForm>
      {v.id && (
        <form action={deletePostAction}>
          <input type="hidden" name="id" value={v.id} />
          <PendingButton tone="danger" confirm="Delete this post permanently?">Delete post</PendingButton>
        </form>
      )}
    </div>
  );
}
