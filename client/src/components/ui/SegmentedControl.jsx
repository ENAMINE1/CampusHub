// A row of equal-width toggle buttons (e.g. Upcoming / Past) with a highlight that slides to the
// chosen one. Each option can show a count. aria-pressed tells screen readers which is chosen.
export default function SegmentedControl({ label, options, value, onChange }) {
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  return (
    <div
      role="group"
      aria-label={label}
      className="relative mb-6 inline-grid rounded-xl border border-line bg-surface-muted p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {/* The sliding highlight: one option wide, moved by its index. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-lg bg-surface shadow-card transition-transform duration-300 ease-out"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${index * 100}%)`,
        }}
      />
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors ${
              isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'
            }`}
          >
            {option.label}
            {option.count !== undefined && (
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300'
                    : 'bg-line/60 text-ink-muted'
                }`}
              >
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
