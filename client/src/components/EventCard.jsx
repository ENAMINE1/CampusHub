// One event as a card. The title link stretches over the whole card (one tab stop, a big click
// target); the favorite button sits above it so it stays clickable on its own.
import { Link } from 'react-router';
import { ArrowUpRight, CalendarDays, CircleCheck, MapPin } from 'lucide-react';
import formatDate from '../utils/formatDate.js';
import { useRegistrations } from '../context/RegistrationsContext.jsx';
import FavoriteButton from './FavoriteButton.jsx';
import EventCover from './EventCover.jsx';
import SeatsMeter from './SeatsMeter.jsx';
import WhenChip from './WhenChip.jsx';
import Badge from './ui/Badge.jsx';

// headingAs: h2 in a page's main list, h3 inside a titled section (home page).
export default function EventCard({ event, headingAs: Heading = 'h2' }) {
  // seatsLeft is calculated from the data, never stored separately.
  const seatsLeft = event.capacity - event.seatsTaken;
  const isPast = new Date(event.endsAt ?? event.startsAt) < new Date();
  // Optional chaining: unit tests render a card without the registrations provider.
  const isRegistered = useRegistrations()?.isRegistered?.(event.id);

  return (
    <article
      className={`group relative flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition duration-300 ease-out focus-within:ring-2 focus-within:ring-brand-500 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift dark:hover:border-brand-500/40 ${
        isPast ? 'opacity-80 saturate-50 hover:opacity-100 hover:saturate-100' : ''
      }`}
    >
      <div className="relative overflow-hidden">
        {/* The cover zooms in slightly on hover, a cue that the whole card is clickable. */}
        <EventCover
          event={event}
          className="h-32 transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <WhenChip
          startsAt={event.startsAt}
          endsAt={event.endsAt}
          className="absolute bottom-3 left-3"
        />
      </div>
      <div className="absolute top-3 right-3 z-10 rounded-full bg-surface/90 shadow-sm backdrop-blur">
        <FavoriteButton eventId={event.id} title={event.title} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge>{event.category}</Badge>
          {isRegistered && (
            <Badge tone="success">
              <CircleCheck aria-hidden="true" />
              Registered
            </Badge>
          )}
          <span className="truncate text-xs font-medium text-ink-muted">
            {event.club.name}
          </span>
        </div>
        <Heading className="flex items-start justify-between gap-2 text-lg leading-snug font-semibold">
          <Link
            to={`/events/${event.id}`}
            className="outline-none after:absolute after:inset-0 group-hover:text-brand-700 dark:group-hover:text-brand-300"
          >
            {event.title}
          </Link>
          <ArrowUpRight
            className="mt-1 size-4 shrink-0 -translate-x-1 text-brand-500 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          />
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
