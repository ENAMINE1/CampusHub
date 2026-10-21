// Create or edit a club (SPEC.md FR-4.2). Admin emails are typed comma-separated; the server
// checks that each one has an account and turns the students among them into club admins.
import { useState } from 'react';
import { apiFetch } from '../../api/client.js';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Textarea from '../ui/Textarea.jsx';

const toForm = (club) => ({
  name: club?.name ?? '',
  slug: club?.slug ?? '',
  description: club?.description ?? '',
  adminEmails: club?.adminEmails.join(', ') ?? '',
});

export default function ClubForm({ club, onSaved, onCancel }) {
  const [values, setValues] = useState(() => toForm(club));
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const field = (name) => ({
    id: `club-${name}`,
    name,
    value: values[name],
    error: errors[name],
    onChange: (e) => setValues({ ...values, [name]: e.target.value }),
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSaving(true);
    const emails = values.adminEmails.split(',').map((s) => s.trim());
    const body = { ...values, adminEmails: emails.filter(Boolean) };
    try {
      const path = club ? `/clubs/${club.id}` : '/clubs';
      await apiFetch(path, { method: club ? 'PATCH' : 'POST', body });
      onSaved();
    } catch (err) {
      // 422 details name the field; show each message next to its input.
      const pairs = err.details.map((d) => [d.path.split('.')[0], d.message]);
      setErrors(Object.fromEntries(pairs));
      setMessage(err.message);
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {message && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {message}
        </p>
      )}
      <Input label="Name" required {...field('name')} />
      <Input label="Slug (used in the URL)" required {...field('slug')} />
      <Textarea label="Description" {...field('description')} />
      <Input label="Admin emails (comma-separated)" {...field('adminEmails')} />
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save club'}
        </Button>
      </div>
    </form>
  );
}
