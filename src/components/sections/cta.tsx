import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/**
 * Closing call to action used on inner pages — same light brand card as the homepage CTA.
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
    <section className="py-16 lg:py-24" aria-labelledby="cta-title">
      <div className="container">
        <div className="card card-float relative overflow-hidden !rounded-[32px] px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          <span aria-hidden className="absolute left-0 top-0 h-[3px] w-28 bg-brand" />
          <div aria-hidden className="grid-lines absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]" />
          <div className="relative grid items-end gap-10 lg:grid-cols-12">
            <h2 id="cta-title" className="serif-heading text-[2.25rem] leading-[1.04] tracking-[-0.04em] md:text-[3.25rem] lg:col-span-7">
              {title} {accent && <em>{accent}</em>}
            </h2>
            <div className="lg:col-span-5">
              <p className="text-body text-muted">{text}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/get-a-quote" size="lg">
                  Start a project <ArrowRight size={17} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
                </ButtonLink>
                <ButtonLink href="/book-consultation" size="lg" variant="secondary">
                  Book a call
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
