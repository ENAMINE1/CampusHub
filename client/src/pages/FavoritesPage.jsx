// Favorites (SPEC.md FR-5.3): the events the student has hearted, from GET /me/favorites.
import { Link } from 'react-router';
import { Heart } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import EventList from '../components/EventList.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import CardGridSkeleton from '../components/ui/CardGridSkeleton.jsx';
import ErrorState from '../components/ui/ErrorState.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import buttonStyles from '../components/ui/buttonStyles.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function FavoritesPage() {
  const { data: events, isLoading, error } = useFetch('/me/favorites');
  const { isFavorite } = useFavorites();
  // Filter by the live favorites list, so un-hearting a card removes it without a reload.
  const shown = (events ?? []).filter((event) => isFavorite(event.id));

  return (
    <>
      <PageHeader
        eyebrow="Saved"
        title="Favorites"
        description="Events you have hearted, in one place."
      />
      {isLoading && <CardGridSkeleton count={3} label="Loading your favorites…" />}
      {error && <ErrorState message={error} />}
      {events && shown.length === 0 && (
        <EmptyState
          icon={Heart}
          message="You have no favorites yet."
          action={
            <Link to="/events" className={buttonStyles({ variant: 'secondary' })}>
              Find an event
            </Link>
          }
        />
      )}
      {shown.length > 0 && <EventList events={shown} />}
    </>
  );
}
