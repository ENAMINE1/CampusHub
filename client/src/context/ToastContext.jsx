// Small pop-up messages ("Registered for Hack Night", "Could not save") shared through Context,
// so any component can confirm an action without owning its own message area.
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import Toaster from '../components/Toaster.jsx';

const ToastContext = createContext(null);
const VISIBLE_MS = 4000;
const EXIT_MS = 200; // matches --animate-toast-out, so the toast finishes sliding out first

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id) => {
    // Mark it as leaving to play the exit animation, then remove it.
    setToasts((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), EXIT_MS);
  }, []);

  const show = useCallback(
    (tone, message) => {
      const id = nextId.current++;
      // Keep at most three on screen: the oldest makes room for the newest.
      setToasts((list) => [...list.slice(-2), { id, tone, message }]);
      setTimeout(() => dismiss(id), VISIBLE_MS);
    },
    [dismiss],
  );

  // useMemo: the same object every render, so components using the hook do not re-render.
  const toast = useMemo(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
      info: (message) => show('info', message),
    }),
    [show],
  );

  return (
    <ToastContext value={toast}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext>
  );
}

// Outside a provider (a unit test rendering one component) toasts are simply skipped.
const silent = { success() {}, error() {}, info() {} };

export function useToast() {
  return useContext(ToastContext) ?? silent;
}
