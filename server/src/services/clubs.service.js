// Clubs, loaded once from data/clubs.json and kept in memory until MongoDB arrives in Video 60.
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const dataFile = path.join(import.meta.dirname, '..', '..', 'data', 'clubs.json');
const clubs = JSON.parse(await readFile(dataFile, 'utf8'));

export function findClubBySlug(slug) {
  return clubs.find((club) => club.slug === slug) ?? null;
}

// Admins manage every club; a club admin only the clubs that list their email (SPEC.md FR-1.6).
export function canManageClub(user, slug) {
  if (user.role === 'admin') return true;
  const club = findClubBySlug(slug);
  return (
    user.role === 'clubAdmin' && club !== null && club.adminEmails.includes(user.email)
  );
}
