// Turns an ISO date string into a short readable label, e.g. "Mon, 10 Nov, 4:00 pm".
export default function formatDate(isoString) {
  return new Date(isoString).toLocaleString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}
