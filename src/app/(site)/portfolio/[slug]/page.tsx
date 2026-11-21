import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { getProject } from "@/server/queries/other";
import { services } from "@/content/services";
import { RichText } from "@/components/ui/rich-text";
import { Cta } from "@/components/sections/cta";

// Cached and refreshed every 5 minutes (admin edits refresh it immediately).
export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug).catch(() => null);
  if (!p) return {};
  return { title: p.title, description: p.summary ?? undefined, alternates: { canonical: `/portfolio/${p.slug}` } };
}

export default async function ProjectPage({ params }: Props) {
  const p = await getProject((await params).slug);
  if (!p) notFound();
  const service = services.find((s) => s.slug === p.serviceSlug);

  const sections = [
    ["The challenge", p.challenge],
    ["Our approach & solution", p.solution],
    ["Results", p.results],
  ].filter(([, v]) => v) as [string, string][];

  return (
    <>
      <article className="section">
        <div className="container max-w-4xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
            <Link href="/portfolio" className="hover:text-brand">Portfolio</Link>
            <ChevronRight size={14} aria-hidden />
            <span className="text-ink">{p.title}</span>
          </nav>
          <h1 className="mt-6 text-4xl md:text-5xl">{p.title}</h1>
          {p.summary && <p className="mt-4 text-lg text-muted">{p.summary}</p>}

          <dl className="mt-8 grid gap-6 rounded-2xl border border-line p-6 text-sm sm:grid-cols-3">
            {p.clientName && <div><dt className="text-muted">Client</dt><dd className="mt-1 font-semibold">{p.clientName}</dd></div>}
            {p.industry && <div><dt className="text-muted">Industry</dt><dd className="mt-1 font-semibold">{p.industry}</dd></div>}
            {service && <div><dt className="text-muted">Service</dt><dd className="mt-1 font-semibold"><Link href={`/services/${service.slug}`} className="hover:text-brand">{service.title}</Link></dd></div>}
            {p.technologies.length > 0 && <div className="sm:col-span-3"><dt className="text-muted">Technologies</dt><dd className="mt-1 font-semibold">{p.technologies.join(", ")}</dd></div>}
          </dl>

          {p.images[0] && (
            // eslint-disable-next-line @next/next/no-img-element -- admin-provided external URL
            <img src={p.images[0]} alt={p.title} className="mt-10 w-full rounded-2xl border border-line" />
          )}

          <div className="mt-6 space-y-12">
            {sections.map(([title, body]) => (
              <section key={title}>
                <h2 className="text-2xl">{title}</h2>
                <div className="mt-4"><RichText content={body} /></div>
              </section>
            ))}
          </div>

          {p.images.slice(1).map((src) => (
            // eslint-disable-next-line @next/next/no-img-element -- admin-provided external URL
            <img key={src} src={src} alt="" loading="lazy" className="mt-8 w-full rounded-2xl border border-line" />
          ))}

          {p.liveUrl && (
            <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="mt-10 inline-flex items-center gap-2 font-semibold text-brand">
              Visit live site <ExternalLink size={16} />
            </a>
          )}
        </div>
      </article>
      <Cta />
    </>
  );
}
