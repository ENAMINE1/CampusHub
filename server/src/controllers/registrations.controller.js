// HTTP layer for /api/v1/events/:id/registrations.
import * as registrationsService from '../services/registrations.service.js';

export function create(req, res) {
  const registration = registrationsService.registerForEvent(
    req.validated.params.id,
    req.validated.body,
  );
  res.status(201).json(registration);
}

export function list(req, res) {
  res.json(registrationsService.listRegistrants(req.validated.params.id));
}
