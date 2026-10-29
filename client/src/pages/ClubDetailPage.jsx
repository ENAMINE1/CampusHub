// One club (SPEC.md FR-4.1): its description and upcoming events, from GET /clubs/:slug.
import { Link, useParams } from 'react-router';
import useFetch from '../hooks/useFetch.js';
import EventList from '../components/EventList.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import buttonStyles from '../components/ui/buttonStyles.js';

export default function ClubDetailPage() {
  const { slug } = useParams();
  const { data: club, isLoading, error } = useFetch(`/clubs/${slug}`);

  return (
    <>
      {isLoading && <Spinner label="Loading club…" />}
      {error && (
        <>
          <ErrorState message={error} />
          <Link to="/clubs" className={buttonStyles({ variant: 'secondary' })}>
            Back to clubs
          </Link>
        </>
      )}
      {club && (
        <>
          <PageHeader
            eyebrow="Club"
            title={club.name}
            description={club.description || 'No description yet.'}
          />
          <h2 className="mb-4 text-xl font-bold">Upcoming events</h2>
          <EventList
            events={club.upcomingEvents}
            emptyMessage="This club has no upcoming events."
            headingAs="h3"
          />
        </>
      )}
    </>
  );
}
