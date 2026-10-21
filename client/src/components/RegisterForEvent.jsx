// Register button for one event. A modal confirms, then the API decides: success, or an error
// like EVENT_FULL / ALREADY_REGISTERED that we show to the user.
import { useState } from 'react';
import { CircleCheck, Ticket } from 'lucide-react';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';
import ErrorState from './ui/ErrorState.jsx';
import { useRegistrations } from '../context/RegistrationsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../api/client.js';

export default function RegisterForEvent({ event, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { dispatch, isRegistered } = useRegistrations();
  const { user } = useAuth();

  // One function for both actions: call the API, update the shared list, reload the seats.
  async function run(request, action) {
    setIsSaving(true);
    setError('');
    try {
      await request();
      dispatch(action);
      onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  }

  const register = () =>
    // No body: the server knows who you are from your access token.
    run(() => apiFetch(`/events/${event.id}/registrations`, { method: 'POST' }), {
      type: 'registered',
      event,
    });
  const cancel = () =>
    run(() => apiFetch(`/events/${event.id}/registrations/me`, { method: 'DELETE' }), {
      type: 'cancelled',
      eventId: event.id,
    });

  if (user?.role !== 'student') {
    return (
      <p className="text-sm text-ink-muted">Only students can register for events.</p>
    );
  }

  return (
    <div className="space-y-3">
      {isRegistered(event.id) ? (
        <>
          <p
            role="status"
            className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-900 dark:bg-emerald-500/10 dark:text-emerald-200"
          >
            <CircleCheck className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            You are registered for {event.title}.
          </p>
          <Button
            variant="secondary"
            className="w-full"
            isLoading={isSaving}
            onClick={cancel}
          >
            Cancel registration
          </Button>
        </>
      ) : (
        <Button
          size="lg"
          className="w-full"
          onClick={() => setIsOpen(true)}
          disabled={event.seatsLeft <= 0}
        >
          <Ticket aria-hidden="true" />
          {event.seatsLeft <= 0 ? 'Event full' : 'Register for this event'}
        </Button>
      )}
      {error && <ErrorState title="That did not work" message={error} />}
      <Modal open={isOpen} title="Confirm registration" onClose={() => setIsOpen(false)}>
        <p>Reserve one seat at {event.title}?</p>
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
