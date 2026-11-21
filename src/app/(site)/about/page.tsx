import type { Metadata } from "next";
import { Compass, Eye, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { WhyUs } from "@/components/sections/why-us";
import { Cta } from "@/components/sections/cta";
import { TeamSection } from "@/components/sections/team";
import { listTeamMembers } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";

// Team profiles come from the admin panel; refreshed every 5 minutes and on every edit.
export const revalidate = 300;

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

export default async function AboutPage() {
  const team = await safe(listTeamMembers, [], "about-team");
  return (
    <>
      <PageHero
        eyebrow="About Nexovate"
        title={<>Your global digital &amp; technology <em>partner.</em></>}
        description="Nexovate is a full-service digital and technology agency. We help businesses design, build, automate and market their digital presence — from a first website to custom software and AI-powered workflows."
      />
      <section className="bg-paper py-16 lg:py-24">
        <div className="container">
          <ul className="grid gap-5 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="card p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                  <Icon size={22} strokeWidth={1.75} aria-hidden />
                </span>
                <h2 className="mt-6 text-xl">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <TeamSection members={team} />
      <WhyUs />
      <Cta />
    </>
  );
}
