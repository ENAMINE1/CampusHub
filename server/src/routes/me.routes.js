// URL map for /api/v1/me. Everything here needs a login, so requireAuth guards the whole router.
import { Router } from 'express';
import * as z from 'zod';
import * as meController from '../controllers/me.controller.js';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import { whenQuery } from '../validators/common.schemas.js';
import { objectId } from '../validators/event.schemas.js';

const favoriteParams = z.strictObject({ eventId: objectId });

const router = Router();
router.use(requireAuth);

router.get(
  '/registrations',
  validate({ query: whenQuery }),
  meController.myRegistrations,
);

router.get('/favorites', meController.myFavorites);
router.put(
  '/favorites/:eventId',
  validate({ params: favoriteParams }),
  meController.addFavorite,
);
router.delete(
  '/favorites/:eventId',
  validate({ params: favoriteParams }),
  meController.removeFavorite,
);

router.get('/clubs', requireRole('clubAdmin', 'admin'), meController.myClubs);

export default router;
