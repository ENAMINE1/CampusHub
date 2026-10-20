// My Registrations: every event you registered for, read from RegistrationsContext.
import { Link } from 'react-router';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useRegistrations } from '../context/RegistrationsContext.jsx';
import formatDate from '../utils/formatDate.js';

export default function MyRegistrationsPage() {
  const { registrations } = useRegistrations();

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        My registrations
      </h1>
      {registrations.length === 0 ? (
        <EmptyState message="You have not registered for any events yet." />
      ) : (
        <ul className="space-y-3">
          {registrations.map((r) => (
            <li key={r.eventId}>
              <Card className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Link
                    to={`/events/${r.eventId}`}
                    className="font-semibold text-slate-900 hover:underline dark:text-slate-100"
                  >
                    {r.title}
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {formatDate(r.startsAt)} · {r.venue}
                  </p>
                </div>
                <Badge tone={r.status === 'registered' ? 'success' : 'danger'}>
                  {r.status}
                </Badge>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
