// Register button for one event. A modal confirms, then the API decides: success, or an error
// like EVENT_FULL / ALREADY_REGISTERED that we show to the user.
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';
import { useRegistrations } from '../context/RegistrationsContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { apiFetch } from '../api/client.js';

export default function RegisterForEvent({ event, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { dispatch, isRegistered } = useRegistrations();
  const { user } = useAuth();
  const location = useLocation();

  async function confirm() {
    setIsSaving(true);
    setError('');
    try {
      // No body: the server knows who you are from your access token.
      await apiFetch(`/events/${event.id}/registrations`, { method: 'POST' });
      dispatch({ type: 'registered', event });
      onChange(); // reload the event so the seat count is fresh
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  }

  if (!user) {
    return (
      <Link
        to="/login"
        state={{ from: location.pathname }}
        className="font-semibold text-brand-700 underline dark:text-brand-300"
      >
        Log in to register
      </Link>
    );
  }
  if (user.role !== 'student') {
    return (
      <p className="text-slate-600 dark:text-slate-400">Only students can register.</p>
    );
  }
  if (isRegistered(event.id)) {
    return (
      <p role="status" className="font-semibold text-green-800 dark:text-green-300">
        You are registered for {event.title}.
      </p>
    );
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={event.seatsLeft <= 0}>
        {event.seatsLeft <= 0 ? 'Event full' : 'Register for this event'}
      </Button>
      {error && (
        <p role="alert" className="mt-3 text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <Modal open={isOpen} title="Confirm registration" onClose={() => setIsOpen(false)}>
        <p>Reserve one seat at {event.title}?</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirm} disabled={isSaving}>
            {isSaving ? 'Registering…' : 'Yes, register me'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
