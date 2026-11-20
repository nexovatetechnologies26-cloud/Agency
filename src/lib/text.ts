// Small text helpers. Pure module.

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Splits a multi-line textarea into a clean list. */
export function lines(input: string | null | undefined) {
  return (input ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export type Block = { type: "h2" | "h3" | "p" | "li"; text: string };

/**
 * Minimal, safe content format for blog posts / case studies:
 *   "## Heading", "### Sub", "- list item", blank line = new paragraph.
 * Rendered as React elements, so no HTML injection is possible.
 */
export function parseBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  for (const para of content.replace(/\r/g, "").split(/\n{2,}/)) {
    let current: Block | null = null; // paragraph being built inside this block
    for (const line of para.split("\n")) {
      const t = line.trim();
      if (!t) continue;
      const marker = t.startsWith("### ") ? "h3" : t.startsWith("## ") ? "h2" : t.startsWith("- ") ? "li" : null;
      if (marker) {
        blocks.push({ type: marker, text: t.replace(/^(###|##|-)\s+/, "") });
        current = null;
      } else if (current) {
        current.text += " " + t;
      } else {
        current = { type: "p", text: t };
        blocks.push(current);
      }
    }
  }
  return blocks;
}
