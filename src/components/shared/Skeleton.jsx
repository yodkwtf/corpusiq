export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="animate-pulse rounded-2xl bg-surface p-6 shadow-card dark:bg-surface-dark" aria-hidden="true">
      <div className="mb-4 h-5 w-1/3 rounded bg-ink-100 dark:bg-ink-800" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="mb-3 h-4 rounded bg-ink-100 dark:bg-ink-800" style={{ width: `${85 - i * 15}%` }} />
      ))}
    </div>
  );
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading your results">
      <SkeletonCard lines={4} />
      <div className="grid gap-6 md:grid-cols-2">
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <SkeletonCard lines={5} />
    </div>
  );
}
