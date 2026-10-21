// Registrant list for one event (SPEC.md FR-3.5). Names and emails are personal data: the
// server only sends them to the event's club admins and to admins.
import { Link, useParams } from 'react-router';
import { ArrowLeft, UsersRound } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import formatDate from '../../utils/formatDate.js';

export default function RegistrantsPage() {
  const { id } = useParams();
  const event = useFetch(`/events/${id}`);
  const registrants = useFetch(`/events/${id}/registrations`);

  const error = event.error || registrants.error;
  if (error) return <ErrorState message={error} />;
  if (!event.data || !registrants.data) return <Spinner label="Loading registrants…" />;

  return (
    <>
      <Link
        to="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Dashboard
      </Link>
      <PageHeader
        eyebrow="Registrants"
        title={event.data.title}
        description={`${registrants.data.length} of ${event.data.capacity} seats taken`}
      />
      {registrants.data.length === 0 ? (
        <EmptyState icon={UsersRound} message="Nobody has registered yet." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted text-xs tracking-wide text-ink-muted uppercase">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {registrants.data.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">{r.name}</td>
                  <td className="px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{formatDate(r.registeredAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
