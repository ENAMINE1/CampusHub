// Clubs page. Until the API exists, the club list is worked out from the events data.
import useFetch from '../hooks/useFetch.js';

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
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Clubs</h1>
      {isLoading && <p className="text-slate-600">Loading clubs…</p>}
      {error && (
        <p role="alert" className="text-red-800">
          {error}
        </p>
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(clubs).map((club) => (
          <li key={club.slug} className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-slate-900">{club.name}</h2>
            <p className="text-sm text-slate-600">{club.eventCount} upcoming events</p>
          </li>
        ))}
      </ul>
    </>
  );
}
