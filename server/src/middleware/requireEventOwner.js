// Lets the request through only if the user may manage the club that owns the event.
// Use it after requireAuth and validate. For a new event the club comes from the body;
// for an existing one, from the stored event (and from the body too if it is being moved).
import ApiError from '../utils/ApiError.js';
import { canManageClub } from '../services/clubs.service.js';
import { findEventRecord } from '../services/events.service.js';

export default function requireEventOwner(req, res, next) {
  const clubSlugs = [];
  if (req.validated.params?.id)
    clubSlugs.push(findEventRecord(req.validated.params.id).club.slug);
  if (req.validated.body?.club) clubSlugs.push(req.validated.body.club);

  if (!clubSlugs.every((slug) => canManageClub(req.user, slug))) {
    throw new ApiError(403, 'FORBIDDEN', 'You can only manage events of your own clubs.');
  }
  next();
}
