// Event details page for /events/:id. The id comes from the URL.
// Wide screens get two columns: the story on the left, a sticky "reserve a seat" panel on the right.
import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import useSocketSeats from '../hooks/useSocketSeats.js';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Badge from '../components/ui/Badge.jsx';
import EventCover from '../components/EventCover.jsx';
import EventFacts from '../components/EventFacts.jsx';
import ReservePanel from '../components/ReservePanel.jsx';
import WhenChip from '../components/WhenChip.jsx';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { data, error, reload } = useFetch(`/events/${id}`);
  // Only trust data that belongs to this id: right after navigating, data may still hold the
  // previous event. While reloading the same event (after registering) we keep showing it.
  const event = data?.id === id ? data : null;
  // Hooks run on every render, before any early return below.
  const live = useSocketSeats(id, event?.seatsLeft);

  if (error) return <ErrorState message={error} />;
  if (!event) return <Spinner label="Loading event…" />;

  return (
    <div>
      <Link
        to="/events"
        className="group mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink"
      >
        <ArrowLeft
          className="size-4 transition group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        All events
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <article className="min-w-0">
          <div className="relative mb-8 animate-rise overflow-hidden rounded-3xl border border-line">
            <EventCover event={event} eager className="aspect-[21/9]" />
            <WhenChip
              startsAt={event.startsAt}
              endsAt={event.endsAt}
              className="absolute bottom-4 left-4 text-sm"
            />
          </div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge>{event.category}</Badge>
            <span className="text-sm font-medium text-ink-muted">{event.club.name}</span>
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">{event.title}</h1>
          <p className="mt-4 text-lg leading-relaxed whitespace-pre-line text-ink-muted">
            {event.description}
          </p>
          <EventFacts event={event} />
        </article>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ReservePanel event={event} live={live} onChange={reload} />
        </aside>
      </div>
    </div>
  );
}
