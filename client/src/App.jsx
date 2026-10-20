// Root component: loads events from a JSON file, then lets the user search, filter and favorite them.
import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import EventFilters from './components/EventFilters.jsx';
import EventList from './components/EventList.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
import useFetch from './hooks/useFetch.js';
import useDebounce from './hooks/useDebounce.js';
import useLocalStorage from './hooks/useLocalStorage.js';

export default function App() {
  const { data, isLoading, error } = useFetch('/data/events.json');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [category, setCategory] = useState('');
  const [favorites, setFavorites] = useLocalStorage('campushub:favorites', []);

  const events = data ?? [];
  const query = debouncedSearch.trim().toLowerCase();
  const visibleEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(query) &&
      (category === '' || event.category === category),
  );

  // Keep the browser tab title in sync with what is on screen.
  useEffect(() => {
    document.title = `CampusHub · ${visibleEvents.length} events`;
  }, [visibleEvents.length]);

  function toggleFavorite(id) {
    setFavorites((current) =>
      current.includes(id) ? current.filter((favId) => favId !== id) : [...current, id],
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-slate-900">Upcoming events</h1>
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
        {!isLoading && !error && (
          <EventList
            events={visibleEvents}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        )}
        <section className="mt-12" aria-labelledby="register-heading">
          <h2 id="register-heading" className="mb-4 text-2xl font-bold text-slate-900">
            Join CampusHub
          </h2>
          <RegistrationForm />
        </section>
      </main>
      <Footer />
    </div>
  );
}
