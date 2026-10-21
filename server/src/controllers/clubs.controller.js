// HTTP layer for /api/v1/clubs and the admin club list.
import * as clubsService from '../services/clubs.service.js';

export async function list(req, res) {
  res.json(await clubsService.listClubs());
}

export async function getBySlug(req, res) {
  res.json(await clubsService.getClubBySlug(req.validated.params.slug));
}

export async function listWithAdmins(req, res) {
  res.json(await clubsService.listClubsWithAdmins());
}

export async function create(req, res) {
  res.status(201).json(await clubsService.createClub(req.validated.body));
}

export async function update(req, res) {
  res.json(await clubsService.updateClub(req.validated.params.id, req.validated.body));
}
