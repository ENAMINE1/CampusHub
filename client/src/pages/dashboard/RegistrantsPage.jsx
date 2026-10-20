// Registrant list for one event (SPEC.md FR-3.5). Names and emails are personal data: the
// server only sends them to the event's club admins and to admins.
import { Link, useParams } from 'react-router';
import useFetch from '../../hooks/useFetch.js';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
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
        className="text-sm font-semibold text-brand-700 underline dark:text-brand-300"
      >
        ← Dashboard
      </Link>
      <h1 className="mt-4 mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100">
        {event.data.title}
      </h1>
      <p className="mb-6 text-slate-600 dark:text-slate-400">
        {registrants.data.length} of {event.data.capacity} seats taken
      </p>
      {registrants.data.length === 0 ? (
        <EmptyState message="Nobody has registered yet." />
      ) : (
        <table className="w-full overflow-hidden rounded-xl bg-white text-left text-sm dark:bg-slate-800">
          <thead className="bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
            <tr>
              <th scope="col" className="p-3">
                Name
              </th>
              <th scope="col" className="p-3">
                Email
              </th>
              <th scope="col" className="p-3">
                Registered
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800 dark:divide-slate-700 dark:text-slate-200">
            {registrants.data.map((r) => (
              <tr key={r.id}>
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.email}</td>
                <td className="p-3">{formatDate(r.registeredAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
