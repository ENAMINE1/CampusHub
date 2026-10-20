// Home page: a short welcome and the next three events.
import { Link } from 'react-router';
import EventList from '../components/EventList.jsx';
import useFetch from '../hooks/useFetch.js';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';

export default function HomePage() {
  const { data, isLoading, error } = useFetch('/data/events.json');
  const [favorites, setFavorites] = useLocalStorage('campushub:favorites', []);

  // Copy before sorting: sort() changes the array in place, and `data` belongs to the hook.
  const nextEvents = [...(data ?? [])]
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, 3);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favId) => favId !== id) : [...current, id],
    );
  }

  return (
    <>
      <section className="mb-10 rounded-2xl bg-brand-50 p-8">
        <h1 className="text-3xl font-bold text-slate-900">What's happening on campus</h1>
        <p className="mt-2 text-slate-700">
          Find events, join clubs and never miss a thing.
        </p>
        <Link
          to="/events"
          className="mt-4 inline-block rounded-lg bg-brand-700 px-4 py-2 font-semibold text-white hover:bg-brand-600"
        >
          Browse all events
        </Link>
      </section>
      <h2 className="mb-4 text-2xl font-bold text-slate-900">Coming up next</h2>
      {isLoading && <Spinner label="Loading events…" />}
      {error && <ErrorState message={error} />}
      {data && (
        <EventList
          events={nextEvents}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
