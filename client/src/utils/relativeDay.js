// Turns an event's start and end into a friendly label: "Happening now", "Today", "Tomorrow",
// "In 5 days", "Ended". People decide faster with "Tomorrow" than with a date.
const DAY = 24 * 60 * 60 * 1000;

function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export default function relativeDay(startsAt, endsAt, now = new Date()) {
  const start = new Date(startsAt);
  const end = new Date(endsAt ?? startsAt);
  if (end < now) return { label: 'Ended', tone: 'past' };
  if (start <= now) return { label: 'Happening now', tone: 'live' };

  const days = Math.round((startOfDay(start) - startOfDay(now)) / DAY);
  if (days === 0) return { label: 'Today', tone: 'soon' };
  if (days === 1) return { label: 'Tomorrow', tone: 'soon' };
  if (days < 7) return { label: `In ${days} days`, tone: 'upcoming' };
  if (days < 14) return { label: 'Next week', tone: 'upcoming' };
  return { label: `In ${Math.round(days / 7)} weeks`, tone: 'upcoming' };
}
