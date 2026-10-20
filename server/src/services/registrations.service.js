// Registration rules (SPEC.md FR-3), stored in MongoDB through the Registration model.
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import ApiError from '../utils/ApiError.js';
import { findEventRecord, toEvent } from './events.service.js';

const DUPLICATE_KEY = 11000;

function toRegistration(doc) {
  return {
    id: doc._id.toString(),
    eventId: doc.event.toString(),
    userId: doc.user.toString(),
    status: doc.status,
    createdAt: doc.createdAt,
  };
}

// Why did the atomic update not match? Look again to send the right error.
async function explainNoSeat(eventId, user) {
  const event = await findEventRecord(eventId); // 404 if it does not exist
  const mine = await Registration.exists({
    event: eventId,
    user: user._id,
    status: 'registered',
  });
  if (mine) {
    throw new ApiError(
      409,
      'ALREADY_REGISTERED',
      'You are already registered for this event.',
    );
  }
  if (new Date() > event.registrationDeadline) {
    throw new ApiError(
      422,
      'REGISTRATION_CLOSED',
      'Registration for this event has closed.',
    );
  }
  throw new ApiError(422, 'EVENT_FULL', 'This event is full.');
}

export async function registerForEvent(eventId, user) {
  // ONE atomic step: "if a seat is free and registration is open, take it". MongoDB runs the check
  // and the $inc together, so two students can never both take the last seat (FR-3.2).
  // Classic mistake: read seatsTaken, compare in JavaScript, then save. Two requests can read the
  // same number at the same moment and both succeed.
  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      registrationDeadline: { $gte: new Date() },
      $expr: { $lt: ['$seatsTaken', '$capacity'] },
    },
    { $inc: { seatsTaken: 1 } },
    { returnDocument: 'after' },
  );
  if (!event) await explainNoSeat(eventId, user);

  try {
    return toRegistration(await Registration.create({ event: eventId, user: user._id }));
  } catch (err) {
    if (err.code !== DUPLICATE_KEY) throw err;
    // A document for this user and event already exists (the unique index said so).
    // Re-registering after cancelling flips it back and keeps the seat we just took.
    const flipped = await Registration.findOneAndUpdate(
      { event: eventId, user: user._id, status: 'cancelled' },
      { status: 'registered' },
      { returnDocument: 'after' },
    );
    if (flipped) return toRegistration(flipped);
    // Already registered: give the seat back.
    await Event.updateOne({ _id: eventId }, { $inc: { seatsTaken: -1 } });
    throw new ApiError(
      409,
      'ALREADY_REGISTERED',
      'You are already registered for this event.',
    );
  }
}

// Cancel (FR-3.3): allowed until the event starts; frees the seat.
export async function cancelRegistration(eventId, user) {
  const event = await findEventRecord(eventId);
  if (new Date() >= event.startsAt) {
    throw new ApiError(422, 'EVENT_STARTED', 'This event has already started.');
  }
  const cancelled = await Registration.findOneAndUpdate(
    { event: eventId, user: user._id, status: 'registered' },
    { status: 'cancelled' },
  );
  if (!cancelled) throw ApiError.notFound('You are not registered for this event.');
  // The seatsTaken > 0 guard stops the counter from ever going negative.
  await Event.updateOne(
    { _id: eventId, seatsTaken: { $gt: 0 } },
    { $inc: { seatsTaken: -1 } },
  );
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

// "My registrations" (SPEC.md FR-3.4): the user's active registrations with event details.
export async function listMyRegistrations(user, when) {
  const registrations = await Registration.find({ user: user._id, status: 'registered' })
    .sort({ createdAt: -1 })
    // Nested populate: fill in the event, and inside it the event's club.
    .populate({ path: 'event', populate: { path: 'club', select: 'name slug logoUrl' } })
    .lean();

  const now = new Date();
  return registrations
    .filter((r) => {
      if (when === 'upcoming') return r.event.startsAt >= now;
      if (when === 'past') return r.event.startsAt < now;
      return true;
    })
    .map((r) => ({
      id: r._id.toString(),
      registeredAt: r.createdAt,
      event: toEvent(r.event),
    }));
}
