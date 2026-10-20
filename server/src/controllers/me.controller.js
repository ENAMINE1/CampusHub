// HTTP layer for /api/v1/me: things that belong to the logged-in user.
import * as registrationsService from '../services/registrations.service.js';

export async function myRegistrations(req, res) {
  res.json(
    await registrationsService.listMyRegistrations(req.user, req.validated.query.when),
  );
}
