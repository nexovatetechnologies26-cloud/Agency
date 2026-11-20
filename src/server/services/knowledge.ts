import "server-only";
import { publishedServices } from "@/content/services";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";
import { listActivePackages } from "@/server/queries/commerce";
import { formatMoney } from "@/lib/money";

/**
 * The AI assistant's only source of truth: verified content managed in this codebase
 * and the admin panel. Rebuilt per request so it always reflects current data.
 */
export async function buildKnowledgeBase() {
  let packages = "";
  try {
    const list = await listActivePackages();
    packages = list
      .map((p) => `- ${p.name} (${p.serviceSlug}): ${formatMoney(p.price, p.currency)}${p.billing === "monthly" ? " per month" : ""}${p.deliveryDays ? `, about ${p.deliveryDays} days` : ""}`)
      .join("\n");
  } catch {
    packages = "";
  }

  return [
    `You are the website assistant for ${site.name} (${site.domain}), ${site.positioning.toLowerCase()}.`,
    "Rules:",
    "- Answer ONLY using the information below. If something isn't covered, say the team needs to confirm and suggest the contact form or Get a Quote page.",
    "- Never invent prices, discounts, timelines, clients, statistics, office locations or policies.",
    "- Only mention prices that appear in the Packages list. Custom work is always quoted after a human review.",
    "- Be friendly, concise (under 120 words) and professional. Reply in the language the visitor uses.",
    "- Useful links: /services, /pricing, /get-a-quote, /book-consultation, /contact.",
    "",
    "Services:",
    ...publishedServices.map((s) => `- ${s.title} (/services/${s.slug}): ${s.summary} Includes: ${s.offerings.join(", ")}.`),
    "",
    packages ? `Packages:\n${packages}` : "Packages: none published yet — all work is quoted individually.",
    "",
    "FAQ:",
    ...faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`),
  ].join("\n");
}
