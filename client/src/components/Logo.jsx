// The CampusHub mark and wordmark, used in the header and on the sign-in screen.
import { Link } from 'react-router';
import { Ticket } from 'lucide-react';

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      className={`group inline-flex items-center gap-2.5 rounded-lg font-display text-lg font-bold tracking-tight ${className}`}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm shadow-brand-700/30 transition group-hover:rotate-[-6deg]">
        <Ticket className="size-5" aria-hidden="true" />
      </span>
      CampusHub
    </Link>
  );
}
