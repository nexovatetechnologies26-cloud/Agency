import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Top band for inner pages: violet wash, faint grid, breadcrumb, eyebrow,
 * large display title and a short intro. Pass extra content (stats, actions) as children.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
}) {
  const trail = crumbs ?? [{ label: eyebrow }];
  return (
    <section className="hero-wash relative overflow-hidden border-b border-line">
      <div aria-hidden className="grid-lines-light absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
      <div className="container relative pb-16 pt-10 lg:pb-24 lg:pt-14">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted">
          <Link href="/" className="transition-colors hover:text-brand">
            Home
          </Link>
          {trail.map((c) => (
            <span key={c.label} className="inline-flex items-center gap-1.5">
              <ChevronRight size={13} aria-hidden />
              {c.href ? (
                <Link href={c.href} className="transition-colors hover:text-brand">
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        <div className="mt-12 max-w-4xl lg:mt-16">
          <p className="label">{eyebrow}</p>
          <h1 className="serif-heading mt-5 text-[2.6rem] leading-[1.02] md:text-[4rem] lg:text-[4.5rem]">{title}</h1>
          {description && <p className="mt-6 max-w-2xl text-body-lg text-muted md:text-[1.2rem] md:leading-relaxed">{description}</p>}
        </div>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}
