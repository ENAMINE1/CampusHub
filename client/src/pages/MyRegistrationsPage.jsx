// My Registrations (SPEC.md FR-3.4): the student's events, split into upcoming and past.
import { useState } from 'react';
import { Link } from 'react-router';
import { Ticket } from 'lucide-react';
import RegistrationRow from '../components/RegistrationRow.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import buttonStyles from '../components/ui/buttonStyles.js';
import { useRegistrations } from '../context/RegistrationsContext.jsx';

const tabClass = (isActive) =>
  `rounded-lg px-4 py-1.5 text-sm font-semibold capitalize transition ${
    isActive ? 'bg-surface text-ink shadow-card' : 'text-ink-muted hover:text-ink'
  }`;

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
      <PageHeader
        eyebrow="Your plans"
        title="My registrations"
        description="Every event you have a seat for."
      />
      <div
        className="mb-6 inline-flex gap-1 rounded-xl border border-line bg-surface-muted p-1"
        role="group"
        aria-label="Which registrations"
      >
        {['upcoming', 'past'].map((name) => (
          <button
            key={name}
            type="button"
            aria-pressed={tab === name}
            onClick={() => setTab(name)}
            className={tabClass(tab === name)}
          >
            {name}
          </button>
        ))}
      </div>
      {isLoading && <Spinner label="Loading your registrations…" />}
      {error && <ErrorState message={error} />}
      {!isLoading && !error && shown.length === 0 && (
        <EmptyState
          icon={Ticket}
          message={`No ${tab} registrations.`}
          action={
            <Link to="/events" className={buttonStyles({ variant: 'secondary' })}>
              Find an event
            </Link>
          }
        />
      )}
      <ul className="space-y-3">
        {shown.map((r) => (
          <li key={r.eventId} className="animate-rise">
            <RegistrationRow registration={r} />
          </li>
        ))}
      </ul>
    </>
  );
}
