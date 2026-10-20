// Register / cancel controls for one event. A modal asks for confirmation before registering.
import { useState } from 'react';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';
import { useRegistrations } from '../context/RegistrationsContext.jsx';

export default function RegisterForEvent({ event }) {
  const [isOpen, setIsOpen] = useState(false);
  const { dispatch, isRegistered } = useRegistrations();
  const isFull = event.capacity - event.seatsTaken <= 0;

  function confirm() {
    dispatch({ type: 'registered', event });
    setIsOpen(false);
  }

  if (isRegistered(event.id)) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <p role="status" className="font-semibold text-green-800 dark:text-green-300">
          You are registered for {event.title}.
        </p>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: 'cancelled', eventId: event.id })}
        >
          Cancel registration
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} disabled={isFull}>
        {isFull ? 'Event full' : 'Register for this event'}
      </Button>
      <Modal open={isOpen} title="Confirm registration" onClose={() => setIsOpen(false)}>
        <p>Reserve one seat at {event.title}?</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={confirm}>Yes, register me</Button>
        </div>
      </Modal>
    </>
  );
}
