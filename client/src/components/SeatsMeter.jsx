// "12 seats left" with a thin bar showing how full the event is. Turns amber when almost full
// and red when full, so the state reads at a glance and in words (never colour alone).
// The bar grows in from empty on first show, and slides when the number changes.
import { useEffect, useState } from 'react';

function toneFor(seatsLeft, capacity) {
  if (seatsLeft <= 0)
    return { bar: 'bg-red-500', text: 'text-red-700 dark:text-red-300' };
  if (seatsLeft / capacity <= 0.2) {
    return { bar: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-300' };
  }
  return { bar: 'bg-brand-500', text: 'text-ink' };
}

export default function SeatsMeter({ seatsLeft, capacity }) {
  const taken = Math.min(100, Math.round(((capacity - seatsLeft) / capacity) * 100));
  const tone = toneFor(seatsLeft, capacity);
  // Start at 0 and set the real width one frame later, so the CSS transition animates it.
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setWidth(taken));
    return () => cancelAnimationFrame(frame);
  }, [taken]);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className={`font-semibold ${tone.text}`}>
          {seatsLeft <= 0 ? 'Full' : `${seatsLeft} seats left`}
        </span>
        <span className="text-ink-muted tabular-nums">{capacity} total</span>
      </div>
      <div
        className="h-1.5 overflow-hidden rounded-full bg-surface-muted"
        aria-hidden="true"
      >
        <div
          className={`h-full rounded-full ${tone.bar} transition-[width,background-color] duration-700 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
