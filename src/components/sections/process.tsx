import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  { title: "Discover", text: "We learn about your business, goals and requirements." },
  { title: "Plan", text: "You receive a clear proposal with scope, timeline and pricing." },
  { title: "Build", text: "We design and develop in milestones, sharing progress as we go." },
  { title: "Launch & Grow", text: "We launch, hand over and support your growth after go-live." },
];

export function Process() {
  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="How we work" title="A simple, proven process" align="center" />
        <ol className="relative mt-14 grid gap-5 md:grid-cols-4">
          {/* connecting line behind the step numbers (desktop) */}
          <span aria-hidden className="absolute left-[12.5%] right-[12.5%] top-[46px] hidden h-px bg-gradient-to-r from-brand/10 via-brand/40 to-brand/10 md:block" />
          {steps.map((s, i) => (
            <li key={s.title} className="card relative p-7 text-center md:text-left">
              <span className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white shadow-md shadow-brand/30 md:mx-0">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
