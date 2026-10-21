// Clubs page: every club from GET /clubs.
import { UsersRound } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import ClubCard from '../components/ClubCard.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import CardGridSkeleton from '../components/ui/CardGridSkeleton.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

export default function ClubsPage() {
  const { data: clubs, isLoading, error } = useFetch('/clubs');

  return (
    <>
      <PageHeader
        eyebrow="Community"
        title="Clubs"
        description="The societies and councils that run events on campus."
      />
      {isLoading && <CardGridSkeleton count={3} label="Loading clubs…" />}
      {error && <ErrorState message={error} />}
      {clubs?.length === 0 && <EmptyState icon={UsersRound} message="No clubs yet." />}
      {clubs?.length > 0 && (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <li key={club.id} className="animate-rise">
              <ClubCard club={club} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
