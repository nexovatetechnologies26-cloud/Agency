import Link from "next/link";
import { ArrowRight, Bot, CalendarClock, Code2, Megaphone, TrendingUp } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

const pillars = [
  { icon: Code2, title: "Build", text: "Websites, apps and custom software" },
  { icon: Bot, title: "Automate", text: "AI and workflow automation" },
  { icon: Megaphone, title: "Market", text: "SEO, ads and social media" },
  { icon: TrendingUp, title: "Grow", text: "Conversion and long-term growth" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* background: soft brand glow + dotted grid that fades out */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-dots absolute inset-0 [mask-image:radial-gradient(70%_60%_at_70%_30%,#000_20%,transparent_75%)]" />
        <div className="absolute -right-32 -top-40 h-[520px] w-[520px] rounded-full bg-brand/15 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[360px] w-[360px] rounded-full bg-brand-soft blur-3xl" />
      </div>

      <div className="container grid items-center gap-14 py-20 md:py-28 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-xs font-medium text-muted shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand/50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            Your Global Digital &amp; Technology Partner
          </p>
          <h1 className="mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
            Build digital experiences that <span className="text-gradient">move your business</span> forward.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            From custom software and web development to AI automation and digital growth, Nexovate helps businesses
            turn ideas into powerful digital solutions.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/get-a-quote" size="lg" className="shadow-lg shadow-brand/25">
              Start Your Project <ArrowRight size={18} />
            </ButtonLink>
            <ButtonLink href="/services" variant="secondary" size="lg">
              Explore Our Services
            </ButtonLink>
          </div>
          <Link href="/book-consultation" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-brand">
            <CalendarClock size={16} className="text-brand" aria-hidden /> Prefer to talk first? Book a free consultation
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-4">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className={`card group p-6 transition duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg ${i % 2 === 1 ? "sm:translate-y-6 sm:hover:translate-y-5" : ""}`}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand transition group-hover:bg-brand group-hover:text-white">
                <Icon size={20} strokeWidth={1.75} aria-hidden />
              </span>
              <p className="mt-5 text-lg font-semibold">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
