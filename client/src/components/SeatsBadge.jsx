// Seats-left line for the event details page. aria-live announces changes to screen readers.
export default function SeatsBadge({ seatsLeft, capacity, isLive }) {
  return (
    <p
      aria-live="polite"
      className="mt-6 mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100"
    >
      {seatsLeft > 0 ? `${seatsLeft} of ${capacity} seats left` : 'This event is full'}
      {isLive && (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-800 dark:text-green-300">
          <span className="size-2 rounded-full bg-green-600" aria-hidden="true" />
          live
        </span>
      )}
    </p>
  );
}
