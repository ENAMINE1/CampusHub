// One registration in My registrations: date tile, title and venue. The title link covers the
// whole row, so the row is one big click target and one tab stop.
import { Link } from 'react-router';
import { ChevronRight, MapPin } from 'lucide-react';
import DateTile from './DateTile.jsx';
import formatDate from '../utils/formatDate.js';
import relativeDay from '../utils/relativeDay.js';

export default function RegistrationRow({ registration: r }) {
  const when = relativeDay(r.startsAt, r.endsAt);
  const isSoon = when.tone === 'soon' || when.tone === 'live';

  return (
    <div className="group relative flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-card transition focus-within:ring-2 focus-within:ring-brand-500 hover:border-brand-300 hover:shadow-lift dark:hover:border-brand-500/50">
      <DateTile iso={r.startsAt} />
      <div className="min-w-0 flex-1">
        <Link
          to={`/events/${r.eventId}`}
          className="font-semibold outline-none after:absolute after:inset-0"
        >
          {r.title}
        </Link>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-sm text-ink-muted">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
          {formatDate(r.startsAt)} · {r.venue}
        </p>
      </div>
      <span
        className={`hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold sm:inline ${
          isSoon
            ? 'bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
            : 'bg-surface-muted text-ink-muted'
        }`}
      >
        {when.label}
      </span>
      <ChevronRight
        className="size-5 text-ink-muted transition group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </div>
  );
}
