import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

/**
 * Closing call to action used on inner pages. Same editorial treatment as the
 * homepage CTA: light background, serif heading, split layout, no gradients.
 * Pass a title ending in a word to italicise via `accent` (optional).
 */
export function Cta({
  title = "Have a project in",
  accent = "mind?",
  text = "Tell us what you're building. We'll reply with a few questions, then a written proposal with scope, timeline and price.",
}: {
  title?: string;
  accent?: string;
  text?: string;
}) {
  return (
    <section className="border-t border-line bg-paper py-24 lg:py-35" aria-labelledby="cta-title">
      <div className="container grid gap-12 lg:grid-cols-12">
        <h2 id="cta-title" className="serif-heading text-section lg:col-span-7">
          {title} {accent && <em>{accent}</em>}
        </h2>
        <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <p className="max-w-measure text-body text-muted">{text}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <ButtonLink href="/get-a-quote" size="lg">
              Start a project
            </ButtonLink>
            <Link href="/book-consultation" className="link-underline">
              Book a call <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
