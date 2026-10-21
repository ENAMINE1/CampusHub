// Loading indicator. role="status" makes screen readers announce the label.
import { LoaderCircle } from 'lucide-react';

export default function Spinner({ label = 'Loading…', className = '' }) {
  return (
    <div
      role="status"
      className={`flex items-center justify-center gap-3 py-10 text-sm text-ink-muted ${className}`}
    >
      <LoaderCircle className="size-5 animate-spin text-brand-500" aria-hidden="true" />
      {label}
    </div>
  );
}
