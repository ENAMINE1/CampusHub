// Club admin dashboard (SPEC.md FR-8.1): the events of every club you manage.
import { Link } from 'react-router';
import { Plus, UsersRound } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import ClubEventsTable from '../../components/ClubEventsTable.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import buttonStyles from '../../components/ui/buttonStyles.js';

export default function DashboardPage() {
  const { data: clubs, isLoading, error } = useFetch('/me/clubs');

  return (
    <>
      <PageHeader
        eyebrow="Manage"
        title="Dashboard"
        description="Create events, track registrations and keep details up to date."
        actions={
          clubs?.length > 0 && (
            <Link to="/dashboard/events/new" className={buttonStyles()}>
              <Plus aria-hidden="true" />
              New event
            </Link>
          )
        }
      />
      {isLoading && <Spinner label="Loading your clubs…" />}
      {error && <ErrorState message={error} />}
      {clubs?.length === 0 && (
        <EmptyState icon={UsersRound} message="You do not manage any clubs yet." />
      )}
      {clubs?.map((club) => (
        <ClubEventsTable key={club.id} club={club} />
      ))}
    </>
  );
}
