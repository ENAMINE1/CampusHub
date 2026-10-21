// Admin page (SPEC.md /admin): manage clubs and their admins, and see platform stats.
import { useState } from 'react';
import { ChartColumn, Pencil, Plus } from 'lucide-react';
import useFetch from '../../hooks/useFetch.js';
import ClubForm from '../../components/admin/ClubForm.jsx';
import StatsPanel from '../../components/admin/StatsPanel.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { useToast } from '../../context/ToastContext.jsx';

export default function AdminPage() {
  const { data: clubs, isLoading, error, reload } = useFetch('/admin/clubs');
  // null: closed; 'new': creating; a club object: editing that club.
  const [editing, setEditing] = useState(null);

  const toast = useToast();

  function handleSaved() {
    toast.success(editing === 'new' ? 'Club created.' : 'Club updated.');
    setEditing(null);
    reload();
  }

  return (
    <>
      <PageHeader
        eyebrow="Platform"
        title="Admin"
        description="Manage clubs and who runs them, and see how events are doing."
        actions={
          <Button onClick={() => setEditing('new')}>
            <Plus aria-hidden="true" />
            New club
          </Button>
        }
      />
      <h2 className="mb-4 text-xl font-bold">Clubs</h2>
      {isLoading && <Spinner label="Loading clubs…" />}
      {error && <ErrorState message={error} />}
      <ul className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {clubs?.map((club) => (
          <li key={club.id}>
            <Card className="h-full">
              <h3 className="font-semibold">{club.name}</h3>
              <p className="mt-1 text-sm break-words text-ink-muted">
                Admins: {club.adminEmails.join(', ') || 'none yet'}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-4"
                onClick={() => setEditing(club)}
              >
                <Pencil aria-hidden="true" />
                Edit
              </Button>
            </Card>
          </li>
        ))}
      </ul>
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <ChartColumn className="size-5 text-brand-500" aria-hidden="true" />
        Stats
      </h2>
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
