import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publishedServices } from "@/content/services";
import { ServiceIcon } from "@/components/ui/service-icon";

export function ServicesGrid({ limit }: { limit?: number }) {
  const list = limit ? publishedServices.slice(0, limit) : publishedServices;
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s) => (
        <li key={s.slug}>
          <Link
            href={`/services/${s.slug}`}
            className="card group flex h-full flex-col p-7 transition hover:-translate-y-0.5 hover:border-brand/40"
          >
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <ServiceIcon name={s.icon} className="h-[22px] w-[22px]" />
              </span>
              <ArrowUpRight size={18} className="text-muted transition group-hover:text-brand" aria-hidden />
            </div>
            <h3 className="mt-6 text-lg">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
