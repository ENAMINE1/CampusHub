// One event as a card. Everything it shows arrives through props.
import formatDate from '../utils/formatDate.js';
import FavoriteButton from './FavoriteButton.jsx';

export default function EventCard({ event, isFavorite, onToggleFavorite }) {
  // seatsLeft is calculated from the data, never stored separately.
  const seatsLeft = event.capacity - event.seatsTaken;
  const isFull = seatsLeft <= 0;

  return (
    <article className="flex w-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
          {event.category} · {event.club.name}
        </p>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={() => onToggleFavorite(event.id)}
          title={event.title}
        />
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{event.title}</h2>
      <p className="mt-2 text-sm text-slate-600">{event.description}</p>
      <dl className="mt-4 space-y-1 text-sm text-slate-700">
        <div>
          <dt className="inline font-medium">When: </dt>
          <dd className="inline">{formatDate(event.startsAt)}</dd>
        </div>
        <div>
          <dt className="inline font-medium">Where: </dt>
          <dd className="inline">{event.venue}</dd>
        </div>
      </dl>
      {isFull ? (
        <p className="mt-4 font-semibold text-red-700">Full</p>
      ) : (
        <p className="mt-4 font-semibold text-green-800">{seatsLeft} seats left</p>
      )}
    </article>
  );
}
