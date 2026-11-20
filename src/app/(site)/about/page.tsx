import type { Metadata } from "next";
import { Compass, Eye, HeartHandshake } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { WhyUs } from "@/components/sections/why-us";
import { Cta } from "@/components/sections/cta";

export const metadata: Metadata = {
  title: "About",
  description: "Nexovate is a global-first digital and technology agency helping businesses build, automate, market and grow.",
  alternates: { canonical: "/about" },
};

const values = [
  { icon: Compass, title: "Our mission", text: "Help businesses everywhere turn ideas into digital products and systems that create real results." },
  { icon: Eye, title: "Our approach", text: "Understand the business first, then choose the right technology — never the other way around." },
  { icon: HeartHandshake, title: "Our promise", text: "Clear communication, honest timelines and work we are proud to put our name on." },
];

export default function AboutPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <SectionHeading
            as="h1"
            eyebrow="About Nexovate"
            title="Your global digital & technology partner"
            description="Nexovate is a full-service digital and technology agency. We help businesses design, build, automate and market their digital presence — from a first website to custom software and AI-powered workflows."
          />
          <ul className="mt-14 grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-8">
                <Icon className="text-brand" size={24} strokeWidth={1.75} aria-hidden />
                <h2 className="mt-5 text-lg">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <WhyUs />
      <Cta />
    </>
  );
}
