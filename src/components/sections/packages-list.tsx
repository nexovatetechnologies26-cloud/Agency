import Link from "next/link";
import { ArrowRight, Check, Clock3, RefreshCw, Sparkles } from "lucide-react";
import clsx from "clsx";
import { services } from "@/content/services";
import { ServiceIcon } from "@/components/ui/service-icon";

// All package data comes from Admin → Packages. Nothing here is hardcoded.

export type PackageCard = {
  _id: string;
  serviceSlug: string;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  billing?: string | null;
  deliverables: string[];
  revisions?: number | null;
  deliveryDays?: number | null;
  featured?: boolean | null;
};

import { priceParts } from "@/lib/currency";
import { PriceFigure } from "@/components/currency/price";

export { priceParts };

/**
 * One pricing card. Packages the admin marks as featured become the plum
 * "Most popular" card; the rest are white with a lavender header panel.
 */
export function PricingCard({ p }: { p: PackageCard }) {
  const featured = Boolean(p.featured);
  const monthly = p.billing === "monthly";
  const service = services.find((s) => s.slug === p.serviceSlug);

  return (
    <article
      data-card
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-[28px] transition duration-300 ease-out-cubic hover:-translate-y-1.5",
        featured
          ? "bg-plum text-white shadow-[0_30px_60px_-24px_rgba(23,23,29,0.6)] ring-2 ring-lilac/40"
          : "border border-brand/25 bg-surface shadow-[0_1px_2px_rgba(18,18,24,0.04)] hover:border-brand/50 hover:shadow-[0_28px_56px_-28px_rgba(117,69,217,0.4)]",
      )}
    >
      {/* header panel: service, badge, name, description, price */}
      <div className={clsx("relative px-7 pb-7 pt-7 md:px-8", featured ? "" : "bg-brand-soft/60")}>
        {featured && <div aria-hidden className="grid-lines absolute inset-0 opacity-[0.07] invert" />}
        {featured && (
          <span className="relative mb-5 inline-flex items-center gap-1.5 rounded-full bg-lilac px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-plum">
            <Sparkles size={12} aria-hidden /> Most popular
          </span>
        )}
        <div className="relative flex items-center gap-3">
          {service ? (
            <span className={clsx("inline-flex min-w-0 items-center gap-2.5 text-[11.5px] font-semibold uppercase leading-snug tracking-[0.12em]", featured ? "text-lilac" : "text-brand")}>
              <span className={clsx("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", featured ? "bg-lilac text-plum" : "bg-brand text-white")}>
                <ServiceIcon name={service.icon} className="h-4 w-4" />
              </span>
              {service.title}
            </span>
          ) : null}
        </div>

        <h3 className={clsx("relative mt-6 font-display text-[1.7rem] font-semibold leading-tight tracking-[-0.02em]", featured ? "text-white" : "text-ink")}>{p.name}</h3>
        {p.description && <p className={clsx("relative mt-2 text-[15px] leading-relaxed", featured ? "text-white/70" : "text-muted")}>{p.description}</p>}

        <div className="relative mt-6">
          <p className={clsx("text-[12px] font-semibold uppercase tracking-[0.14em]", featured ? "text-white/55" : "text-muted")}>{monthly ? "Per month" : "One-time"}</p>
          <PriceFigure minor={p.price} currency={p.currency} monthly={monthly} featured={featured} />
        </div>

        <Link
          href={`/checkout/${p._id}`}
          className={clsx(
            "relative mt-7 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-btn text-[15px] font-semibold transition-colors duration-200",
            featured ? "bg-lilac text-plum hover:bg-white" : "bg-brand text-white hover:bg-brand-deep",
          )}
        >
          Get started <ArrowRight size={16} aria-hidden className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* body: delivery, revisions, what's included */}
      <div className={clsx("flex flex-1 flex-col px-7 pb-8 pt-6 md:px-8", featured ? "border-t border-white/10" : "border-t border-brand/15")}>
        {(p.deliveryDays || p.revisions != null) && (
          <dl className="flex flex-wrap gap-2">
            {p.deliveryDays ? (
              <div className={clsx("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px]", featured ? "bg-white/10 text-white" : "bg-brand-soft text-ink")}>
                <Clock3 size={14} aria-hidden className={featured ? "text-lilac" : "text-brand"} />
                <dt className="sr-only">Delivery</dt>
                <dd className="font-semibold">{p.deliveryDays} days delivery</dd>
              </div>
            ) : null}
            {p.revisions != null ? (
              <div className={clsx("inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px]", featured ? "bg-white/10 text-white" : "bg-brand-soft text-ink")}>
                <RefreshCw size={14} aria-hidden className={featured ? "text-lilac" : "text-brand"} />
                <dt className="sr-only">Revisions</dt>
                <dd className="font-semibold">{p.revisions === 0 ? "No revisions" : `${p.revisions} revision${p.revisions === 1 ? "" : "s"}`}</dd>
              </div>
            ) : null}
          </dl>
        )}

        {p.deliverables.length > 0 && (
          <div className="mt-6 flex-1">
            <p className={clsx("text-[12px] font-semibold uppercase tracking-[0.14em]", featured ? "text-lilac" : "text-brand")}>What&apos;s included</p>
            <ul className="mt-4 space-y-3">
              {p.deliverables.map((d) => (
                <li key={d} className={clsx("flex items-start gap-3 text-[15px]", featured ? "text-white/85" : "text-ink/85")}>
                  <span className={clsx("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", featured ? "bg-lilac text-plum" : "bg-brand text-white")}>
                    <Check size={12} strokeWidth={3} aria-hidden />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
}

/** Packages grouped by service, each group introduced like a chapter. */
export function PackagesList({ packages }: { packages: PackageCard[] }) {
  const groups = services
    .map((s) => ({ service: s, items: packages.filter((p) => p.serviceSlug === s.slug) }))
    .filter((g) => g.items.length);

  return (
    <div className="space-y-24">
      {groups.map(({ service, items }) => (
        <section key={service.slug} aria-labelledby={`pkg-${service.slug}`}>
          <div className="flex flex-col justify-between gap-5 border-b border-line pb-8 md:flex-row md:items-end">
            <div className="flex items-center gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                <ServiceIcon name={service.icon} className="h-6 w-6" />
              </span>
              <div>
                <h2 id={`pkg-${service.slug}`} className="serif-heading text-[2.25rem] leading-tight">{service.title}</h2>
                <p className="mt-1 text-[15px] text-muted">{service.summary}</p>
              </div>
            </div>
            <Link href={`/services/${service.slug}`} className="link-underline shrink-0">
              About this service <span aria-hidden>→</span>
            </Link>
          </div>
          <ul className="mt-12 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => (
              <li key={p._id}>
                <PricingCard p={p} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
