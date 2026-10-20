// Small pill label, e.g. a category or "Full".
const tones = {
  brand: 'bg-brand-50 text-brand-700',
  success: 'bg-green-100 text-green-900',
  danger: 'bg-red-100 text-red-900',
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
