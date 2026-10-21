// One event as a card. The title link stretches over the whole card (one tab stop, a big click
// target); the favorite button sits above it so it stays clickable on its own.
import { Link } from 'react-router';
import { CalendarDays, MapPin } from 'lucide-react';
import formatDate from '../utils/formatDate.js';
import FavoriteButton from './FavoriteButton.jsx';
import EventCover from './EventCover.jsx';
import SeatsMeter from './SeatsMeter.jsx';
import Badge from './ui/Badge.jsx';

// headingAs: h2 in a page's main list, h3 inside a titled section (home page).
export default function EventCard({ event, headingAs: Heading = 'h2' }) {
  // seatsLeft is calculated from the data, never stored separately.
  const seatsLeft = event.capacity - event.seatsTaken;
  const isPast = new Date(event.startsAt) < new Date();

  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-200 focus-within:ring-2 focus-within:ring-brand-500 hover:-translate-y-0.5 hover:shadow-lift">
      <EventCover event={event} className="h-32" />
      <div className="absolute top-3 right-3 z-10 rounded-full bg-surface/90 shadow-sm backdrop-blur">
        <FavoriteButton eventId={event.id} title={event.title} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge>{event.category}</Badge>
          {isPast && <Badge tone="neutral">Past</Badge>}
          <span className="truncate text-xs font-medium text-ink-muted">
            {event.club.name}
          </span>
        </div>
        <Heading className="text-lg leading-snug font-semibold">
          <Link
            to={`/events/${event.id}`}
            className="outline-none after:absolute after:inset-0 group-hover:text-brand-700 dark:group-hover:text-brand-300"
          >
            {event.title}
          </Link>
        </Heading>
        <p className="mt-1.5 line-clamp-2 text-sm text-ink-muted">{event.description}</p>
        <dl className="mt-4 space-y-1.5 text-sm text-ink-muted">
          <div className="flex items-center gap-2">
            <dt>
              <CalendarDays className="size-4" aria-label="When" />
            </dt>
            <dd>{formatDate(event.startsAt)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt>
              <MapPin className="size-4" aria-label="Where" />
            </dt>
            <dd className="truncate">{event.venue}</dd>
          </div>
        </dl>
        <div className="mt-auto pt-5">
          <SeatsMeter seatsLeft={seatsLeft} capacity={event.capacity} />
        </div>
      </div>
    </article>
  );
}
