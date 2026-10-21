// Error message box. role="alert" makes screen readers read it out straight away.
import { CircleAlert } from 'lucide-react';

export default function ErrorState({ message, title = 'Something went wrong' }) {
  return (
    <div
      role="alert"
      className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200"
    >
      <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-sm">{message}</p>
      </div>
    </div>
  );
}
