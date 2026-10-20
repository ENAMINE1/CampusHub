// Shows a grid of EventCards, or an EmptyState when there is nothing to show.
import EventCard from './EventCard.jsx';
import EmptyState from './EmptyState.jsx';

export default function EventList({ events, favorites, onToggleFavorite }) {
  if (events.length === 0) {
    return <EmptyState message="No events match your search." />;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Classic mistake: key={index}. Keys must be stable ids, or React mixes up items when the list changes. */}
      {events.map((event) => (
        <li key={event.id} className="flex">
          <EventCard
            event={event}
            isFavorite={favorites.includes(event.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  );
}
