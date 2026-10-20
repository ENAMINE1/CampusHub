// HTTP layer for /api/v1/clubs.
import * as clubsService from '../services/clubs.service.js';

export async function list(req, res) {
  res.json(await clubsService.listClubs());
}

export async function getBySlug(req, res) {
  res.json(await clubsService.getClubBySlug(req.validated.params.slug));
}
