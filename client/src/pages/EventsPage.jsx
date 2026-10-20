// Events page: search, filter and favorite the full list of events.
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import EventFilters from '../components/EventFilters.jsx';
import EventList from '../components/EventList.jsx';
import useFetch from '../hooks/useFetch.js';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import useDebounce from '../hooks/useDebounce.js';
import filterEvents from '../utils/filterEvents.js';

export default function EventsPage() {
  const { data, isLoading, error } = useFetch('/data/events.json');
  // The filters live in the URL (?q=git&category=tech), so a filtered view can be bookmarked or shared.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const debouncedSearch = useDebounce(search, 300);

  function updateParam(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    // replace: typing should not add one browser-history entry per keystroke.
    setSearchParams(next, { replace: true });
  }

  // Why useMemo here: the input updates the URL on every keystroke, which re-renders this page,
  // but the list only changes when the debounced text, category or data change. useMemo skips
  // re-filtering on the in-between renders. With 8 events it hardly matters; with thousands it does.
  // Measure before reaching for useMemo elsewhere.
  const visibleEvents = useMemo(
    () => filterEvents(data ?? [], debouncedSearch, category),
    [data, debouncedSearch, category],
  );

  useEffect(() => {
    document.title = `CampusHub · ${visibleEvents.length} events`;
  }, [visibleEvents.length]);

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Events
      </h1>
      <EventFilters
        search={search}
        category={category}
        onSearchChange={(value) => updateParam('q', value)}
        onCategoryChange={(value) => updateParam('category', value)}
      />
      {isLoading && <Spinner label="Loading events…" />}
      {error && <ErrorState message={error} />}
      {data && <EventList events={visibleEvents} />}
    </>
  );
}
