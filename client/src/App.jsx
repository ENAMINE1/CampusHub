// Root component: loads events from a JSON file, then lets the user search, filter and favorite them.
import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import EventFilters from './components/EventFilters.jsx';
import EventList from './components/EventList.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';

export default function App() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Load the events once, when the component first appears.
  useEffect(() => {
    const controller = new AbortController();
    fetch('/data/events.json', { signal: controller.signal })
      .then((res) => {
        // Classic mistake: fetch only rejects on network failure. A 404 still "succeeds" unless you check res.ok.
        if (!res.ok) throw new Error(`Could not load events (HTTP ${res.status}).`);
        return res.json();
      })
      .then((data) => setEvents(data))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setIsLoading(false));
    // Cleanup: cancel the request if the component goes away before it finishes.
    return () => controller.abort();
  }, []);

  // Wait until typing pauses for 300 ms before filtering. The cleanup cancels the previous timer.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

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
