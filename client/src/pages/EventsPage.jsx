// Events page: search, filter, sort and page through events. The server does the filtering,
// so the page only builds the right URL and shows what comes back.
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import EventFilters from '../components/EventFilters.jsx';
import EventList from '../components/EventList.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';

export default function EventsPage() {
  // The filters live in the URL (?q=git&category=tech&page=2), so any view can be shared.
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = searchParams.get('sort') ?? 'date';
  const page = Number(searchParams.get('page') ?? 1);
  const debouncedSearch = useDebounce(search, 300);

  // Only send the parameters that are set. Typing waits for the debounce before refetching.
  const query = new URLSearchParams({ page: String(page), sort });
  if (debouncedSearch.trim()) query.set('q', debouncedSearch.trim());
  if (category) query.set('category', category);
  const { data, isLoading, error } = useFetch(`/events?${query}`);

  function updateParam(name, value) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(name, value);
    else next.delete(name);
    // A new filter changes the results, so go back to page 1.
    if (name !== 'page') next.delete('page');
    // replace: typing should not add one browser-history entry per keystroke.
    setSearchParams(next, { replace: name !== 'page' });
  }

  useEffect(() => {
    if (data) document.title = `CampusHub · ${data.total} events`;
  }, [data]);

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Events
      </h1>
      <EventFilters
        search={search}
        category={category}
        sort={sort}
        onChange={updateParam}
      />
      {isLoading && <Spinner label="Loading events…" />}
      {error && <ErrorState message={error} />}
      {data && !isLoading && (
        <>
          <EventList events={data.data} />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={(next) => updateParam('page', String(next))}
          />
        </>
      )}
    </>
  );
}
