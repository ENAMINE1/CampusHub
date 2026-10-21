// Where toasts appear: top right under the header on desktop, full width on phones. (The
// bottom right corner belongs to the back-to-top button.)
// role="status" + aria-live reads each new message to screen-reader users without moving focus.
import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';

const TONES = {
  success: { icon: CircleCheck, color: 'text-emerald-500' },
  error: { icon: CircleAlert, color: 'text-red-500' },
  info: { icon: Info, color: 'text-brand-500' },
};

export default function Toaster({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-20 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:w-96"
    >
      {toasts.map(({ id, tone, message, leaving }) => {
        const { icon: Icon, color } = TONES[tone];
        return (
          <div
            key={id}
            role={tone === 'error' ? 'alert' : 'status'}
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border border-line bg-surface/95 p-4 text-sm shadow-lift backdrop-blur ${
              leaving ? 'animate-toast-out' : 'animate-toast-in'
            }`}
          >
            <Icon className={`mt-0.5 size-5 shrink-0 ${color}`} aria-hidden="true" />
            <p className="flex-1 font-medium text-ink">{message}</p>
            <button
              type="button"
              onClick={() => onDismiss(id)}
              aria-label="Dismiss"
              className="-m-1 rounded-lg p-1 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
