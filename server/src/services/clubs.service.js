// Clubs, loaded once from data/clubs.json and kept in memory until MongoDB arrives in Video 60.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const dataFile = path.join(import.meta.dirname, '..', '..', 'data', 'clubs.json');
const clubs = JSON.parse(await readFile(dataFile, 'utf8'));

export function findClubBySlug(slug) {
  return clubs.find((club) => club.slug === slug) ?? null;
}
