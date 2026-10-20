// Clubs page: every club from GET /clubs.
import useFetch from '../hooks/useFetch.js';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import Card from '../components/ui/Card.jsx';

export default function ClubsPage() {
  const { data: clubs, isLoading, error } = useFetch('/clubs');

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Clubs
      </h1>
      {isLoading && <Spinner label="Loading clubs…" />}
      {error && <ErrorState message={error} />}
      {clubs?.length === 0 && <EmptyState message="No clubs yet." />}
      {clubs?.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clubs.map((club) => (
            <li key={club.id}>
              <Card>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {club.name}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {club.description || 'No description yet.'}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
