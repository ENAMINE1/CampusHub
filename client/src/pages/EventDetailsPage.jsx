// Event details page for /events/:id. The id comes from the URL.
import { Link, useParams } from 'react-router';
import useFetch from '../hooks/useFetch.js';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import RegisterForEvent from '../components/RegisterForEvent.jsx';
import FavoriteButton from '../components/FavoriteButton.jsx';
import formatDate from '../utils/formatDate.js';
import { assetUrl } from '../api/client.js';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { data, error, reload } = useFetch(`/events/${id}`);
  // Only trust data that belongs to this id: right after navigating, data may still hold the
  // previous event. While reloading the same event (after registering) we keep showing it.
  const event = data?.id === id ? data : null;

  if (error) return <ErrorState message={error} />;
  if (!event) return <Spinner label="Loading event…" />;

  const { seatsLeft } = event;

  return (
    <Card className="p-8">
      {event.posterUrl && (
        <img
          src={assetUrl(event.posterUrl)}
          alt={`Poster for ${event.title}`}
          className="mb-6 max-h-96 w-full rounded-lg object-cover"
        />
      )}
      <Link
        to="/events"
        className="text-sm font-semibold text-brand-700 dark:text-brand-300 underline"
      >
        ← All events
      </Link>
      <div className="mt-4 flex items-center gap-2">
        <Badge>{event.category}</Badge>
        <span className="text-sm text-slate-600 dark:text-slate-400">
          {event.club.name}
        </span>
        <span className="ml-auto">
          <FavoriteButton eventId={event.id} title={event.title} />
        </span>
      </div>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
        {event.title}
      </h1>
      <p className="mt-4 text-slate-700 dark:text-slate-300">{event.description}</p>
      <dl className="mt-6 grid gap-3 text-slate-800 dark:text-slate-200 sm:grid-cols-2">
        <div>
          <dt className="font-semibold">Starts</dt>
          <dd>{formatDate(event.startsAt)}</dd>
        </div>
        <div>
          <dt className="font-semibold">Ends</dt>
          <dd>{formatDate(event.endsAt)}</dd>
        </div>
        <div>
          <dt className="font-semibold">Venue</dt>
          <dd>{event.venue}</dd>
        </div>
        <div>
          <dt className="font-semibold">Register by</dt>
          <dd>{formatDate(event.registrationDeadline)}</dd>
        </div>
      </dl>
      <p className="mt-6 mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {seatsLeft > 0
          ? `${seatsLeft} of ${event.capacity} seats left`
          : 'This event is full'}
      </p>
      <RegisterForEvent event={event} onChange={reload} />
    </Card>
  );
}
