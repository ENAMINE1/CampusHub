// Home page: a hero with the main call to action, the next three events and featured clubs.
import EventList from '../components/EventList.jsx';
import FeaturedClubs from '../components/FeaturedClubs.jsx';
import HomeHero from '../components/HomeHero.jsx';
import useFetch from '../hooks/useFetch.js';
import CardGridSkeleton from '../components/ui/CardGridSkeleton.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';

export default function HomePage() {
  // Ask the server for exactly what we show: the next three upcoming events.
  const { data, isLoading, error } = useFetch('/events?when=upcoming&limit=3');

  return (
    <>
      <HomeHero />
      <section aria-labelledby="upcoming" className="mb-16">
        <SectionHeader
          id="upcoming"
          title="Coming up next"
          linkTo="/events"
          linkLabel="View all"
        />
        {isLoading && <CardGridSkeleton count={3} label="Loading events…" />}
        {error && <ErrorState message={error} />}
        {data && (
          <EventList
            events={data.data}
            headingAs="h3"
            emptyMessage="No upcoming events yet."
          />
        )}
      </section>
      <FeaturedClubs />
    </>
  );
}
