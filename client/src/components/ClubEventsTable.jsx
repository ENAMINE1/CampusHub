// One club's events on the dashboard, with registrant counts and edit / registrants / delete
// actions. Deleting asks for confirmation first, because it also removes every registration.
import { useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import useFetch from '../hooks/useFetch.js';
import { apiFetch } from '../api/client.js';
import ClubEventRow from './ClubEventRow.jsx';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';
import Spinner from './ui/Spinner.jsx';
import ErrorState from './ui/ErrorState.jsx';
import EmptyState from './ui/EmptyState.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function ClubEventsTable({ club }) {
  // 50 is the API's maximum page size, plenty for one club's dashboard.
  const { data, isLoading, error, reload } = useFetch(`/events?club=${club.id}&limit=50`);
  const [toDelete, setToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const toast = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  async function confirmDelete() {
    setIsDeleting(true);
    try {
      await apiFetch(`/events/${toDelete.id}`, { method: 'DELETE' });
      toast.success(`${toDelete.title} was deleted.`);
      reload();
    } catch (err) {
      setDeleteError(err.message);
    }
    setIsDeleting(false);
    setToDelete(null);
  }

  return (
    <section className="mb-12 animate-rise" aria-labelledby={`club-${club.id}`}>
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id={`club-${club.id}`} className="text-xl font-bold">
          {club.name}
        </h2>
        {data && <p className="text-sm text-ink-muted">{data.total} events</p>}
      </div>
      {isLoading && <Spinner label="Loading events…" />}
      {(error || deleteError) && <ErrorState message={error || deleteError} />}
      {data?.data.length === 0 && (
        <EmptyState icon={CalendarPlus} message="This club has no events yet." />
      )}
      {data?.data.length > 0 && (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {data.data.map((event) => (
            <ClubEventRow key={event.id} event={event} onDelete={setToDelete} />
          ))}
        </ul>
      )}
      <Modal
        open={toDelete !== null}
        title="Delete event?"
        onClose={() => setToDelete(null)}
      >
        <p>
          Delete {toDelete?.title}? Its registrations are deleted too. This cannot be
          undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setToDelete(null)}>
            Keep it
          </Button>
          <Button variant="danger" isLoading={isDeleting} onClick={confirmDelete}>
            Delete event
          </Button>
        </div>
      </Modal>
    </section>
  );
}
