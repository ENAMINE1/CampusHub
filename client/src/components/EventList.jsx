// Shows a grid of EventCards, or an EmptyState when there is nothing to show.
import { SearchX } from 'lucide-react';
import EventCard from './EventCard.jsx';
import EmptyState from './ui/EmptyState.jsx';

export default function EventList({
  events,
  emptyMessage = 'No events match your search.',
  headingAs,
}) {
  if (events.length === 0) {
    return <EmptyState icon={SearchX} title="Nothing here yet" message={emptyMessage} />;
  }

  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {/* Classic mistake: key={index}. Keys must be stable ids, or React mixes up items when the list changes. */}
      {events.map((event, i) => (
        <li
          key={event.id}
          className="flex animate-rise"
          // A short stagger makes the grid settle in order instead of all at once.
          style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
        >
          <EventCard event={event} headingAs={headingAs} />
        </li>
      ))}
    </ul>
  );
}
