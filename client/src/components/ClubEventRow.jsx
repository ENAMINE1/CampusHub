// One event on the dashboard: date, title, a seats meter, and edit / registrants / delete actions.
import { Link } from 'react-router';
import { Pencil, Trash2, UsersRound } from 'lucide-react';
import DateTile from './DateTile.jsx';
import SeatsMeter from './SeatsMeter.jsx';
import buttonStyles from './ui/buttonStyles.js';

const action = buttonStyles({ variant: 'ghost', size: 'sm' });

export default function ClubEventRow({ event, onDelete }) {
  return (
    <li className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
      <DateTile iso={event.startsAt} />
      <div className="min-w-0 flex-1">
        <Link
          to={`/events/${event.id}`}
          className="font-semibold hover:text-brand-600 dark:hover:text-brand-300"
        >
          {event.title}
        </Link>
        <p className="truncate text-sm text-ink-muted">{event.venue}</p>
      </div>
      <div className="w-full sm:w-44">
        <SeatsMeter
          seatsLeft={event.capacity - event.seatsTaken}
          capacity={event.capacity}
        />
      </div>
      <div className="flex gap-1">
        <Link to={`/dashboard/events/${event.id}/edit`} className={action}>
          <Pencil aria-hidden="true" />
          Edit
        </Link>
        <Link to={`/dashboard/events/${event.id}/registrations`} className={action}>
          <UsersRound aria-hidden="true" />
          Registrants
        </Link>
        <button
          type="button"
          onClick={() => onDelete(event)}
          className={`${action} text-red-700 hover:bg-red-50 hover:text-red-800 dark:text-red-300 dark:hover:bg-red-500/10`}
        >
          <Trash2 aria-hidden="true" />
          Delete
        </button>
      </div>
    </li>
  );
}
