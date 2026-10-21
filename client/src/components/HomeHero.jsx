// The home page hero: greeting, headline, one line of context and the two main actions.
import { Link } from 'react-router';
import { CalendarDays, UsersRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import buttonStyles from './ui/buttonStyles.js';

export default function HomeHero() {
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0];

  return (
    <section className="relative mb-16 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-14 shadow-card sm:px-12 sm:py-20">
      {/* Decorative glow and dot grid, hidden from screen readers. */}
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 size-96 rounded-full bg-brand-500/20 blur-3xl dark:bg-brand-500/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(var(--line)_1px,transparent_1px)] [mask-image:linear-gradient(to_left,black,transparent_70%)] bg-[size:20px_20px]"
      />
      <div className="relative max-w-2xl animate-rise">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-canvas/70 px-3 py-1 text-xs font-semibold text-ink-muted">
          <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Welcome back{firstName ? `, ${firstName}` : ''}
        </p>
        <h1 className="text-4xl leading-[1.05] font-bold sm:text-6xl">
          What&rsquo;s happening on{' '}
          <span className="bg-gradient-to-r from-brand-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-brand-300 dark:to-fuchsia-300">
            campus
          </span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-ink-muted">
          Find events, join clubs and never miss a thing. Reserve your seat in one click.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/events" className={buttonStyles({ size: 'lg' })}>
            <CalendarDays aria-hidden="true" />
            Browse all events
          </Link>
          <Link
            to="/clubs"
            className={buttonStyles({ variant: 'secondary', size: 'lg' })}
          >
            <UsersRound aria-hidden="true" />
            Explore clubs
          </Link>
        </div>
      </div>
    </section>
  );
}
