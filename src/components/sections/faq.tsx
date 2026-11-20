import { ChevronDown } from "lucide-react";
import { faqs } from "@/content/faqs";
import { SectionHeading } from "@/components/ui/section-heading";

export function Faq({ limit, heading = true }: { limit?: number; heading?: boolean }) {
  const list = limit ? faqs.slice(0, limit) : faqs;
  return (
    <section className="section bg-paper">
      <div className="container grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        {heading ? (
          <SectionHeading eyebrow="FAQ" title="Questions, answered" description="Can't find what you're looking for? Get in touch." />
        ) : (
          <div />
        )}
        <div className="space-y-3">
          {list.map((f) => (
            <details key={f.q} className="card group p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {f.q}
                <ChevronDown size={18} className="shrink-0 text-muted transition group-open:rotate-180" aria-hidden />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
