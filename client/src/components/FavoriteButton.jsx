// Heart toggle for one event. It reads favorites from Context, so no parent has to pass them down.
// Switching it on plays a short "pop" so the click feels acknowledged.
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext.jsx';

export default function FavoriteButton({ eventId, title }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const pressed = isFavorite(eventId);
  // Counts the "on" clicks; used as a key so the pop animation restarts each time.
  const [pops, setPops] = useState(0);

  function handleClick() {
    if (!pressed) setPops((n) => n + 1);
    toggleFavorite(eventId);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={pressed}
      aria-label={`Favorite ${title}`}
      title={pressed ? 'Remove from favorites' : 'Add to favorites'}
      className="relative grid size-9 place-items-center rounded-full text-rose-600 transition hover:bg-rose-50 active:scale-90 dark:text-rose-400 dark:hover:bg-rose-500/15"
    >
      <Heart
        key={pops}
        className={`size-[18px] transition-[fill] duration-200 ${pressed ? 'animate-pop fill-current' : ''}`}
        aria-hidden="true"
      />
      {/* A ring that expands and fades once, like a ripple, when the heart turns on. */}
      {pressed && pops > 0 && (
        <span
          key={`ring-${pops}`}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 animate-[ping_0.6s_ease-out_1] rounded-full bg-rose-400/30"
        />
      )}
    </button>
  );
}
