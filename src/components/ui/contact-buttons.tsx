import clsx from "clsx";

// Direct-contact buttons for team profiles. The email address and WhatsApp
// number come from the admin panel (Admin → Team Profiles) — nothing is hardcoded here.

/** Official WhatsApp glyph (brand mark). */
export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/** Envelope mark, drawn to match the WhatsApp glyph's weight. */
export function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2.25" />
      <path d="m3.5 6.5 7.42 5.56a1.8 1.8 0 0 0 2.16 0L20.5 6.5" />
    </svg>
  );
}

export function mailHref(email: string, siteName: string) {
  return `mailto:${email}?subject=${encodeURIComponent(`Project enquiry via ${siteName}`)}`;
}

/** wa.me link with a short, editable greeting pre-filled. */
export function whatsappHref(number: string, firstName: string, siteName: string) {
  const digits = number.replace(/[^0-9]/g, "");
  const text = `Hi ${firstName}, I found your profile on ${siteName} and would like to discuss a project.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

const btn =
  "group/contact inline-flex h-[52px] items-center gap-3 rounded-btn border border-line bg-surface pl-3 pr-5 text-[15px] font-medium text-ink transition-colors duration-200 ease-out-cubic hover:border-ink";

export function ContactButtons({
  email,
  whatsapp,
  firstName,
  siteName,
  className,
}: {
  email?: string | null;
  whatsapp?: string | null;
  firstName: string;
  siteName: string;
  className?: string;
}) {
  if (!email && !whatsapp) return null;
  return (
    <div className={clsx("flex flex-wrap gap-3", className)}>
      {email && (
        <a href={mailHref(email, siteName)} className={btn} aria-label={`Email ${firstName}`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-charcoal text-white transition-colors group-hover/contact:bg-brand">
            <MailIcon className="h-[17px] w-[17px]" />
          </span>
          Email
        </a>
      )}
      {whatsapp && (
        <a href={whatsappHref(whatsapp, firstName, siteName)} target="_blank" rel="noopener noreferrer" className={btn} aria-label={`Message ${firstName} on WhatsApp`}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white">
            <WhatsAppIcon className="h-[18px] w-[18px]" />
          </span>
          WhatsApp
        </a>
      )}
    </div>
  );
}
