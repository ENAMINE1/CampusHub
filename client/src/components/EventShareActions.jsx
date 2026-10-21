// Secondary actions on the event page: copy the link to share with friends, and add the event
// to your own calendar. Both confirm with a toast; the copy icon briefly turns into a tick.
import { useState } from 'react';
import { CalendarPlus, Check, Link2 } from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';
import downloadCalendarFile from '../utils/calendarFile.js';
import buttonStyles from './ui/buttonStyles.js';

const actionClass = `${buttonStyles({ variant: 'secondary', size: 'sm' })} flex-1`;

export default function EventShareActions({ event }) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const pageUrl = window.location.href;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      toast.success('Link copied. Share it with your friends.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy the link. Copy it from the address bar instead.');
    }
  }

  function addToCalendar() {
    downloadCalendarFile(event, pageUrl);
    toast.info('Calendar file downloaded. Open it to add the event.');
  }

  const CopyIcon = copied ? Check : Link2;

  return (
    <div className="flex gap-2">
      <button type="button" onClick={copyLink} className={actionClass}>
        <CopyIcon
          key={String(copied)}
          className={`animate-spin-in ${copied ? 'text-emerald-500' : ''}`}
          aria-hidden="true"
        />
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <button type="button" onClick={addToCalendar} className={actionClass}>
        <CalendarPlus aria-hidden="true" />
        Add to calendar
      </button>
    </div>
  );
}
