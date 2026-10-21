// The image at the top of an event: its poster if it has one, otherwise a gradient with the
// category icon. A fixed aspect ratio reserves the space, so the page never jumps as images load.
import { assetUrl } from '../api/client.js';
import styleForCategory from '../data/categoryStyles.js';

export default function EventCover({ event, className = '', eager = false }) {
  const { icon: Icon, cover } = styleForCategory(event.category);

  return (
    <div className={`relative overflow-hidden bg-surface-muted ${className}`}>
      {event.posterUrl ? (
        <img
          src={assetUrl(event.posterUrl)}
          alt=""
          // lazy: images below the fold download only when scrolled near.
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <div
          aria-hidden="true"
          className={`grid size-full place-items-center bg-gradient-to-br ${cover} dark:brightness-[.85] dark:saturate-[.85]`}
        >
          <Icon className="size-10 text-white/85" strokeWidth={1.5} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgb(255_255_255/.28),transparent_55%)]" />
        </div>
      )}
    </div>
  );
}
