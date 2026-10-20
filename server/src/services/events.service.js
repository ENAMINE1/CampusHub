// Events business logic. The data is an in-memory array loaded from data/events.json,
// so changes last until the server restarts. Video 59 swaps this for MongoDB.
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import ApiError from '../utils/ApiError.js';
import { findClubBySlug } from './clubs.service.js';
import { findDateProblems } from '../validators/event.schemas.js';

const dataFile = path.join(import.meta.dirname, '..', '..', 'data', 'events.json');
let events = JSON.parse(await readFile(dataFile, 'utf8'));

// seatsLeft is computed every time, never stored, so it can never drift from the real numbers.
function withSeatsLeft(event) {
  return { ...event, seatsLeft: event.capacity - event.seatsTaken };
}

// Find the stored event or throw a 404. Other services use it too.
export function findEventRecord(id) {
  const event = events.find((e) => e.id === id);
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

export function listEvents({ category, q, when } = {}) {
  const now = new Date();
  const search = (q ?? '').toLowerCase();
  return events
    .filter((e) => !category || e.category === category)
    .filter(
      (e) =>
        !search ||
        e.title.toLowerCase().includes(search) ||
        e.description.toLowerCase().includes(search),
    )
    .filter((e) => {
      if (when === 'upcoming') return new Date(e.startsAt) >= now;
      if (when === 'past') return new Date(e.startsAt) < now;
      return true;
    })
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .map(withSeatsLeft);
}

export function getEvent(id) {
  return withSeatsLeft(findEventRecord(id));
}

export function createEvent(data) {
  const event = {
    ...data,
    club: resolveClub(data.club),
    id: randomUUID(),
    seatsTaken: 0,
    posterUrl: '',
  };
  events.push(event);
  return withSeatsLeft(event);
}

export function updateEvent(id, changes) {
  const current = findEventRecord(id);
  const updated = { ...current, ...changes };
  if (changes.club) updated.club = resolveClub(changes.club);
  if (changes.capacity !== undefined && changes.capacity < current.seatsTaken) {
    throw new ApiError(
      422,
      'CAPACITY_TOO_LOW',
      'Capacity cannot go below seats already taken.',
    );
  }
  // The new values may only make sense together (e.g. a new startsAt with the old endsAt).
  const problems = findDateProblems(updated);
  if (problems.length > 0) {
    const details = problems.map((p) => ({ location: 'body', ...p }));
    throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', details);
  }
  Object.assign(current, updated);
  return withSeatsLeft(current);
}

export function deleteEvent(id) {
  findEventRecord(id);
  events = events.filter((e) => e.id !== id);
}
