// Shared layout for policy pages.
// IMPORTANT: policy texts in this project are plain-language starting points that
// describe what the platform actually does. Have them reviewed by a qualified
// professional for the countries you operate in before relying on them.

/** Shown as "Last updated" on every policy page. Change it whenever a policy changes. */
export const LEGAL_UPDATED = "21 November 2026";

export function LegalPage({
  title,
  updated = LEGAL_UPDATED,
  intro,
  sections,
}: {
  title: string;
  updated?: string;
  intro?: string;
  sections: { h: string; p: string[] }[];
}) {
  return (
    <section className="section">
      <article className="container max-w-3xl">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 text-4xl md:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated: {updated}</p>
        {intro && <p className="mt-6 text-lg leading-relaxed text-muted">{intro}</p>}

        {sections.length > 3 && (
          <nav aria-label="On this page" className="card mt-10 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">On this page</p>
            <ol className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              {sections.map((s, i) => (
                <li key={s.h}>
                  <a href={`#section-${i + 1}`} className="text-ink/80 hover:text-brand">
                    {i + 1}. {s.h}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="mt-12 space-y-10 text-[15px] leading-relaxed text-muted">
          {sections.map((s, i) => (
            <section key={s.h} id={`section-${i + 1}`} className="scroll-mt-28">
              <h2 className="text-xl text-ink">
                <span className="mr-2 text-brand">{i + 1}.</span>
                {s.h}
              </h2>
              {s.p.map((para, j) => (
                <p key={j} className="mt-3">{para}</p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </section>
  );
}
