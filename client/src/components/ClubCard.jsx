// One club: a monogram (or its logo), its name and description.
import { assetUrl } from '../api/client.js';
import Card from './ui/Card.jsx';

// headingAs: h2 on the clubs page, h3 inside a home page section, so headings never skip a level.
export default function ClubCard({ club, headingAs: Heading = 'h2' }) {
  return (
    <Card className="h-full">
      <div className="mb-4 flex items-center gap-3">
        {club.logoUrl ? (
          <img
            src={assetUrl(club.logoUrl)}
            alt=""
            width="48"
            height="48"
            loading="lazy"
            className="size-12 rounded-xl object-cover"
          />
        ) : (
          <span
            aria-hidden="true"
            className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-brand-100 to-brand-50 font-display text-lg font-bold text-brand-700 ring-1 ring-brand-100 ring-inset dark:from-brand-500/25 dark:to-brand-500/10 dark:text-brand-300 dark:ring-brand-500/20"
          >
            {club.name.charAt(0)}
          </span>
        )}
        <Heading className="text-lg font-semibold">{club.name}</Heading>
      </div>
      <p className="text-sm leading-relaxed text-ink-muted">
        {club.description || 'No description yet.'}
      </p>
    </Card>
  );
}
