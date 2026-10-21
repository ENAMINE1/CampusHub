// Register button for one event. A modal confirms, then the API decides: success, or an error
// like EVENT_FULL / ALREADY_REGISTERED that we show to the user. Success is confirmed twice:
// a toast that comes and goes, and a lasting "you are registered" panel with an animated tick.
import { useState } from 'react';
import { CalendarDays, Lock, MapPin, Ticket } from 'lucide-react';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';
import ErrorState from './ui/ErrorState.jsx';
import AnimatedCheck from './ui/AnimatedCheck.jsx';
import { useRegistrations } from '../context/RegistrationsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { apiFetch } from '../api/client.js';
import formatDate from '../utils/formatDate.js';

export default function RegisterForEvent({ event, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { dispatch, isRegistered } = useRegistrations();
  const { user } = useAuth();
  const toast = useToast();

  const now = new Date();
  const isClosed = new Date(event.registrationDeadline) < now;
  const hasStarted = new Date(event.startsAt) <= now;
  const isFull = event.seatsLeft <= 0;

  // One function for both actions: call the API, update the shared list, reload the seats.
  async function run(request, action, successMessage) {
    setIsSaving(true);
    setError('');
    try {
      await request();
      dispatch(action);
      onChange();
      toast.success(successMessage);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  }

  const register = () =>
    // No body: the server knows who you are from your access token.
    run(
      () => apiFetch(`/events/${event.id}/registrations`, { method: 'POST' }),
      { type: 'registered', event },
      `You're in! A seat is saved for you at ${event.title}.`,
    );
  const cancel = () =>
    run(
      () => apiFetch(`/events/${event.id}/registrations/me`, { method: 'DELETE' }),
      { type: 'cancelled', eventId: event.id },
      'Registration cancelled. Your seat is free for someone else.',
    );

  if (user?.role !== 'student') {
    return (
      <p className="text-sm text-ink-muted">Only students can register for events.</p>
    );
  }

  let blockedLabel = '';
  if (isFull) blockedLabel = 'Event full';
  else if (isClosed) blockedLabel = 'Registration closed';

  return (
    <div className="space-y-3">
      {isRegistered(event.id) ? (
        <>
          <div className="flex animate-rise items-start gap-3 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200">
            <AnimatedCheck className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p role="status">You are registered for {event.title}.</p>
          </div>
          {!hasStarted && (
            <Button
              variant="secondary"
              className="w-full"
              isLoading={isSaving}
              onClick={cancel}
            >
              Cancel registration
            </Button>
          )}
        </>
      ) : (
        <Button
          size="lg"
          className="group w-full"
          onClick={() => setIsOpen(true)}
          disabled={Boolean(blockedLabel)}
        >
          {blockedLabel ? (
            <Lock aria-hidden="true" />
          ) : (
            <Ticket
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-rotate-12"
            />
          )}
          {blockedLabel || 'Register for this event'}
        </Button>
      )}
      {error && <ErrorState title="That did not work" message={error} />}
      <Modal open={isOpen} title="Confirm registration" onClose={() => setIsOpen(false)}>
        <p>Reserve one seat at {event.title}?</p>
        <ul className="mt-4 space-y-2 rounded-xl bg-surface-muted p-3 text-ink">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 text-ink-muted" aria-hidden="true" />
            {formatDate(event.startsAt)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 text-ink-muted" aria-hidden="true" />
            {event.venue}
          </li>
        </ul>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={register} isLoading={isSaving}>
            {isSaving ? 'Registering…' : 'Yes, register me'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
