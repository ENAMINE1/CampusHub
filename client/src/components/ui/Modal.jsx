// Accessible modal built on the native <dialog> element.
// showModal() makes the rest of the page inert, so Tab stays inside the dialog (the focus trap),
// Esc closes it, and the browser returns focus to the button that opened it.
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, title, onClose, children }) {
  const dialogRef = useRef(null);

  // React describes what should be on screen; this effect syncs the real <dialog> with the `open` prop.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface p-6 text-ink shadow-lift backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm open:animate-rise"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="-m-1 rounded-lg p-1 text-ink-muted transition hover:bg-surface-muted hover:text-ink"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 text-sm text-ink-muted">{children}</div>
    </dialog>
  );
}
