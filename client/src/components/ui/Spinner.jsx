// Loading indicator. role="status" makes screen readers announce the label.
export default function Spinner({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex items-center gap-3 py-6 text-slate-600">
      <span className="size-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand-700" />
      {label}
    </div>
  );
}
