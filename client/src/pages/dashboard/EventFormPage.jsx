// /dashboard/events/new and /dashboard/events/:id/edit: the same form, empty or filled in.
import { useNavigate, useParams } from 'react-router';
import useFetch from '../../hooks/useFetch.js';
import { apiFetch } from '../../api/client.js';
import EventForm from '../../components/EventForm.jsx';
import PosterUpload from '../../components/PosterUpload.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';
import { emptyEventForm, toFormValues } from '../../features/events/eventFormValues.js';

export default function EventFormPage() {
  const { id } = useParams(); // undefined when creating
  const navigate = useNavigate();
  const clubs = useFetch('/me/clubs');
  // Hooks cannot be skipped, so when creating we still call useFetch, for a tiny list we ignore.
  const existing = useFetch(id ? `/events/${id}` : '/events?limit=1');

  const error = clubs.error || (id && existing.error);
  if (error) return <ErrorState message={error} />;
  if (!clubs.data || (id && existing.data?.id !== id))
    return <Spinner label="Loading…" />;

  async function save(body) {
    await apiFetch(id ? `/events/${id}` : '/events', {
      method: id ? 'PATCH' : 'POST',
      body,
    });
    navigate('/dashboard');
  }

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={id ? 'Edit event' : 'New event'}
        description="Times are in your local time zone. Students see changes straight away."
      />
      <EventForm
        initialValues={id ? toFormValues(existing.data) : emptyEventForm}
        clubs={clubs.data}
        submitLabel={id ? 'Save changes' : 'Create event'}
        onSubmit={save}
      />
      {id && <PosterUpload eventId={id} posterUrl={existing.data.posterUrl} />}
    </>
  );
}
