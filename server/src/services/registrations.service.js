// Registration rules (SPEC.md FR-3.1), stored in MongoDB through the Registration model.
import Registration from '../models/Registration.js';
import ApiError from '../utils/ApiError.js';
import { findEventRecord } from './events.service.js';

function toRegistration(doc) {
  return {
    id: doc._id.toString(),
    eventId: doc.event.toString(),
    userId: doc.user.toString(),
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

export async function registerForEvent(eventId, user) {
  const event = await findEventRecord(eventId); // throws 404 if missing

  if (new Date() > event.registrationDeadline) {
    throw new ApiError(
      422,
      'REGISTRATION_CLOSED',
      'Registration for this event has closed.',
    );
  }
  const existing = await Registration.findOne({ event: event._id, user: user._id });
  if (existing?.status === 'registered') {
    throw new ApiError(
      409,
      'ALREADY_REGISTERED',
      'You are already registered for this event.',
    );
  }
  if (event.seatsTaken >= event.capacity) {
    throw new ApiError(422, 'EVENT_FULL', 'This event is full.');
  }

  // Read, check, then write: two requests at the same moment could both pass the check above.
  // Video 64 fixes this race with one atomic update.
  event.seatsTaken += 1;
  await event.save();

  // Registering again after cancelling flips the old document back instead of adding a second one.
  if (existing) {
    existing.status = 'registered';
    await existing.save();
    return toRegistration(existing);
  }
  return toRegistration(await Registration.create({ event: event._id, user: user._id }));
}

export async function listRegistrants(eventId) {
  await findEventRecord(eventId);
  const registrations = await Registration.find({ event: eventId, status: 'registered' })
    .sort({ createdAt: 1 })
    .populate('user', 'name email')
    .lean();
  return registrations.map((r) => ({
    id: r._id.toString(),
    name: r.user.name,
    email: r.user.email,
    registeredAt: r.createdAt,
  }));
}
