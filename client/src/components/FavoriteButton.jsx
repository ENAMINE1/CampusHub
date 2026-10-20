// Heart toggle. aria-pressed tells screen readers whether the event is a favorite.
export default function FavoriteButton({ isFavorite, onToggle, title }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isFavorite}
      aria-label={`Favorite ${title}`}
      className="rounded-full p-1 text-xl leading-none text-rose-600 hover:bg-rose-50"
    >
      {isFavorite ? '♥' : '♡'}
    </button>
  );
}
