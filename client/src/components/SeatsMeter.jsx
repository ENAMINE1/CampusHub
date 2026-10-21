// "12 seats left" with a thin bar showing how full the event is. Turns amber when almost full
// and red when full, so the state reads at a glance and in words (never colour alone).
export default function SeatsMeter({ seatsLeft, capacity }) {
  const taken = Math.min(100, Math.round(((capacity - seatsLeft) / capacity) * 100));
  const isFull = seatsLeft <= 0;
  const isLow = !isFull && seatsLeft / capacity <= 0.2;
  const tone = isFull ? 'bg-red-500' : isLow ? 'bg-amber-500' : 'bg-brand-500';

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span
          className={`font-semibold ${isFull ? 'text-red-700 dark:text-red-300' : isLow ? 'text-amber-700 dark:text-amber-300' : 'text-ink'}`}
        >
          {isFull ? 'Full' : `${seatsLeft} seats left`}
        </span>
        <span className="text-ink-muted tabular-nums">{capacity} total</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-surface-muted"
        aria-hidden="true"
      >
        <div
          className={`h-full rounded-full ${tone} transition-[width] duration-500`}
          style={{ width: `${taken}%` }}
        />
      </div>
    </div>
  );
}
