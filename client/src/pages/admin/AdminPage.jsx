// Admin page (SPEC.md /admin): manage clubs and their admins, and see platform stats.
import { useState } from 'react';
import useFetch from '../../hooks/useFetch.js';
import ClubForm from '../../components/admin/ClubForm.jsx';
import StatsPanel from '../../components/admin/StatsPanel.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function AdminPage() {
  const { data: clubs, isLoading, error, reload } = useFetch('/admin/clubs');
  // null: closed; 'new': creating; a club object: editing that club.
  const [editing, setEditing] = useState(null);

  function handleSaved() {
    setEditing(null);
    reload();
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold text-slate-900 dark:text-slate-100">
        Admin
      </h1>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Clubs</h2>
        <Button onClick={() => setEditing('new')}>New club</Button>
      </div>
      {isLoading && <Spinner label="Loading clubs…" />}
      {error && <ErrorState message={error} />}
      <ul className="mb-10 grid gap-4 sm:grid-cols-2">
        {clubs?.map((club) => (
          <li key={club.id}>
            <Card className="h-full">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                {club.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Admins: {club.adminEmails.join(', ') || 'none yet'}
              </p>
              <Button
                variant="secondary"
                className="mt-3"
                onClick={() => setEditing(club)}
              >
                Edit
              </Button>
            </Card>
          </li>
        ))}
      </ul>
      <h2 className="mb-3 text-xl font-bold text-slate-900 dark:text-slate-100">Stats</h2>
      <Card>
        <StatsPanel />
      </Card>
      <Modal
        open={editing !== null}
        title={editing === 'new' ? 'New club' : 'Edit club'}
        onClose={() => setEditing(null)}
      >
        {/* key: a fresh form (and fresh state) for each club opened. */}
        {editing && (
          <ClubForm
            key={editing.id ?? 'new'}
            club={editing === 'new' ? null : editing}
            onSaved={handleSaved}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
    </>
  );
}
