import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { publishedServices } from "@/content/services";
import { listProjects, listPublishedPosts } from "@/server/queries/other";
import { safe } from "@/server/lib/safe";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = [
    "", "/about", "/team", "/services", "/pricing", "/portfolio", "/case-studies", "/blog", "/faq",
    "/contact", "/get-a-quote", "/book-consultation", "/privacy-policy", "/terms", "/refund-policy", "/cookie-policy",
  ];
  const [posts, projects] = await Promise.all([safe(() => listPublishedPosts(), [], "sitemap-posts"), safe(() => listProjects(), [], "sitemap-projects")]);

  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.6 })),
    ...publishedServices.map((s) => ({ url: `${site.url}/services/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 })),
    ...projects.map((p) => ({ url: `${site.url}/portfolio/${p.slug}`, lastModified: p.updatedAt, priority: 0.5 })),
  ];
}
