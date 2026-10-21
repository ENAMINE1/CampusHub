// "Featured clubs" on the home page (SPEC.md): the first three clubs, with a link to all.
import useFetch from '../hooks/useFetch.js';
import ClubCard from './ClubCard.jsx';
import SectionHeader from './ui/SectionHeader.jsx';

export default function FeaturedClubs() {
  const { data: clubs } = useFetch('/clubs');
  // Optional extra on the home page: if it fails, the section simply does not appear.
  if (!clubs?.length) return null;

  return (
    <section aria-labelledby="featured-clubs">
      <SectionHeader
        id="featured-clubs"
        title="Featured clubs"
        linkTo="/clubs"
        linkLabel="All clubs"
      />
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clubs.slice(0, 3).map((club) => (
          <li key={club.id} className="animate-rise">
            <ClubCard club={club} headingAs="h3" />
          </li>
        ))}
      </ul>
    </section>
  );
}
