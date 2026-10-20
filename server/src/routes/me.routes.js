// URL map for /api/v1/me. Everything here needs a login, so requireAuth guards the whole router.
import { Router } from 'express';
import * as meController from '../controllers/me.controller.js';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import { whenQuery } from '../validators/common.schemas.js';

const router = Router();
router.use(requireAuth);

router.get(
  '/registrations',
  validate({ query: whenQuery }),
  meController.myRegistrations,
);

export default router;
