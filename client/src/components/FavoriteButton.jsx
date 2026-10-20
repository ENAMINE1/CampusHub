// Heart toggle for one event. It reads favorites from Context, so no parent has to pass them down.
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
      className="rounded-full p-1 text-xl leading-none text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
    >
      {pressed ? '♥' : '♡'}
    </button>
  );
}
