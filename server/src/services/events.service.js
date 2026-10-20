// Events business logic. The data is an in-memory array loaded from data/events.json,
// so changes last until the server restarts. Video 59 swaps this for MongoDB.
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const dataFile = path.join(import.meta.dirname, '..', '..', 'data', 'events.json');
let events = JSON.parse(await readFile(dataFile, 'utf8'));

// seatsLeft is computed every time, never stored, so it can never drift from the real numbers.
function withSeatsLeft(event) {
  return { ...event, seatsLeft: event.capacity - event.seatsTaken };
}

export function listEvents({ category, q, when } = {}) {
  const now = new Date();
  const search = (q ?? '').trim().toLowerCase();
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
  const event = events.find((e) => e.id === id);
  return event ? withSeatsLeft(event) : null;
}

export function createEvent(data) {
  const event = { ...data, id: randomUUID(), seatsTaken: 0, posterUrl: '' };
  events.push(event);
  return withSeatsLeft(event);
}

export function updateEvent(id, changes) {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  // id and seatsTaken are managed by the server, so a client can never overwrite them.
  events[index] = {
    ...events[index],
    ...changes,
    id,
    seatsTaken: events[index].seatsTaken,
  };
  return withSeatsLeft(events[index]);
}

export function deleteEvent(id) {
  const before = events.length;
  events = events.filter((e) => e.id !== id);
  return events.length < before;
}
