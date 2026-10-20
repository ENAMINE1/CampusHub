// Events business logic, stored in MongoDB through the Event model.
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';
import ApiError from '../utils/ApiError.js';
import { clubExists } from './clubs.service.js';
import { findDateProblems } from '../validators/event.schemas.js';

// Shape a database document for the API: `id` instead of `_id`, no `__v`, the club as a small
// { id, name, slug } object (populated), and seatsLeft computed.
export function toEvent(doc) {
  const { _id, __v, club, ...fields } = doc;
  return {
    ...fields,
    id: _id.toString(),
    club: {
      id: club._id.toString(),
      name: club.name,
      slug: club.slug,
      logoUrl: club.logoUrl,
    },
    seatsLeft: fields.capacity - fields.seatsTaken,
  };
}

// Find the stored event document or throw a 404. Other services use it too.
export async function findEventRecord(id) {
  const event = await Event.findById(id);
  if (!event) throw ApiError.notFound('Event not found.');
  return event;
}

async function assertClubExists(clubId) {
  if (!(await clubExists(clubId))) {
    throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', [
      { location: 'body', path: 'club', message: 'No club with this id.' },
    ]);
  }
}

const SORTS = { date: { startsAt: 1 }, title: { title: 1 } };

export async function listEvents({ page, limit, sort, category, club, q, when }) {
  const filter = {};
  if (category) filter.category = category;
  if (club) filter.club = club;
  // $text uses the text index: it matches whole words ("git" finds "Git Workshop"), ignoring case.
  if (q) filter.$text = { $search: q };
  if (when === 'upcoming') filter.startsAt = { $gte: new Date() };
  if (when === 'past') filter.startsAt = { $lt: new Date() };

  // Run the page query and the count at the same time: neither needs the other's result.
  // populate() swaps each club id for the club's name and slug; lean() returns plain objects.
  const [events, total] = await Promise.all([
    Event.find(filter)
      .sort(SORTS[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('club', 'name slug')
      .lean(),
    Event.countDocuments(filter),
  ]);
  return { data: events.map(toEvent), page, totalPages: Math.ceil(total / limit), total };
}

export async function getEvent(id) {
  // Details also show the club's logo (SPEC.md FR-2.2).
  const event = await Event.findById(id).populate('club', 'name slug logoUrl').lean();
  if (!event) throw ApiError.notFound('Event not found.');
  return toEvent(event);
}

export async function createEvent(data, createdBy) {
  await assertClubExists(data.club);
  const event = await Event.create({ ...data, createdBy });
  return getEvent(event._id);
}

export async function updateEvent(id, changes) {
  const event = await findEventRecord(id);
  if (changes.club) await assertClubExists(changes.club);
  if (changes.capacity !== undefined && changes.capacity < event.seatsTaken) {
    throw new ApiError(
      422,
      'CAPACITY_TOO_LOW',
      'Capacity cannot go below seats already taken.',
    );
  }
  event.set(changes);

  // The new values may only make sense together (e.g. a new startsAt with the old endsAt).
  const problems = findDateProblems(event);
  if (problems.length > 0) {
    const details = problems.map((p) => ({ location: 'body', ...p }));
    throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', details);
  }
  await event.save();
  return getEvent(id);
}

export async function deleteEvent(id) {
  const deleted = await Event.findByIdAndDelete(id);
  if (!deleted) throw ApiError.notFound('Event not found.');
  // FR-2.4: registrations for a deleted event would point at nothing, so remove them too.
  await Registration.deleteMany({ event: id });
}
