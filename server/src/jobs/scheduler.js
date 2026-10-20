// Runs the reminder job every 15 minutes. Only server.js starts it; tests call sendReminders directly.
import cron from 'node-cron';
import sendReminders from './sendReminders.js';
import { createMailer } from './mailer.js';

export function startScheduler() {
  const mailer = createMailer();
  // "*/15 * * * *" = every 15th minute of every hour. noOverlap skips a run if the last is still busy.
  return cron.schedule(
    '*/15 * * * *',
    async () => {
      const sent = await sendReminders({ mailer });
      if (sent > 0) console.log(`Reminder job: sent ${sent} email(s).`);
    },
    { noOverlap: true },
  );
}
