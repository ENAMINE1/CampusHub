// The when / where / deadline facts of one event, as a grid of icon tiles.
import { CalendarClock, CalendarDays, Hourglass, MapPin } from 'lucide-react';
import formatDate from '../utils/formatDate.js';

export default function EventFacts({ event }) {
  const facts = [
    { icon: CalendarDays, label: 'Starts', value: formatDate(event.startsAt) },
    { icon: CalendarClock, label: 'Ends', value: formatDate(event.endsAt) },
    { icon: MapPin, label: 'Venue', value: event.venue },
    {
      icon: Hourglass,
      label: 'Register by',
      value: formatDate(event.registrationDeadline),
    },
  ];

  return (
    <dl className="mt-8 grid gap-3 sm:grid-cols-2">
      {facts.map(({ icon: Icon, label, value }) => (
        <div
          key={label}
          className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
            <Icon className="size-5" aria-hidden="true" />
          </span>
          <div>
            <dt className="text-xs font-semibold tracking-wide text-ink-muted uppercase">
              {label}
            </dt>
            <dd className="mt-0.5 font-medium">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
