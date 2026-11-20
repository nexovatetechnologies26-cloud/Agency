import { Check } from "lucide-react";
import clsx from "clsx";
import { formatMoney } from "@/lib/money";
import { services } from "@/content/services";
import { ButtonLink } from "@/components/ui/button";

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

export function PackagesList({ packages }: { packages: PackageCard[] }) {
  const groups = services
    .map((s) => ({ service: s, items: packages.filter((p) => p.serviceSlug === s.slug) }))
    .filter((g) => g.items.length);

  return (
    <div className="space-y-16">
      {groups.map(({ service, items }) => (
        <section key={service.slug} aria-labelledby={`pkg-${service.slug}`}>
          <h2 id={`pkg-${service.slug}`} className="text-2xl">{service.title}</h2>
          <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <li key={p._id} className={clsx("card flex flex-col p-7", p.featured && "border-brand ring-1 ring-brand")}>
                {p.featured && <span className="mb-3 self-start rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">Most popular</span>}
                <h3 className="text-lg">{p.name}</h3>
                {p.description && <p className="mt-2 text-sm text-muted">{p.description}</p>}
                <p className="mt-5 text-3xl font-semibold tracking-tight">
                  {formatMoney(p.price, p.currency)}
                  {p.billing === "monthly" && <span className="text-sm font-medium text-muted"> / month</span>}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5 text-sm">
                  {p.deliverables.map((d) => (
                    <li key={d} className="flex gap-2.5">
                      <Check size={16} className="mt-0.5 shrink-0 text-brand" aria-hidden /> {d}
                    </li>
                  ))}
                  {p.deliveryDays ? <li className="text-muted">Estimated delivery: {p.deliveryDays} days</li> : null}
                  {p.revisions != null ? <li className="text-muted">Revisions: {p.revisions}</li> : null}
                </ul>
                <ButtonLink href={`/checkout/${p._id}`} className="mt-7" variant={p.featured ? "primary" : "secondary"}>
                  Select package
                </ButtonLink>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
