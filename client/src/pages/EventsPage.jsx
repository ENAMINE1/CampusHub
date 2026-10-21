// Events page: search, filter, sort and page through events. The server does the filtering,
// so the page only builds the right URL and shows what comes back.
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { FilterX, LoaderCircle, SearchX } from 'lucide-react';
import EventFilters from '../components/EventFilters.jsx';
import EventList from '../components/EventList.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import CardGridSkeleton from '../components/ui/CardGridSkeleton.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Button from '../components/ui/Button.jsx';
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
  const hasFilters = Boolean(search || category);

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

  function clearFilters() {
    setSearchParams(sort === 'date' ? {} : { sort }, { replace: true });
  }

  function goToPage(next) {
    updateParam('page', String(next));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    if (data) document.title = `CampusHub · ${data.total} events`;
  }, [data]);

  return (
    <>
      <PageHeader
        eyebrow="Discover"
        title="Events"
        description="Every event from every club on campus."
      />
      <EventFilters
        search={search}
        category={category}
        sort={sort}
        onChange={updateParam}
      />
      <div className="mb-5 flex min-h-8 items-center justify-between gap-3 text-sm text-ink-muted">
        <p aria-live="polite" className="flex items-center gap-2">
          {data && (
            <>
              <span className="font-semibold text-ink tabular-nums">{data.total}</span>
              {data.total === 1 ? 'event' : 'events'}
              {hasFilters &&
                (data.total === 1 ? ' matches your filters' : ' match your filters')}
            </>
          )}
          {isLoading && data && (
            <LoaderCircle
              className="size-4 animate-spin text-brand-500"
              aria-hidden="true"
            />
          )}
        </p>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="animate-fade"
          >
            <FilterX aria-hidden="true" />
            Clear filters
          </Button>
        )}
      </div>
      {/* Skeletons only on the first load. After that the old results stay visible (dimmed)
          while new ones load, so the page never flashes empty between keystrokes. */}
      {isLoading && !data && <CardGridSkeleton label="Loading events…" />}
      {error && <ErrorState message={error} />}
      {data && (
        <div
          aria-busy={isLoading}
          className={`transition-opacity duration-200 ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
        >
          {data.data.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No events found"
              message="Try another word, or clear the filters to see everything."
              action={
                hasFilters && (
                  <Button variant="secondary" onClick={clearFilters}>
                    <FilterX aria-hidden="true" />
                    Clear filters
                  </Button>
                )
              }
            />
          ) : (
            <EventList events={data.data} />
          )}
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </>
  );
}
