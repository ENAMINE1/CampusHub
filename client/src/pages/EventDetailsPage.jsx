// Event details page for /events/:id. The id comes from the URL.
import { Link, useParams } from 'react-router';
import useFetch from '../hooks/useFetch.js';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import RegisterForEvent from '../components/RegisterForEvent.jsx';
import formatDate from '../utils/formatDate.js';

export default function EventDetailsPage() {
  const { id } = useParams();
  const { data, isLoading, error } = useFetch('/data/events.json');

  if (isLoading) return <Spinner label="Loading event…" />;
  if (error) return <ErrorState message={error} />;

  const event = data.find((item) => item.id === id);
  if (!event) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Event not found</h1>
        <Link
          to="/events"
          className="mt-4 inline-block font-semibold text-brand-700 underline"
        >
          Back to all events
        </Link>
      </div>
    );
  }

  const seatsLeft = event.capacity - event.seatsTaken;

  return (
    <Card className="p-8">
      <Link to="/events" className="text-sm font-semibold text-brand-700 underline">
        ← All events
      </Link>
      <div className="mt-4 flex items-center gap-2">
        <Badge>{event.category}</Badge>
        <span className="text-sm text-slate-600">{event.club.name}</span>
      </div>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">{event.title}</h1>
      <p className="mt-4 text-slate-700">{event.description}</p>
      <dl className="mt-6 grid gap-3 text-slate-800 sm:grid-cols-2">
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
      <p className="mt-6 mb-4 text-lg font-semibold text-slate-900">
        {seatsLeft > 0
          ? `${seatsLeft} of ${event.capacity} seats left`
          : 'This event is full'}
      </p>
      <RegisterForEvent event={event} />
    </Card>
  );
}
