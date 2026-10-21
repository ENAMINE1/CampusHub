// Friendly placeholder for a list with no items, with an optional action (a link or button).
import { Inbox } from 'lucide-react';

export default function EmptyState({ message, title, icon: Icon = Inbox, action }) {
  return (
    <div className="flex animate-fade flex-col items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-12 text-center">
      <span className="mb-4 grid size-12 animate-float place-items-center rounded-2xl bg-surface-muted text-ink-muted">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      {title && <p className="font-semibold text-ink">{title}</p>}
      <p className="mt-1 max-w-sm text-sm text-ink-muted">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
