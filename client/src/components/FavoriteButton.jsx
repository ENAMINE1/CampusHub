// Heart toggle for one event. It reads favorites from Context, so no parent has to pass them down.
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function FavoriteButton({ eventId, title }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const pressed = isFavorite(eventId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(eventId)}
      aria-pressed={pressed}
      aria-label={`Favorite ${title}`}
      className="grid size-9 place-items-center rounded-full text-rose-600 transition hover:bg-rose-50 active:scale-90 dark:text-rose-400 dark:hover:bg-rose-500/15"
    >
      <Heart
        className={`size-[18px] transition-transform ${pressed ? 'scale-110 fill-current' : ''}`}
        aria-hidden="true"
      />
    </button>
  );
}
