// The error line under a form control. Its id is what the control's aria-describedby points to.
import { CircleAlert } from 'lucide-react';

export default function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p
      id={id}
      className="mt-1.5 flex items-center gap-1 text-sm text-red-700 dark:text-red-300"
    >
      <CircleAlert className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}
