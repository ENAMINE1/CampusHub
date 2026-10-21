// Accessible modal built on the native <dialog> element.
// showModal() makes the rest of the page inert, so Tab stays inside the dialog (the focus trap),
// and the browser returns focus to the button that opened it. Esc, the close button and a click
// on the dimmed backdrop all close it, with a short fade-out instead of a hard cut.
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const EXIT_MS = 150;

export default function Modal({ open, title, onClose, children }) {
  const dialogRef = useRef(null);

  // React describes what should be on screen; this effect syncs the real <dialog> with `open`.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) {
      dialog.showModal();
      return;
    }
    if (!open && dialog.open) {
      // Let the exit animation play (the data-closing attribute starts it), then really close.
      dialog.dataset.closing = '';
      const timer = setTimeout(() => {
        dialog.close();
        delete dialog.dataset.closing;
      }, EXIT_MS);
      return () => clearTimeout(timer);
    }
  }, [open]);

  function handleCancel(e) {
    e.preventDefault(); // Esc: close through onClose so the animation plays
    onClose();
  }

  function handleClick(e) {
    // A click on the <dialog> itself (not its content) is a click on the backdrop.
    if (e.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleClick}
      aria-labelledby="modal-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-line bg-surface p-0 text-ink shadow-lift backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm open:not-data-closing:animate-rise open:backdrop:animate-fade data-closing:animate-toast-out data-closing:backdrop:opacity-0"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-m-1 rounded-lg p-1 text-ink-muted transition hover:rotate-90 hover:bg-surface-muted hover:text-ink"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-3 text-sm text-ink-muted">{children}</div>
      </div>
    </dialog>
  );
}
