// Create / edit event form. Required fields are checked here; the server checks every rule
// (dates in order, capacity range) and its 422 field errors are shown next to the right input.
import { useState } from 'react';
import Input from './ui/Input.jsx';
import Select from './ui/Select.jsx';
import Textarea from './ui/Textarea.jsx';
import Button from './ui/Button.jsx';
import ErrorState from './ui/ErrorState.jsx';
import FieldError from './ui/FieldError.jsx';
import categories from '../data/categories.js';
import { toRequestBody } from '../features/events/eventFormValues.js';

export default function EventForm({ initialValues, clubs, submitLabel, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const { body, errors: missing } = toRequestBody(values);
    setErrors(missing ?? {});
    setFormError('');
    if (missing) return;

    setIsSaving(true);
    try {
      await onSubmit(body);
    } catch (err) {
      // Turn [{ path: 'endsAt', message }] into { endsAt: message } for the inputs.
      const fieldErrors = {};
      for (const detail of err.details ?? []) fieldErrors[detail.path] = detail.message;
      setErrors(fieldErrors);
      setFormError(err.message);
      setIsSaving(false);
    }
  }

  const field = (name, label, props = {}) => (
    <Input
      id={`event-${name}`}
      name={name}
      label={label}
      value={values[name]}
      onChange={handleChange}
      error={errors[name]}
      {...props}
    />
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-3xl space-y-5 rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      {field('title', 'Title')}
      <Textarea
        id="event-description"
        name="description"
        label="Description"
        value={values.description}
        onChange={handleChange}
        error={errors.description}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          id="event-club"
          name="club"
          label="Club"
          value={values.club}
          onChange={handleChange}
        >
          <option value="">Choose a club</option>
          {clubs.map((club) => (
            <option key={club.id} value={club.id}>
              {club.name}
            </option>
          ))}
        </Select>
        <Select
          id="event-category-input"
          name="category"
          label="Category"
          value={values.category}
          onChange={handleChange}
        >
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
        {field('venue', 'Venue')}
        {field('capacity', 'Capacity', { type: 'number', min: 1, max: 5000 })}
        {field('startsAt', 'Starts', { type: 'datetime-local' })}
        {field('endsAt', 'Ends', { type: 'datetime-local' })}
        {field('registrationDeadline', 'Registration deadline', {
          type: 'datetime-local',
        })}
      </div>
      <FieldError id="event-club-error">{errors.club}</FieldError>
      {formError && <ErrorState title="Could not save the event" message={formError} />}
      <Button type="submit" isLoading={isSaving}>
        {isSaving ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
