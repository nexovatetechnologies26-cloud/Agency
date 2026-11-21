import Link from "next/link";
import { Check, Clock3, RefreshCw } from "lucide-react";
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

/** One pricing card. Only packages the admin marks as featured are highlighted. */
export function PricingCard({ p }: { p: PackageCard }) {
  const featured = Boolean(p.featured);
  const monthly = p.billing === "monthly";

  return (
    <article
      className={clsx(
        "group relative flex h-full flex-col overflow-hidden rounded-tile bg-white transition duration-300 ease-out-cubic hover:-translate-y-1",
        featured ? "border-2 border-brand lg:-my-3" : "border border-line border-t-[3px] border-t-brand hover:border-brand/40 hover:border-t-brand",
      )}
    >
      {featured && (
        <p className="flex items-center justify-center gap-2 bg-brand py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
          <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-white" />
          Most popular
        </p>
      )}

      <div className={clsx("flex flex-1 flex-col px-7 pb-7 md:px-8", featured ? "pt-7" : "pt-8")}>
        {/* name + who it's for */}
        <h3 className="font-serif text-[2rem] font-normal leading-tight text-ink">{p.name}</h3>
        {p.description && <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.description}</p>}

        {/* price */}
        <div className="mt-7 border-y border-line py-6">
          <p className="label">{monthly ? "Per month" : "One-time"}</p>
          <PriceFigure minor={p.price} currency={p.currency} monthly={monthly} featured={featured} />
        </div>

        {/* delivery + revisions */}
        {(p.deliveryDays || p.revisions != null) && (
          <dl className="mt-6 grid grid-cols-2 gap-3">
            {p.deliveryDays ? (
              <div className="rounded-tile bg-paper px-4 py-3">
                <dt className="flex items-center gap-1.5 text-xs text-muted">
                  <Clock3 size={13} aria-hidden /> Delivery
                </dt>
                <dd className="mt-1 text-[15px] font-semibold text-ink">{p.deliveryDays} days</dd>
              </div>
            ) : null}
            {p.revisions != null ? (
              <div className="rounded-tile bg-paper px-4 py-3">
                <dt className="flex items-center gap-1.5 text-xs text-muted">
                  <RefreshCw size={13} aria-hidden /> Revisions
                </dt>
                <dd className="mt-1 text-[15px] font-semibold text-ink">{p.revisions === 0 ? "None" : p.revisions}</dd>
              </div>
            ) : null}
          </dl>
        )}

        {/* what's included */}
        {p.deliverables.length > 0 && (
          <div className="mt-7 flex-1">
            <p className="label">What&apos;s included</p>
            <ul className="mt-4 space-y-3">
              {p.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-3 text-[15px] text-ink/85">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Check size={12} strokeWidth={3} aria-hidden />
                  </span>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* action */}
        <Link
          href={`/checkout/${p._id}`}
          className={clsx(
            "mt-8 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-btn text-[15px] font-medium transition-colors duration-200",
            featured ? "bg-brand text-white hover:bg-brand-deep" : "bg-brand-soft text-brand hover:bg-brand-tint hover:text-brand-deep",
          )}
        >
          Get started <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>
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
