// My Registrations (SPEC.md FR-3.4): the student's events, split into upcoming and past.
import { useState } from 'react';
import { Link } from 'react-router';
import { Ticket } from 'lucide-react';
import RegistrationRow from '../components/RegistrationRow.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import SegmentedControl from '../components/ui/SegmentedControl.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import buttonStyles from '../components/ui/buttonStyles.js';
import { useRegistrations } from '../context/RegistrationsContext.jsx';

export default function MyRegistrationsPage() {
  const { registrations, isLoading, error } = useRegistrations();
  const [tab, setTab] = useState('upcoming');

  const now = new Date();
  const active = registrations.filter((r) => r.status === 'registered');
  const upcoming = active.filter((r) => new Date(r.startsAt) >= now);
  const past = active.filter((r) => new Date(r.startsAt) < now);
  const shown = tab === 'upcoming' ? upcoming : past;

  return (
    <>
      <PageHeader
        eyebrow="Your plans"
        title="My registrations"
        description="Every event you have a seat for."
      />
      <SegmentedControl
        label="Which registrations"
        value={tab}
        onChange={setTab}
        options={[
          { value: 'upcoming', label: 'Upcoming', count: upcoming.length },
          { value: 'past', label: 'Past', count: past.length },
        ]}
      />
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
      <ul key={tab} className="space-y-3">
        {shown.map((r, i) => (
          <li
            key={r.eventId}
            className="animate-rise"
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
          >
            <RegistrationRow registration={r} />
          </li>
        ))}
      </ul>
    </>
  );
}
