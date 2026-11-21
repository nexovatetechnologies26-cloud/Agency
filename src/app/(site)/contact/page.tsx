import type { Metadata } from "next";
import { Clock, Globe2, Mail, MessageCircle } from "lucide-react";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { LeadForm } from "@/components/forms/lead-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Nexovate. We work with businesses worldwide.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <section className="section hero-wash">
      <div className="container grid gap-14 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Let's start a conversation"
            description="Send us a message and our team will get back to you. For project pricing, use the quote form."
          />
          <ul className="mt-10 space-y-5 text-sm">
            {site.contact.email && (
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand" aria-hidden />
                <a href={`mailto:${site.contact.email}`} className="font-medium hover:text-brand">{site.contact.email}</a>
              </li>
            )}
            {site.contact.whatsapp && (
              <li className="flex items-center gap-3">
                <MessageCircle size={18} className="text-brand" aria-hidden />
                <a
                  href={`https://wa.me/${site.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-brand"
                >
                  WhatsApp {site.contact.whatsapp}
                </a>
              </li>
            )}
            <li className="flex items-center gap-3 text-muted">
              <Globe2 size={18} className="text-brand" aria-hidden /> Working with clients worldwide
            </li>
            <li className="flex items-center gap-3 text-muted">
              <Clock size={18} className="text-brand" aria-hidden /> Calls scheduled around your time zone
            </li>
          </ul>
        </div>
        <LeadForm type="contact" />
      </div>
    </section>
  );
}
