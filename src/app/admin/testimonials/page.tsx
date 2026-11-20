import { requireStaffPage } from "@/server/auth/session";
import { connectDB } from "@/server/db/mongodb";
import { Testimonial } from "@/server/models/content.model";
import { plain } from "@/server/lib/plain";
import { createTestimonialAction, toggleTestimonialAction } from "@/server/actions/content";
import { PageHeader } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { PendingButton } from "@/components/forms/pending-button";
import { ActionForm, Checkbox, Field, SubmitButton, TextArea } from "@/components/forms/action-form";

export default async function TestimonialsAdmin() {
  await requireStaffPage("content");
  await connectDB();
  const rows = plain(await Testimonial.find().sort({ createdAt: -1 }).lean());

  return (
    <>
      <PageHeader title="Testimonials" description="Only real quotes from real customers, used with their permission." />
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div>
          {rows.length ? (
            <ul className="space-y-3">
              {rows.map((t) => (
                <li key={t._id} className="card p-5">
                  <p className="text-sm">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-2 text-xs text-muted">{t.name}{t.role ? `, ${t.role}` : ""}{t.company ? ` · ${t.company}` : ""}</p>
                  <div className="mt-3 flex items-center gap-2">
                    {t.published ? <Badge tone="green">Published</Badge> : <Badge>Hidden</Badge>}
                    <form action={toggleTestimonialAction}><input type="hidden" name="id" value={t._id} /><PendingButton>{t.published ? "Hide" : "Publish"}</PendingButton></form>
                    <form action={toggleTestimonialAction}><input type="hidden" name="id" value={t._id} /><input type="hidden" name="delete" value="1" /><PendingButton tone="danger" confirm="Delete this testimonial?">Delete</PendingButton></form>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No testimonials yet" text="Ask happy clients for a short quote after a successful project." />
          )}
        </div>
        <ActionForm action={createTestimonialAction} resetOnSuccess className="card h-fit p-7">
          <h2 className="text-lg">Add testimonial</h2>
          <Field label="Name" name="name" />
          <Field label="Role" name="role" optional />
          <Field label="Company" name="company" optional />
          <TextArea label="Quote" name="quote" rows={4} />
          <Checkbox name="verified">This is a real customer and they agreed to publication.</Checkbox>
          <SubmitButton>Save</SubmitButton>
        </ActionForm>
      </div>
    </>
  );
}
