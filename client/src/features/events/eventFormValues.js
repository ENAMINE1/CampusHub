// Converts between an event from the API and the values an HTML form can hold.
// <input type="datetime-local"> wants "2026-11-10T16:00" in local time, without a timezone,
// while the API speaks ISO strings in UTC.

function toLocalInput(iso) {
  if (!iso) return '';
  const date = new Date(iso);
  // Shift by the timezone offset so toISOString() prints local time, then drop seconds and "Z".
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

export const emptyEventForm = {
  title: '',
  description: '',
  category: 'tech',
  club: '',
  venue: '',
  startsAt: '',
  endsAt: '',
  registrationDeadline: '',
  capacity: '50',
};

export function toFormValues(event) {
  return {
    title: event.title,
    description: event.description,
    category: event.category,
    club: event.club.id,
    venue: event.venue,
    startsAt: toLocalInput(event.startsAt),
    endsAt: toLocalInput(event.endsAt),
    registrationDeadline: toLocalInput(event.registrationDeadline),
    capacity: String(event.capacity),
  };
}

// Returns the request body, or { errors } when a field is missing. The server checks the rest.
export function toRequestBody(values) {
  const errors = {};
  for (const field of [
    'title',
    'club',
    'venue',
    'startsAt',
    'endsAt',
    'registrationDeadline',
  ]) {
    if (!values[field].trim()) errors[field] = 'This field is required.';
  }
  if (!Number.isInteger(Number(values.capacity)) || Number(values.capacity) < 1) {
    errors.capacity = 'Enter a whole number of seats.';
  }
  if (Object.keys(errors).length > 0) return { errors };

  return {
    body: {
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
      venue: values.venue.trim(),
      startsAt: new Date(values.startsAt).toISOString(),
      endsAt: new Date(values.endsAt).toISOString(),
      registrationDeadline: new Date(values.registrationDeadline).toISOString(),
      capacity: Number(values.capacity),
    },
  };
}
