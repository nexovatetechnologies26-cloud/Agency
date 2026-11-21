import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const socialIcons = { linkedin: Linkedin, instagram: Instagram, facebook: Facebook, x: Twitter } as const;

type Col = { title: string; links: { label: string; href: string; external?: boolean }[] };

export function Footer() {
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);
  const year = new Date().getFullYear();

  const columns: Col[] = [
    { title: "Services", links: publishedServices.slice(0, 6).map((s) => ({ label: s.title, href: `/services/${s.slug}` })) },
    {
      title: "Studio",
      links: [
        { label: "About", href: "/about" },
        { label: "Work", href: "/portfolio" },
        { label: "Case studies", href: "/case-studies" },
        { label: "Pricing", href: "/pricing" },
        { label: "Journal", href: "/blog" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Start a project", href: "/get-a-quote" },
        { label: "Book a consultation", href: "/book-consultation" },
        { label: "Contact form", href: "/contact" },
        ...(site.contact.email ? [{ label: site.contact.email, href: `mailto:${site.contact.email}`, external: true }] : []),
        ...(site.contact.whatsapp
          ? [{ label: "WhatsApp", href: `https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, "")}`, external: true }]
          : []),
        { label: "Client login", href: "/login" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy policy", href: "/privacy-policy" },
        { label: "Terms", href: "/terms" },
        { label: "Refund policy", href: "/refund-policy" },
        { label: "Cookie policy", href: "/cookie-policy" },
      ],
    },
  ];

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container pb-12 pt-20 lg:pt-28">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-5 max-w-xs text-body text-muted">{site.tagline}</p>
            <div className="mt-10 max-w-xs">
              <NewsletterForm />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-4 lg:col-span-8">
            {columns.map((c) => (
              <div key={c.title}>
                <p className="label">{c.title}</p>
                <ul className="mt-6 space-y-3">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="break-words text-[15px] text-ink/80 transition-colors hover:text-brand">
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.href} className="text-[15px] text-ink/80 transition-colors hover:text-brand">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col justify-between gap-6 border-t border-line pt-8 text-sm text-muted sm:flex-row sm:items-center">
          <p>
            © {year} {site.name}. All rights reserved.
          </p>
          {socials.length > 0 && (
            <ul className="flex gap-5">
              {socials.map((key) => {
                const Icon = socialIcons[key];
                return (
                  <li key={key}>
                    <a href={site.social[key]} target="_blank" rel="noopener noreferrer" aria-label={key} className="text-muted transition-colors hover:text-brand">
                      <Icon size={18} strokeWidth={1.5} />
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
