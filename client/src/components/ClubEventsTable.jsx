// One club's events on the dashboard, with registrant counts and edit / registrants / delete
// actions. Deleting asks for confirmation first, because it also removes every registration.
import { useState } from 'react';
import { Link } from 'react-router';
import useFetch from '../hooks/useFetch.js';
import { apiFetch } from '../api/client.js';
import Button from './ui/Button.jsx';
import Modal from './ui/Modal.jsx';
import Spinner from './ui/Spinner.jsx';
import ErrorState from './ui/ErrorState.jsx';
import EmptyState from './ui/EmptyState.jsx';
import formatDate from '../utils/formatDate.js';

const actionLink = 'font-semibold text-brand-700 underline dark:text-brand-300';

export default function ClubEventsTable({ club }) {
  // 50 is the API's maximum page size, plenty for one club's dashboard.
  const { data, isLoading, error, reload } = useFetch(`/events?club=${club.id}&limit=50`);
  const [toDelete, setToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  async function confirmDelete() {
    try {
      await apiFetch(`/events/${toDelete.id}`, { method: 'DELETE' });
      reload();
    } catch (err) {
      setDeleteError(err.message);
    }
    setToDelete(null);
  }

  return (
    <section className="mb-10" aria-labelledby={`club-${club.id}`}>
      <h2
        id={`club-${club.id}`}
        className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100"
      >
        {club.name}
      </h2>
      {isLoading && <Spinner label="Loading events…" />}
      {(error || deleteError) && <ErrorState message={error || deleteError} />}
      {data?.data.length === 0 && <EmptyState message="This club has no events yet." />}
      {data?.data.length > 0 && (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
          {data.data.map((event) => (
            <li
              key={event.id}
              className="flex flex-wrap items-center justify-between gap-3 p-4"
            >
              <div>
                <Link
                  to={`/events/${event.id}`}
                  className="font-semibold text-slate-900 hover:underline dark:text-slate-100"
                >
                  {event.title}
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(event.startsAt)} · {event.seatsTaken} of {event.capacity}{' '}
                  registered
                </p>
              </div>
              <div className="flex gap-3 text-sm">
                <Link to={`/dashboard/events/${event.id}/edit`} className={actionLink}>
                  Edit
                </Link>
                <Link
                  to={`/dashboard/events/${event.id}/registrations`}
                  className={actionLink}
                >
                  Registrants
                </Link>
                <button
                  type="button"
                  onClick={() => setToDelete(event)}
                  className="font-semibold text-red-700 underline dark:text-red-300"
                >
                  Delete
                </button>
              </div>
            </li>
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
          <Button variant="danger" onClick={confirmDelete}>
            Delete event
          </Button>
        </div>
      </Modal>
    </section>
  );
}
