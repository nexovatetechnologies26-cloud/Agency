import Link from "next/link";
import { publishedServices } from "@/content/services";
import { ServiceIcon } from "@/components/ui/service-icon";
import { PriceInline } from "@/components/currency/price";

/** Lowest active package price per service — real admin data only. */
export type FromPrice = { price: number; currency: string; billing?: string | null };

export function ServicesGrid({ limit, fromPrices = {} }: { limit?: number; fromPrices?: Record<string, FromPrice> }) {
  const list = limit ? publishedServices.slice(0, limit) : publishedServices;
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s) => {
        const from = fromPrices[s.slug];
        return (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              className="group flex h-full flex-col rounded-tile border border-line border-t-[3px] border-t-brand bg-white transition duration-300 ease-out-cubic hover:-translate-y-1 hover:border-brand/40 hover:border-t-brand"
            >
              <div className="flex flex-1 flex-col p-7 md:p-8">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                  <ServiceIcon name={s.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-7 font-serif text-[1.85rem] font-normal leading-tight text-ink transition-colors group-hover:text-brand">{s.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-muted">{s.summary}</p>

                <div className="mt-8 flex items-end justify-between gap-4 border-t border-line pt-6">
                  <div className="leading-none">
                    <p className="label">{from ? "Starting from" : "Pricing"}</p>
                    {from ? (
                      <p className="mt-2">
                        <PriceInline minor={from.price} currency={from.currency} monthly={from.billing === "monthly"} />
                      </p>
                    ) : (
                      <p className="mt-2 font-serif text-[1.5rem] text-ink">Custom quote</p>
                    )}
                  </div>
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white"
                  >
                    →
                  </span>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
