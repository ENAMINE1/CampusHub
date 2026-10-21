// A small frosted label for event covers: "Tomorrow", "Happening now" (with a pulsing dot), "Ended".
import relativeDay from '../utils/relativeDay.js';

const DOTS = {
  live: 'bg-emerald-400',
  soon: 'bg-amber-400',
  upcoming: 'bg-white/80',
  past: 'bg-white/50',
};

export default function WhenChip({ startsAt, endsAt, className = '' }) {
  const { label, tone } = relativeDay(startsAt, endsAt);

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-slate-950/45 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md ${className}`}
    >
      <span className="relative flex size-1.5" aria-hidden="true">
        {tone === 'live' && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400" />
        )}
        <span className={`relative inline-flex size-1.5 rounded-full ${DOTS[tone]}`} />
      </span>
      {label}
    </span>
  );
}
