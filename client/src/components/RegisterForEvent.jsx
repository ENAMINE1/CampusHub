// "Register" button that asks for confirmation in a modal before reserving a seat.
import { useState } from 'react';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';

export default function RegisterForEvent({ event }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const isFull = event.capacity - event.seatsTaken <= 0;

  function confirm() {
    setIsRegistered(true);
    setIsOpen(false);
  }

  if (isRegistered) {
    return (
      <p role="status" className="font-semibold text-green-800 dark:text-green-300">
        You are registered for {event.title}.
      </p>
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
