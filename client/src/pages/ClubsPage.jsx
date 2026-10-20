// Clubs page. Until the API exists, the club list is worked out from the events data.
import useFetch from '../hooks/useFetch.js';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Card from '../components/ui/Card.jsx';

export default function ClubsPage() {
  const { data, isLoading, error } = useFetch('/data/events.json');

  // Count events per club, keyed by slug so each club appears once.
  const clubs = {};
  for (const event of data ?? []) {
    const club = clubs[event.club.slug] ?? { ...event.club, eventCount: 0 };
    club.eventCount += 1;
    clubs[event.club.slug] = club;
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Clubs
      </h1>
      {isLoading && <Spinner label="Loading clubs…" />}
      {error && <ErrorState message={error} />}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(clubs).map((club) => (
          <li key={club.slug}>
            <Card>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {club.name}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {club.eventCount} upcoming events
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
