import { subscribeAction } from "@/server/actions/content";
import { ActionForm, Checkbox, Field, SubmitButton } from "@/components/forms/action-form";

export function NewsletterForm() {
  return (
    <ActionForm action={subscribeAction} resetOnSuccess className="space-y-3">
      <Field label="Newsletter" id="newsletter-email" name="email" type="email" placeholder="you@company.com" autoComplete="email" />
      <Checkbox name="consent" id="newsletter-consent">I agree to receive occasional emails. Unsubscribe anytime.</Checkbox>
      <SubmitButton variant="secondary">Subscribe</SubmitButton>
    </ActionForm>
  );
}
