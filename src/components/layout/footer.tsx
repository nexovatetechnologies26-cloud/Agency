import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";
import { site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const socialIcons = { linkedin: Linkedin, instagram: Instagram, facebook: Facebook, x: Twitter } as const;

type Col = { title: string; links: { label: string; href: string; external?: boolean }[] };

export function Footer() {
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);
  const year = new Date().getFullYear();
  const whatsapp = site.contact.whatsapp ? `https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, "")}` : "";

  const columns: Col[] = [
    { title: "Services", links: publishedServices.slice(0, 6).map((s) => ({ label: s.title, href: `/services/${s.slug}` })) },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Team", href: "/team" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Case studies", href: "/case-studies" },
        { label: "Pricing", href: "/pricing" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Get started",
      links: [
        { label: "Start a project", href: "/get-a-quote" },
        { label: "Book a consultation", href: "/book-consultation" },
        { label: "Contact us", href: "/contact" },
        { label: "FAQ", href: "/faq" },
        { label: "Client login", href: "/login" },
      ],
    },
  ];

  const legal = [
    { label: "Privacy", href: "/privacy-policy" },
    { label: "Terms", href: "/terms" },
    { label: "Refunds", href: "/refund-policy" },
    { label: "Cookies", href: "/cookie-policy" },
  ];

  return (
    <footer className="relative overflow-hidden bg-charcoal text-white">
      <div className="container relative pt-20 lg:pt-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Logo inverted />
            <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">{site.description}</p>

            {(site.contact.email || whatsapp) && (
              <ul className="mt-8 space-y-3">
                {site.contact.email && (
                  <li>
                    <a href={`mailto:${site.contact.email}`} className="group inline-flex items-center gap-3 text-[15px] font-medium text-white transition-colors hover:text-[#B79BFF]">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">
                        <Mail size={15} aria-hidden />
                      </span>
                      {site.contact.email}
                    </a>
                  </li>
                )}
                {whatsapp && (
                  <li>
                    <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-[15px] font-medium text-white transition-colors hover:text-[#B79BFF]">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15">
                        <MessageCircle size={15} aria-hidden />
                      </span>
                      WhatsApp
                    </a>
                  </li>
                )}
              </ul>
            )}

            <div className="mt-10 max-w-sm rounded-2xl bg-surface p-5 text-ink">
              <p className="font-display text-base font-semibold tracking-tight">Get practical notes on building and growing online.</p>
              <div className="mt-3">
                <NewsletterForm />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:col-span-7">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/40">{c.title}</p>
                <ul className="mt-6 space-y-3.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[15px] text-white/75 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-6 border-t border-white/10 py-8 text-sm text-white/50 md:flex-row md:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          {socials.length > 0 && (
            <ul className="flex gap-2">
              {socials.map((key) => {
                const Icon = socialIcons[key];
                return (
                  <li key={key}>
                    <a
                      href={site.social[key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={key}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:text-white"
                    >
                      <Icon size={16} strokeWidth={1.75} />
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
