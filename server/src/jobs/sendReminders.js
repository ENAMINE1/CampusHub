// The reminder job (SPEC.md FR-6.1): email everyone registered for an event that starts within
// the next 24 hours, once. A plain function with its inputs passed in (the time, the mailer),
// so tests can call it directly without waiting for a clock or a cron schedule.
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import config from '../config/index.js';
import formatEmailDate from '../utils/formatEmailDate.js';

const DAY_MS = 24 * 60 * 60 * 1000;

export default async function sendReminders({ now = new Date(), mailer }) {
  const soon = await Event.find({
    startsAt: { $gt: now, $lte: new Date(now.getTime() + DAY_MS) },
  })
    .select('title venue startsAt')
    .lean();
  let sent = 0;

  for (const event of soon) {
    const registrations = await Registration.find({
      event: event._id,
      status: 'registered',
      reminderSentAt: null,
    }).populate('user', 'name email');

    for (const registration of registrations) {
      // Claim the reminder BEFORE sending: if two job runs overlap, only one claim succeeds,
      // so nobody gets the same email twice.
      const claimed = await Registration.updateOne(
        { _id: registration._id, reminderSentAt: null },
        { reminderSentAt: now },
      );
      if (claimed.modifiedCount === 0) continue;

      await mailer.sendMail({
        from: config.emailFrom,
        to: registration.user.email,
        subject: `Reminder: ${event.title} starts soon`,
        text: `Hi ${registration.user.name},\n\n${event.title} starts ${formatEmailDate(event.startsAt)} at ${event.venue}.\n\nSee you there!\nCampusHub`,
      });
      sent += 1;
    }
  }
  return sent;
}
