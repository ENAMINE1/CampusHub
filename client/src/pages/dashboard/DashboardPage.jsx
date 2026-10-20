// Club admin dashboard (SPEC.md FR-8.1): the events of every club you manage.
import { Link } from 'react-router';
import useFetch from '../../hooks/useFetch.js';
import ClubEventsTable from '../../components/ClubEventsTable.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';

export default function DashboardPage() {
  const { data: clubs, isLoading, error } = useFetch('/me/clubs');

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        {clubs?.length > 0 && (
          <Link
            to="/dashboard/events/new"
            className="rounded-lg bg-brand-700 px-4 py-2 font-semibold text-white hover:bg-brand-600"
          >
            New event
          </Link>
        )}
      </div>
      {isLoading && <Spinner label="Loading your clubs…" />}
      {error && <ErrorState message={error} />}
      {clubs?.length === 0 && <EmptyState message="You do not manage any clubs yet." />}
      {clubs?.map((club) => (
        <ClubEventsTable key={club.id} club={club} />
      ))}
    </>
  );
}
