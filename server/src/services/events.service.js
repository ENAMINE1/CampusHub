// Events business logic, now stored in MongoDB through the Event model.
import Event from '../models/Event.js';
import ApiError from '../utils/ApiError.js';
import { findClubBySlug } from './clubs.service.js';
import { findDateProblems } from '../validators/event.schemas.js';

// Shape a database document for the API: `id` instead of `_id`, no `__v`, and seatsLeft computed.
function toEvent(doc) {
  const { _id, __v, ...fields } = doc;
  return {
    ...fields,
    id: _id.toString(),
    seatsLeft: fields.capacity - fields.seatsTaken,
  };
}

// User text goes into a regular expression, so escape characters like . * ( that have a meaning there.
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Find the stored event document or throw a 404. Other services use it too.
export async function findEventRecord(id) {
  const event = await Event.findById(id);
  if (!event) throw ApiError.notFound('Event not found.');
  return event;
}

function resolveClub(slug) {
  const club = findClubBySlug(slug);
  if (!club) {
    throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', [
      { location: 'body', path: 'club', message: `No club with slug "${slug}".` },
    ]);
  }
  return { name: club.name, slug: club.slug };
}

export async function listEvents({ category, q, when } = {}) {
  const filter = {};
  if (category) filter.category = category;
  if (q) {
    const pattern = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ title: pattern }, { description: pattern }];
  }
  if (when === 'upcoming') filter.startsAt = { $gte: new Date() };
  if (when === 'past') filter.startsAt = { $lt: new Date() };

  // lean() returns plain objects instead of full Mongoose documents: faster for read-only lists.
  const events = await Event.find(filter).sort({ startsAt: 1 }).lean();
  return events.map(toEvent);
}

export async function getEvent(id) {
  const event = await Event.findById(id).lean();
  if (!event) throw ApiError.notFound('Event not found.');
  return toEvent(event);
}

export async function createEvent(data) {
  const event = await Event.create({ ...data, club: resolveClub(data.club) });
  return toEvent(event.toObject());
}

export async function updateEvent(id, changes) {
  const event = await findEventRecord(id);
  if (changes.capacity !== undefined && changes.capacity < event.seatsTaken) {
    throw new ApiError(
      422,
      'CAPACITY_TOO_LOW',
      'Capacity cannot go below seats already taken.',
    );
  }
  const updates = { ...changes };
  if (updates.club) updates.club = resolveClub(updates.club); // slug in, { name, slug } stored
  event.set(updates);

  // The new values may only make sense together (e.g. a new startsAt with the old endsAt).
  const problems = findDateProblems(event);
  if (problems.length > 0) {
    const details = problems.map((p) => ({ location: 'body', ...p }));
    throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', details);
  }
  await event.save();
  return toEvent(event.toObject());
}

export async function deleteEvent(id) {
  const deleted = await Event.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('Event not found.');
}
