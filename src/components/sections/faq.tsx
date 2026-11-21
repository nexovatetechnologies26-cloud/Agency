import { ChevronDown } from "lucide-react";
import { faqs } from "@/content/faqs";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";

export function Faq({ limit, heading = true }: { limit?: number; heading?: boolean }) {
  const list = limit ? faqs.slice(0, limit) : faqs;
  return (
    <section className="section bg-paper">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        {heading ? (
          <SectionHeading eyebrow="FAQ" title="Questions, answered" description="Can't find what you're looking for? Get in touch." />
        ) : (
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white">
              <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand/50 blur-3xl" />
              <p className="relative font-display text-2xl font-semibold tracking-tight">Still have a question?</p>
              <p className="relative mt-3 text-[15px] leading-relaxed text-white/60">Talk to the team directly. We&apos;ll answer honestly, even if we&apos;re not the right fit.</p>
              <div className="relative mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/contact" variant="light">Contact us</ButtonLink>
                <ButtonLink href="/book-consultation" variant="outline-light">Book a call</ButtonLink>
              </div>
            </div>
          </aside>
        )}
        <div className="space-y-3">
          {list.map((f) => (
            <details key={f.q} className="card group p-6 transition-colors open:border-brand/30 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <ChevronDown size={18} className="shrink-0 text-muted transition group-open:rotate-180 group-open:text-brand" aria-hidden />
              </summary>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
