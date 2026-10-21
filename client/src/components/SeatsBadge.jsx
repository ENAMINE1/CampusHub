// Seats panel for the event details page: the meter plus a "Live" badge while the socket is
// connected. aria-live announces seat changes to screen readers.
import { Radio } from 'lucide-react';
import SeatsMeter from './SeatsMeter.jsx';
import Badge from './ui/Badge.jsx';

export default function SeatsBadge({ seatsLeft, capacity, isLive }) {
  return (
    <div aria-live="polite" className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">
          {seatsLeft > 0
            ? `${seatsLeft} of ${capacity} seats left`
            : 'This event is full'}
        </p>
        {isLive && (
          <Badge tone="success">
            <Radio aria-hidden="true" className="animate-pulse" />
            Live
          </Badge>
        )}
      </div>
      <SeatsMeter seatsLeft={seatsLeft} capacity={capacity} />
    </div>
  );
}
