// Events page: search, filter and favorite the full list of events.
import { useEffect, useState } from 'react';
import EventFilters from '../components/EventFilters.jsx';
import EventList from '../components/EventList.jsx';
import useFetch from '../hooks/useFetch.js';
import useDebounce from '../hooks/useDebounce.js';
import useLocalStorage from '../hooks/useLocalStorage.js';

export default function EventsPage() {
  const { data, isLoading, error } = useFetch('/data/events.json');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState('');
  const [favorites, setFavorites] = useLocalStorage('campushub:favorites', []);

  const query = debouncedSearch.trim().toLowerCase();
  const visibleEvents = (data ?? []).filter(
    (event) =>
      event.title.toLowerCase().includes(query) &&
      (category === '' || event.category === category),
  );

  useEffect(() => {
    document.title = `CampusHub · ${visibleEvents.length} events`;
  }, [visibleEvents.length]);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favId) => favId !== id) : [...current, id],
    );
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">Events</h1>
      <EventFilters
        search={search}
        category={category}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
      />
      {isLoading && <p className="text-slate-600">Loading events…</p>}
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </p>
      )}
      {data && (
        <EventList
          events={visibleEvents}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </>
  );
}
