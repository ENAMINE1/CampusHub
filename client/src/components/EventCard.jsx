// One event as a card. Everything it shows arrives through props.
import { Link } from 'react-router';
import formatDate from '../utils/formatDate.js';
import { assetUrl } from '../api/client.js';
import FavoriteButton from './FavoriteButton.jsx';
import Card from './ui/Card.jsx';
import Badge from './ui/Badge.jsx';

export default function EventCard({ event }) {
  // seatsLeft is calculated from the data, never stored separately.
  const seatsLeft = event.capacity - event.seatsTaken;

  return (
    <Card className="flex w-full flex-col">
      {event.posterUrl && (
        // loading="lazy": images below the fold download only when scrolled near.
        <img
          src={assetUrl(event.posterUrl)}
          alt=""
          loading="lazy"
          className="mb-4 aspect-video w-full rounded-lg object-cover"
        />
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{event.category}</Badge>
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {event.club.name}
          </span>
        </div>
        <FavoriteButton eventId={event.id} title={event.title} />
      </div>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        <Link to={`/events/${event.id}`} className="hover:underline">
          {event.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {event.description}
      </p>
      <dl className="mt-4 space-y-1 text-sm text-slate-700 dark:text-slate-300">
        <div>
          <dt className="inline font-medium">When: </dt>
          <dd className="inline">{formatDate(event.startsAt)}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Where: </dt>
          <dd className="inline">{event.venue}</dd>
        </div>
      </dl>
      <div className="mt-auto pt-4">
        {seatsLeft > 0 ? (
          <Badge tone="success">{seatsLeft} seats left</Badge>
        ) : (
          <Badge tone="danger">Full</Badge>
        )}
      </div>
    </Card>
  );
}
