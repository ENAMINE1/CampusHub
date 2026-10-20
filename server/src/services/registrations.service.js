// Registration rules (SPEC.md FR-3.1), kept in memory for now.
// Video 64 replaces the seat counting with an atomic MongoDB update that is safe under load.
import { randomUUID } from 'node:crypto';
import ApiError from '../utils/ApiError.js';
import { findEventRecord } from './events.service.js';

const registrations = [];

export function registerForEvent(eventId, { name, email }) {
  const event = findEventRecord(eventId); // throws 404 if missing

  if (new Date() > new Date(event.registrationDeadline)) {
    throw new ApiError(
      422,
      'REGISTRATION_CLOSED',
      'Registration for this event has closed.',
    );
  }
  if (registrations.some((r) => r.eventId === eventId && r.email === email)) {
    throw new ApiError(
      409,
      'ALREADY_REGISTERED',
      'You are already registered for this event.',
    );
  }
  if (event.seatsTaken >= event.capacity) {
    throw new ApiError(422, 'EVENT_FULL', 'This event is full.');
  }

  event.seatsTaken += 1;
  const registration = { id: randomUUID(), eventId, name, email, status: 'registered' };
  registrations.push(registration);
  return registration;
}

export function listRegistrants(eventId) {
  findEventRecord(eventId);
  return registrations.filter((r) => r.eventId === eventId);
}
