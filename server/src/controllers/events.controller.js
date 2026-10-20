// Turns HTTP requests into service calls and service results into HTTP responses.
// The service functions are async now (they talk to MongoDB), so every handler awaits them.
// Express 5 sends any rejected promise to the error handler for us.
import * as eventsService from '../services/events.service.js';

export async function list(req, res) {
  res.json(await eventsService.listEvents(req.validated.query));
}

export async function getById(req, res) {
  res.json(await eventsService.getEvent(req.validated.params.id));
}

export async function create(req, res) {
  res.status(201).json(await eventsService.createEvent(req.validated.body));
}

export async function update(req, res) {
  res.json(await eventsService.updateEvent(req.validated.params.id, req.validated.body));
}

export async function remove(req, res) {
  await eventsService.deleteEvent(req.validated.params.id);
  res.status(204).end();
}
