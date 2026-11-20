import { Globe2, Layers, ShieldCheck, Workflow } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const points = [
  {
    icon: Globe2,
    title: "Global-first collaboration",
    text: "We work with clients across time zones, with clear communication over email, chat and video calls.",
  },
  {
    icon: Layers,
    title: "One partner, end to end",
    text: "Strategy, design, development and marketing under one roof — no juggling multiple vendors.",
  },
  {
    icon: Workflow,
    title: "Transparent process",
    text: "Agreed scope, defined milestones and regular updates, so you always know where your project stands.",
  },
  {
    icon: ShieldCheck,
    title: "Built to last",
    text: "Secure, maintainable and scalable engineering that keeps working as your business grows.",
  },
];

export function WhyUs() {
  return (
    <section className="section bg-paper">
      <div className="container grid gap-14 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeading
          eyebrow="Why Nexovate"
          title="A dependable partner for your digital growth"
          description="We combine technology and marketing so the things we build actually bring results for your business."
        />
        <ul className="grid gap-5 sm:grid-cols-2">
          {points.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card p-7">
              <Icon className="text-brand" size={22} strokeWidth={1.75} aria-hidden />
              <h3 className="mt-5 text-base">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
