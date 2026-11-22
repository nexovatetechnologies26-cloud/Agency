import Link from "next/link";
import { services } from "@/content/services";
import { RemoteImage } from "@/components/ui/remote-image";

export type ProjectCardData = {
  slug: string;
  title: string;
  summary?: string | null;
  industry?: string | null;
  serviceSlug?: string | null;
  images: string[];
  isCaseStudy?: boolean | null;
};

export function ProjectCard({ p }: { p: ProjectCardData }) {
  const service = services.find((s) => s.slug === p.serviceSlug)?.title;
  return (
    <Link href={`/portfolio/${p.slug}`} className="card group block overflow-hidden transition hover:border-brand/40">
      <div className="relative aspect-[16/10] overflow-hidden bg-paper">
        {p.images[0] ? (
          <RemoteImage src={p.images[0]} alt="" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition group-hover:scale-[1.02]" />
        ) : (
          <div className="flex h-full items-center justify-center text-3xl font-extrabold text-brand/20">Nexovate</div>
        )}
      </div>
      <div className="p-6">
        <p className="text-xs font-medium text-brand">{[service, p.industry].filter(Boolean).join(" · ") || "Project"}</p>
        <h3 className="mt-2 text-lg">{p.title}</h3>
        {p.summary && <p className="mt-1.5 text-sm text-muted">{p.summary}</p>}
      </div>
    </Link>
  );
}
