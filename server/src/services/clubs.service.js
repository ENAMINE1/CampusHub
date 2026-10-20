// Clubs: listing, one club with its upcoming events, and the "who may manage which club" rule.
import Club from '../models/Club.js';
import Event from '../models/Event.js';
import ApiError from '../utils/ApiError.js';
import { toEvent } from './events.service.js';

function toClub(doc) {
  return {
    id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    logoUrl: doc.logoUrl,
  };
}

export async function listClubs() {
  const clubs = await Club.find().sort({ name: 1 }).lean();
  return clubs.map(toClub);
}

export async function getClubBySlug(slug) {
  const club = await Club.findOne({ slug }).lean();
  if (!club) throw ApiError.notFound('Club not found.');
  const upcoming = await Event.find({ club: club._id, startsAt: { $gte: new Date() } })
    .sort({ startsAt: 1 })
    .populate('club', 'name slug logoUrl')
    .lean();
  return { ...toClub(club), upcomingEvents: upcoming.map(toEvent) };
}

export async function clubExists(id) {
  return Boolean(await Club.exists({ _id: id }));
}

// Admins manage every club; a club admin only the clubs that list them in `admins` (SPEC.md FR-1.6).
export async function canManageClub(user, clubId) {
  if (user.role === 'admin') return true;
  if (user.role !== 'clubAdmin') return false;
  return Boolean(await Club.exists({ _id: clubId, admins: user._id }));
}
