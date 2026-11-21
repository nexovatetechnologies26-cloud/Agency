import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";
import { site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

// Compact light footer: white surface, hairline top with a short brand bar,
// brand + contact on the left, three link columns, a slim newsletter column,
// and one bottom row for copyright, legal links and socials.

const socialIcons = { linkedin: Linkedin, instagram: Instagram, facebook: Facebook, x: Twitter } as const;

type Col = { title: string; links: { label: string; href: string }[] };

const iconLink =
  "flex h-9 w-9 items-center justify-center rounded-full border border-brand/25 text-muted transition-colors hover:border-brand hover:bg-brand hover:text-white";

export function Footer() {
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);
  const year = new Date().getFullYear();
  const whatsapp = site.contact.whatsapp ? `https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, "")}` : "";

  const columns: Col[] = [
    { title: "Services", links: publishedServices.slice(0, 5).map((s) => ({ label: s.title, href: `/services/${s.slug}` })) },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Team", href: "/team" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Case studies", href: "/case-studies" },
        { label: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Get started",
      links: [
        { label: "Start a project", href: "/get-a-quote" },
        { label: "Book a call", href: "/book-consultation" },
        { label: "Pricing", href: "/pricing" },
        { label: "Contact", href: "/contact" },
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
    <footer className="relative border-t border-line bg-surface">
      <span aria-hidden className="absolute left-0 top-0 h-[3px] w-24 bg-brand" />
      <div className="container pt-14 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          {/* brand */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{site.description}</p>
            {site.contact.email && (
              <a href={`mailto:${site.contact.email}`} className="mt-5 inline-block text-sm font-semibold text-ink transition-colors hover:text-brand">
                {site.contact.email}
              </a>
            )}
            <ul className="mt-5 flex flex-wrap gap-2">
              {site.contact.email && (
                <li>
                  <a href={`mailto:${site.contact.email}`} aria-label="Email" className={iconLink}>
                    <Mail size={15} strokeWidth={1.75} />
                  </a>
                </li>
              )}
              {whatsapp && (
                <li>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className={iconLink}>
                    <MessageCircle size={15} strokeWidth={1.75} />
                  </a>
                </li>
              )}
              {socials.map((key) => {
                const Icon = socialIcons[key];
                return (
                  <li key={key}>
                    <a href={site.social[key]} target="_blank" rel="noopener noreferrer" aria-label={key} className={iconLink}>
                      <Icon size={15} strokeWidth={1.75} />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* links */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:col-span-5">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">{c.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-muted transition-colors hover:text-ink">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* newsletter */}
          <div className="lg:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">Stay in the loop</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">Practical notes on building and growing online. No spam.</p>
            <div className="mt-4 [&_.field-label]:sr-only [&_label]:text-xs">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line py-6 text-[13px] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. All rights reserved.
            <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="ml-3 text-muted/60 transition-colors hover:text-brand">
              Rates by Exchange Rate API
            </a>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
