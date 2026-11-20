import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function Cta({
  title = "Have a project in mind?",
  text = "Tell us what you want to build. We'll review it and get back to you with next steps.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="relative overflow-hidden rounded-[28px] bg-ink px-8 py-14 text-center md:px-16 md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(117,69,217,0.45),transparent_70%)]"
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl text-white md:text-4xl">{title}</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">{text}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/get-a-quote" size="lg">
                Get a Custom Quote <ArrowRight size={18} />
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="outline-light">
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
