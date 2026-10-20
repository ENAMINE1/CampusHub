// Shown for any URL that no route matches.
import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
        Page not found
      </h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        That page does not exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-4 inline-block font-semibold text-brand-700 dark:text-brand-300 underline"
      >
        Go back home
      </Link>
    </div>
  );
}
