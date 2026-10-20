// Accessible modal built on the native <dialog> element.
// showModal() makes the rest of the page inert, so Tab stays inside the dialog (the focus trap),
// Esc closes it, and the browser returns focus to the button that opened it.
import { useEffect, useRef } from 'react';

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
      className="m-auto w-full max-w-md rounded-xl bg-white dark:bg-slate-800 p-6 shadow-xl backdrop:bg-slate-900/60"
    >
      <h2
        id="modal-title"
        className="text-xl font-bold text-slate-900 dark:text-slate-100"
      >
        {title}
      </h2>
      <div className="mt-3 text-slate-700 dark:text-slate-300">{children}</div>
    </dialog>
  );
}
