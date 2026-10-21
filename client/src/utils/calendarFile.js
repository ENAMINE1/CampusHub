// Builds an .ics calendar file for one event, so students can add it to Google, Apple or Outlook
// calendars with one click. The file is made in the browser; nothing is sent anywhere.
const toIcsDate = (iso) =>
  new Date(iso).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

// Commas, semicolons and newlines have special meaning in .ics text, so escape them.
const escapeText = (text = '') =>
  text
    .replace(/\\/g, '\\\\')
    .replace(/([,;])/g, '\\$1')
    .replace(/\n/g, '\\n');

export default function downloadCalendarFile(event, pageUrl) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CampusHub//Events//EN',
    'BEGIN:VEVENT',
    `UID:${event.id}@campushub`,
    `DTSTAMP:${toIcsDate(new Date().toISOString())}`,
    `DTSTART:${toIcsDate(event.startsAt)}`,
    `DTEND:${toIcsDate(event.endsAt)}`,
    `SUMMARY:${escapeText(event.title)}`,
    `LOCATION:${escapeText(event.venue)}`,
    `DESCRIPTION:${escapeText(`${event.description}\n\n${pageUrl}`)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^\w]+/g, '-').toLowerCase()}.ics`;
  link.click();
  URL.revokeObjectURL(url);
}
