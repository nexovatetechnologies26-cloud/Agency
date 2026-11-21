import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/**
 * Closing call to action used on inner pages — same dark panel as the homepage CTA.
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
    <section className="bg-paper py-16 lg:py-24" aria-labelledby="cta-title">
      <div className="container">
        <div className="relative overflow-hidden rounded-[32px] bg-charcoal px-6 py-14 text-white sm:px-12 lg:px-16 lg:py-20">
          <div aria-hidden className="grid-lines absolute inset-0 [mask-image:radial-gradient(ellipse_at_right,black,transparent_70%)]" />
          <div className="relative grid items-end gap-10 lg:grid-cols-12">
            <h2 id="cta-title" className="font-display text-[2.25rem] font-semibold leading-[1.04] tracking-[-0.04em] text-white md:text-[3.25rem] lg:col-span-7">
              {title} {accent && <em className="text-[#B79BFF]">{accent}</em>}
            </h2>
            <div className="lg:col-span-5">
              <p className="text-body text-white/65">{text}</p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <ButtonLink href="/get-a-quote" size="lg" variant="light">
                  Start a project <ArrowRight size={17} aria-hidden className="transition-transform group-hover/btn:translate-x-0.5" />
                </ButtonLink>
                <ButtonLink href="/book-consultation" size="lg" variant="outline-light">
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
