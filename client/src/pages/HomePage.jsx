// Home page: a short welcome and the next three events.
import { Link } from 'react-router';
import EventList from '../components/EventList.jsx';
import useFetch from '../hooks/useFetch.js';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';

export default function HomePage() {
  // Ask the server for exactly what we show: the next three upcoming events.
  const { data, isLoading, error } = useFetch('/events?when=upcoming&limit=3');

  return (
    <>
      <section className="mb-10 rounded-2xl bg-brand-50 dark:bg-slate-800 p-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          What's happening on campus
        </h1>
        <p className="mt-2 text-slate-700 dark:text-slate-300">
          Find events, join clubs and never miss a thing.
        </p>
        <Link
          to="/events"
          className="mt-4 inline-block rounded-lg bg-brand-700 px-4 py-2 font-semibold text-white hover:bg-brand-600"
        >
          Browse all events
        </Link>
      </section>
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
        Coming up next
      </h2>
      {isLoading && <Spinner label="Loading events…" />}
      {error && <ErrorState message={error} />}
      {data && <EventList events={data.data} />}
    </>
  );
}
