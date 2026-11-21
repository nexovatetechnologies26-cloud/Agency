import type { Metadata } from "next";
import Link from "next/link";
import clsx from "clsx";
import { listPublishedPosts } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";
import { fmtDate } from "@/lib/format";
import { PageHero } from "@/components/ui/page-hero";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description: "Practical insights on web development, AI automation, SEO and digital growth.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const all = await safe(() => listPublishedPosts(), [], "blog");
  const categories = [...new Set(all.map((p) => p.category).filter(Boolean))] as string[];
  const active = category && categories.includes(category) ? category : undefined;
  const posts = active ? all.filter((p) => p.category === active) : all;
  const pill = (on: boolean) =>
    clsx("rounded-full border px-3.5 py-1.5 text-xs font-medium transition", on ? "border-brand bg-brand text-white" : "border-line bg-white hover:border-brand hover:text-brand");

  return (
    <>
    <PageHero eyebrow="Insights" title={<>Ideas for building and <em>growing online.</em></>} description="Practical notes on web development, AI automation, SEO and digital growth." />
    <section className="bg-paper py-16 lg:py-20">
      <div className="container">
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <Link href="/blog" aria-current={!active ? "page" : undefined} className={pill(!active)}>All</Link>
            {categories.map((c) => (
              <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} aria-current={active === c ? "page" : undefined} className={pill(active === c)}>
                {c}
              </Link>
            ))}
          </div>
        )}
        <div className={categories.length > 1 ? "mt-10" : ""}>
          {posts.length ? (
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`} className="card group block h-full overflow-hidden transition hover:border-brand/40">
                    {p.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element -- admin-provided external URL
                      <img src={p.coverImage} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
                    )}
                    <div className="p-6">
                      <p className="text-xs text-muted">{[p.category, fmtDate(p.publishedAt)].filter(Boolean).join(" · ")}</p>
                      <h2 className="mt-2 text-lg group-hover:text-brand">{p.title}</h2>
                      {p.excerpt && <p className="mt-2 text-sm text-muted">{p.excerpt}</p>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No articles yet" text="We're working on our first articles. Check back soon." />
          )}
        </div>
      </div>
    </section>
    </>
  );
}
