// URL map for /api/v1/clubs. Reading clubs is public; creating and editing them is for admins.
import { Router } from 'express';
import * as clubsController from '../controllers/clubs.controller.js';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import { noStore, publicFor } from '../middleware/cacheControl.js';
import { clubSlugParams } from '../validators/common.schemas.js';
import {
  clubIdParams,
  createClubSchema,
  updateClubSchema,
} from '../validators/club.schemas.js';

const router = Router();
const adminOnly = [noStore, requireAuth, requireRole('admin')];

// Clubs change rarely: browsers may reuse a copy for 60 seconds.
router.get('/', publicFor(60), clubsController.list);
router.get(
  '/:slug',
  publicFor(60),
  validate({ params: clubSlugParams }),
  clubsController.getBySlug,
);

router.post('/', adminOnly, validate({ body: createClubSchema }), clubsController.create);
router.patch(
  '/:id',
  adminOnly,
  validate({ params: clubIdParams, body: updateClubSchema }),
  clubsController.update,
);

export default router;
