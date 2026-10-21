// Placeholder cards shown while a list loads. They take the same space as the real cards, so
// nothing jumps when the data arrives, and a soft shimmer shows that loading is in progress.
// Screen readers hear the label instead.
export default function CardGridSkeleton({ count = 6, label = 'Loading…' }) {
  return (
    <div role="status" aria-label={label}>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <li
            key={i}
            className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card"
          >
            <div className="skeleton h-32" />
            <div className="space-y-3 p-5">
              <div className="skeleton h-4 w-1/3 rounded-full" />
              <div className="skeleton h-5 w-3/4 rounded-md" />
              <div className="skeleton h-4 w-full rounded-md" />
              <div className="skeleton h-4 w-2/3 rounded-md" />
              <div className="skeleton mt-6 h-1.5 w-full rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
