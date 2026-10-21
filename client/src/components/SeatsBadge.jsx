// Seats panel for the event details page: the meter plus a "Live" badge while the socket is
// connected. aria-live announces seat changes; a short highlight shows sighted users the change.
import { useState } from 'react';
import SeatsMeter from './SeatsMeter.jsx';
import Badge from './ui/Badge.jsx';

export default function SeatsBadge({ seatsLeft, capacity, isLive }) {
  // Count changes (not the first value), so the highlight plays only when seats actually move.
  const [previous, setPrevious] = useState(seatsLeft);
  const [changes, setChanges] = useState(0);
  if (previous !== seatsLeft) {
    setPrevious(seatsLeft);
    setChanges((n) => n + 1);
  }

  return (
    <div aria-live="polite" className="space-y-3">
      <div className="flex items-center justify-between">
        {/* key: each change remounts the line, which replays the flash animation. */}
        <p
          key={changes}
          className={`-mx-1.5 rounded-md px-1.5 text-sm font-semibold ${changes ? 'animate-flash' : ''}`}
        >
          {seatsLeft > 0
            ? `${seatsLeft} of ${capacity} seats left`
            : 'This event is full'}
        </p>
        {isLive && (
          <Badge tone="success">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Live
          </Badge>
        )}
      </div>
      <SeatsMeter seatsLeft={seatsLeft} capacity={capacity} />
    </div>
  );
}
