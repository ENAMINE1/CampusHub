// Small pill label, e.g. a category, "Full" or "Live".
const tones = {
  neutral: 'bg-surface-muted text-ink-muted ring-line',
  brand:
    'bg-brand-50 text-brand-700 ring-brand-100 dark:bg-brand-500/15 dark:text-brand-300 dark:ring-brand-500/25',
  success:
    'bg-emerald-50 text-emerald-800 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/25',
  warning:
    'bg-amber-50 text-amber-800 ring-amber-100 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/25',
  danger:
    'bg-red-50 text-red-800 ring-red-100 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-500/25',
};

export default function Badge({ tone = 'brand', className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset [&_svg]:size-3 ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
