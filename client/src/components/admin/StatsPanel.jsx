// Platform stats for admins (SPEC.md FR-8.2): registrations per category and per event,
// computed on the server by an aggregation pipeline.
import useFetch from '../../hooks/useFetch.js';
import Spinner from '../ui/Spinner.jsx';
import ErrorState from '../ui/ErrorState.jsx';

export default function StatsPanel() {
  const { data, isLoading, error } = useFetch('/admin/stats');
  if (isLoading) return <Spinner label="Loading stats…" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <section aria-labelledby="per-category">
        <h3 id="per-category" className="mb-2 font-semibold">
          Per category
        </h3>
        <ul className="space-y-1 text-sm">
          {data.perCategory.map((row) => (
            <li key={row.category} className="flex justify-between capitalize">
              <span>{row.category}</span>
              <span className="font-semibold tabular-nums">{row.registrations}</span>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="per-event">
        <h3 id="per-event" className="mb-2 font-semibold">
          Top events
        </h3>
        <ol className="space-y-1 text-sm">
          {data.perEvent.slice(0, 8).map((row) => (
            <li key={row.eventId} className="flex justify-between gap-3">
              <span className="truncate">{row.title}</span>
              <span className="font-semibold tabular-nums">{row.registrations}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
