// Shown for any URL that no route matches.
import { Link } from 'react-router';
import { Compass, House } from 'lucide-react';
import buttonStyles from '../components/ui/buttonStyles.js';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center py-20 text-center animate-rise">
      <span className="mb-6 grid size-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-300">
        <Compass className="size-8" aria-hidden="true" />
      </span>
      <p className="text-sm font-semibold text-brand-600 dark:text-brand-300">404</p>
      <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Page not found</h1>
      <p className="mt-3 max-w-md text-ink-muted">
        That page does not exist or has moved.
      </p>
      <Link to="/" className={`${buttonStyles()} mt-8`}>
        <House aria-hidden="true" />
        Go back home
      </Link>
    </div>
  );
}
