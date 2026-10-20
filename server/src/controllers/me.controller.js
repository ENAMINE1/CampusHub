// HTTP layer for /api/v1/me: things that belong to the logged-in user.
import * as registrationsService from '../services/registrations.service.js';
import * as favoritesService from '../services/favorites.service.js';
import * as clubsService from '../services/clubs.service.js';

export async function myRegistrations(req, res) {
  res.json(
    await registrationsService.listMyRegistrations(req.user, req.validated.query.when),
  );
}

export async function myFavorites(req, res) {
  res.json(await favoritesService.listFavorites(req.user));
}

export async function addFavorite(req, res) {
  await favoritesService.addFavorite(req.user, req.validated.params.eventId);
  res.status(204).end();
}

export async function removeFavorite(req, res) {
  await favoritesService.removeFavorite(req.user, req.validated.params.eventId);
  res.status(204).end();
}

// The clubs this user may manage: every club for an admin, their own for a club admin.
export async function myClubs(req, res) {
  res.json(await clubsService.listManagedClubs(req.user));
}
