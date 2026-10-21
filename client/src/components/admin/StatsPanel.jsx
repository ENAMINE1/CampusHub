// Platform stats for admins (SPEC.md FR-8.2): registrations per category and per event,
// computed on the server by an aggregation pipeline. Bars are relative to the largest value.
import useFetch from '../../hooks/useFetch.js';
import Spinner from '../ui/Spinner.jsx';
import ErrorState from '../ui/ErrorState.jsx';

function BarList({ id, title, rows, labelKey, as: List = 'ul' }) {
  const max = Math.max(1, ...rows.map((row) => row.registrations));

  return (
    <section aria-labelledby={id}>
      <h3
        id={id}
        className="mb-4 text-sm font-semibold tracking-wide text-ink-muted uppercase"
      >
        {title}
      </h3>
      <List className="space-y-3 text-sm">
        {rows.map((row) => (
          <li key={row[labelKey]}>
            <div className="mb-1 flex justify-between gap-3">
              <span className="truncate capitalize">{row.title ?? row.category}</span>
              <span className="font-semibold tabular-nums">{row.registrations}</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-surface-muted"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400"
                style={{ width: `${(row.registrations / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </List>
    </section>
  );
}

export default function StatsPanel() {
  const { data, isLoading, error } = useFetch('/admin/stats');
  if (isLoading) return <Spinner label="Loading stats…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <BarList
        id="per-category"
        title="Per category"
        rows={data.perCategory}
        labelKey="category"
      />
      <BarList
        id="per-event"
        title="Top events"
        rows={data.perEvent.slice(0, 8)}
        labelKey="eventId"
        as="ol"
      />
    </div>
  );
}
