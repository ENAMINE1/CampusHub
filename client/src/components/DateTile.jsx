// A small calendar-style tile ("OCT / 24") that makes a list of events easy to scan by date.
export default function DateTile({ iso }) {
  const date = new Date(iso);
  const month = date.toLocaleString('en-IN', { month: 'short' });

  return (
    <time
      dateTime={iso}
      className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-line bg-surface-muted leading-none"
    >
      <span className="text-[11px] font-semibold tracking-wider text-brand-600 uppercase dark:text-brand-300">
        {month}
      </span>
      <span className="mt-1 font-display text-xl font-bold">{date.getDate()}</span>
    </time>
  );
}
