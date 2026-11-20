import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPublishedPost } from "@/server/queries/other";
import { site } from "@/content/site";
import { fmtDate } from "@/lib/format";
import { RichText } from "@/components/ui/rich-text";
import { Cta } from "@/components/sections/cta";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPublishedPost((await params).slug).catch(() => null);
  if (!p) return {};
  return {
    title: p.seoTitle || p.title,
    description: p.seoDescription || p.excerpt || undefined,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", title: p.title, images: p.coverImage ? [p.coverImage] : undefined },
  };
}

export default async function PostPage({ params }: Props) {
  const p = await getPublishedPost((await params).slug);
  if (!p) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/logo.png` } },
    image: p.coverImage || undefined,
    mainEntityOfPage: `${site.url}/blog/${p.slug}`,
  };

  return (
    <>
      <article className="section">
        <div className="container max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted hover:text-brand">
            <ChevronLeft size={16} /> All articles
          </Link>
          <p className="mt-8 text-sm text-muted">{[p.category, fmtDate(p.publishedAt), p.author].filter(Boolean).join(" · ")}</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-5xl">{p.title}</h1>
          {p.excerpt && <p className="mt-5 text-lg text-muted">{p.excerpt}</p>}
          {p.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element -- admin-provided external URL
            <img src={p.coverImage} alt="" className="mt-10 w-full rounded-2xl border border-line" />
          )}
          <div className="mt-10">
            <RichText content={p.content} />
          </div>
          {p.tags.length > 0 && (
            <p className="mt-10 text-sm text-muted">Tags: {p.tags.join(", ")}</p>
          )}
        </div>
      </article>
      <Cta />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
