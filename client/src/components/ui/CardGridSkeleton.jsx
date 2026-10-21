// Grey placeholder cards shown while a list loads. They take the same space as the real cards,
// so nothing jumps when the data arrives. Screen readers hear the label instead.
export default function CardGridSkeleton({ count = 6, label = 'Loading…' }) {
  return (
    <div role="status" aria-label={label}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
          >
            <div className="h-28 animate-pulse bg-surface-muted" />
            <div className="space-y-3 p-5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-surface-muted" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-surface-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-surface-muted" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
