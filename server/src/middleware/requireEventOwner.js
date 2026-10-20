// Lets the request through only if the user may manage the club that owns the event.
// Use it after requireAuth and validate. For a new event the club comes from the body;
// for an existing one, from the stored event (and from the body too if it is being moved).
import ApiError from '../utils/ApiError.js';
import { canManageClub } from '../services/clubs.service.js';
import { findEventRecord } from '../services/events.service.js';

export default async function requireEventOwner(req, res, next) {
  const clubIds = [];
  if (req.validated.params?.id) {
    const event = await findEventRecord(req.validated.params.id);
    clubIds.push(event.club);
  }
  if (req.validated.body?.club) clubIds.push(req.validated.body.club);

  for (const clubId of clubIds) {
    if (!(await canManageClub(req.user, clubId))) {
      throw new ApiError(
        403,
        'FORBIDDEN',
        'You can only manage events of your own clubs.',
      );
    }
  }
  next();
}
