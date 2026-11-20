import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Twitter } from "lucide-react";
import { site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { Logo } from "@/components/layout/logo";
import { NewsletterForm } from "@/components/forms/newsletter-form";

const socialIcons = { linkedin: Linkedin, instagram: Instagram, facebook: Facebook, x: Twitter } as const;

export function Footer() {
  const socials = (Object.keys(site.social) as (keyof typeof site.social)[]).filter((k) => site.social[k]);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-paper">
      <div className="container grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{site.positioning}. {site.tagline}.</p>
          <div className="mt-6 max-w-xs">
            <NewsletterForm />
          </div>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socials.map((key) => {
                const Icon = socialIcons[key];
                return (
                  <a
                    key={key}
                    href={site.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink/70 transition hover:border-brand hover:text-brand"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold">Services</h3>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2 md:grid-cols-1">
            {publishedServices.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="text-muted transition hover:text-brand">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["About", "/about"],
              ["Pricing", "/pricing"],
              ["Portfolio", "/portfolio"],
              ["Case Studies", "/case-studies"],
              ["Blog", "/blog"],
              ["FAQ", "/faq"],
              ["Book a Consultation", "/book-consultation"],
            ].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="text-muted transition hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {site.contact.email && (
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2 text-muted hover:text-brand">
                  <Mail size={14} /> Email us
                </a>
              </li>
            )}
            {site.contact.whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted hover:text-brand"
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </li>
            )}
            <li>
              <Link href="/contact" className="text-muted hover:text-brand">
                Contact form
              </Link>
            </li>
            <li>
              <Link href="/get-a-quote" className="text-muted hover:text-brand">
                Get a Quote
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container flex flex-col items-start justify-between gap-3 py-6 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {year} {site.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-brand">Privacy</Link>
            <Link href="/terms" className="hover:text-brand">Terms</Link>
            <Link href="/refund-policy" className="hover:text-brand">Refunds</Link>
            <Link href="/cookie-policy" className="hover:text-brand">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
