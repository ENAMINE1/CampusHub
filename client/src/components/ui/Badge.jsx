// Small pill label, e.g. a category or "Full".
const tones = {
  brand: 'bg-brand-50 dark:bg-slate-800 text-brand-700 dark:text-brand-300',
  success: 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200',
  danger: 'bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200',
};

export default function Badge({ tone = 'brand', children }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
