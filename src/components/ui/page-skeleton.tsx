/** Loading placeholder for dashboard and admin pages. */
export function PageSkeleton() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading">
      <div className="mb-8 space-y-3">
        <div className="h-7 w-56 rounded-lg bg-line" />
        <div className="h-4 w-80 max-w-full rounded-lg bg-line/70" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card h-24 p-5">
            <div className="h-3 w-20 rounded bg-line" />
            <div className="mt-4 h-6 w-12 rounded bg-line" />
          </div>
        ))}
      </div>
      <div className="card mt-8 divide-y divide-line">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div className="space-y-2">
              <div className="h-4 w-48 rounded bg-line" />
              <div className="h-3 w-32 rounded bg-line/70" />
            </div>
            <div className="h-6 w-20 rounded-full bg-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
