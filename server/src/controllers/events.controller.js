// Turns HTTP requests into service calls and service results into HTTP responses.
// No business rules live here: those belong in the service.
import * as eventsService from '../services/events.service.js';

// Only these fields may come from the client. Copying them one by one stops a request from
// sneaking in fields like seatsTaken ("mass assignment").
const EDITABLE_FIELDS = [
  'title',
  'description',
  'category',
  'club',
  'venue',
  'startsAt',
  'endsAt',
  'registrationDeadline',
  'capacity',
];

function pickEditable(body) {
  const picked = {};
  for (const field of EDITABLE_FIELDS) {
    if (body[field] !== undefined) picked[field] = body[field];
  }
  return picked;
}

function sendNotFound(res) {
  res
    .status(404)
    .json({ error: { code: 'NOT_FOUND', message: 'Event not found.', details: [] } });
}

export function list(req, res) {
  const { category, q, when } = req.query;
  res.json(eventsService.listEvents({ category, q, when }));
}

export function getById(req, res) {
  const event = eventsService.getEvent(req.params.id);
  if (!event) return sendNotFound(res);
  res.json(event);
}

export function create(req, res) {
  const event = eventsService.createEvent(pickEditable(req.body));
  res.status(201).json(event);
}

export function update(req, res) {
  const event = eventsService.updateEvent(req.params.id, pickEditable(req.body));
  if (!event) return sendNotFound(res);
  res.json(event);
}

export function remove(req, res) {
  if (!eventsService.deleteEvent(req.params.id)) return sendNotFound(res);
  res.status(204).end();
}
