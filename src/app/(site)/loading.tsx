// Shown instantly while a public page loads, so navigation never feels frozen.
export default function Loading() {
  return (
    <section className="section" aria-busy="true" aria-label="Loading">
      <div className="container animate-pulse">
        <div className="h-3 w-24 rounded bg-line" />
        <div className="mt-5 h-10 w-full max-w-xl rounded-lg bg-line" />
        <div className="mt-4 h-4 w-full max-w-md rounded bg-line/70" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-44 p-7">
              <div className="h-10 w-10 rounded-xl bg-line" />
              <div className="mt-6 h-4 w-40 rounded bg-line" />
              <div className="mt-3 h-3 w-full rounded bg-line/70" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
