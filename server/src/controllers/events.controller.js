// Turns HTTP requests into service calls and service results into HTTP responses.
// Validation already happened in the validate middleware; errors are thrown as ApiError.
import * as eventsService from '../services/events.service.js';

export function list(req, res) {
  res.json(eventsService.listEvents(req.validated.query));
}

export function getById(req, res) {
  res.json(eventsService.getEvent(req.validated.params.id));
}

export function create(req, res) {
  res.status(201).json(eventsService.createEvent(req.validated.body));
}

export function update(req, res) {
  res.json(eventsService.updateEvent(req.validated.params.id, req.validated.body));
}

export function remove(req, res) {
  eventsService.deleteEvent(req.validated.params.id);
  res.status(204).end();
}
