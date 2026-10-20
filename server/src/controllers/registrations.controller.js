// HTTP layer for /api/v1/events/:id/registrations.
import * as registrationsService from '../services/registrations.service.js';

export async function create(req, res) {
  const registration = await registrationsService.registerForEvent(
    req.validated.params.id,
    req.validated.body,
  );
  res.status(201).json(registration);
}

export async function list(req, res) {
  res.json(await registrationsService.listRegistrants(req.validated.params.id));
}
