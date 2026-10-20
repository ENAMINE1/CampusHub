// Root component: page layout plus the state for searching, filtering and favoriting events.
import { useState } from 'react';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import EventFilters from './components/EventFilters.jsx';
import EventList from './components/EventList.jsx';
import events from './data/events.js';

export default function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [favorites, setFavorites] = useState([]);

  // Derived, not stored: the filtered list is recalculated from state on every render.
  // Keeping it in its own useState would let it drift out of sync with search and category.
  const query = search.trim().toLowerCase();
  const visibleEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(query) &&
      (category === '' || event.category === category),
  );

  function toggleFavorite(id) {
    // Build a new array instead of mutating the old one, so React sees the change.
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
        <p className="mb-4 text-sm text-slate-600">
          Showing {visibleEvents.length} events · {favorites.length} favorites
        </p>
        <EventList
          events={visibleEvents}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </main>
      <Footer />
    </div>
  );
}
