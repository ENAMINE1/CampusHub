// Formats a date for an email, e.g. "Tue, 10 Nov 2026, 4:00 pm IST". Emails need the time zone,
// because the server and the reader may be in different places.
// (dateStyle/timeStyle cannot be combined with timeZoneName, so the parts are listed one by one.)
export default function formatEmailDate(date) {
  return new Date(date).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
    timeZoneName: 'short',
  });
}
