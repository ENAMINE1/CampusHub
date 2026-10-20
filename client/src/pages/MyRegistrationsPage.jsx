// My Registrations (SPEC.md FR-3.4): the student's events, split into upcoming and past.
import { useState } from 'react';
import { Link } from 'react-router';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import { useRegistrations } from '../context/RegistrationsContext.jsx';
import formatDate from '../utils/formatDate.js';

export default function MyRegistrationsPage() {
  const { registrations, isLoading, error } = useRegistrations();
  const [tab, setTab] = useState('upcoming');

  const now = new Date();
  const active = registrations.filter((r) => r.status === 'registered');
  const shown = active.filter((r) =>
    tab === 'upcoming' ? new Date(r.startsAt) >= now : new Date(r.startsAt) < now,
  );

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        My registrations
      </h1>
      <div className="mb-6 flex gap-2" role="group" aria-label="Which registrations">
        {['upcoming', 'past'].map((name) => (
          <Button
            key={name}
            variant={tab === name ? 'primary' : 'secondary'}
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
            className="capitalize"
          >
            {name}
          </Button>
        ))}
      </div>
      {isLoading && <Spinner label="Loading your registrations…" />}
      {error && <ErrorState message={error} />}
      {!isLoading && !error && shown.length === 0 && (
        <EmptyState message={`No ${tab} registrations.`} />
      )}
      <ul className="space-y-3">
        {shown.map((r) => (
          <li key={r.eventId}>
            <Card>
              <Link
                to={`/events/${r.eventId}`}
                className="font-semibold text-slate-900 hover:underline dark:text-slate-100"
              >
                {r.title}
              </Link>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {formatDate(r.startsAt)} · {r.venue}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </>
  );
}
