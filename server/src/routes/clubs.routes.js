// URL map for /api/v1/clubs. Reading clubs is public.
import { Router } from 'express';
import * as clubsController from '../controllers/clubs.controller.js';
import validate from '../middleware/validate.js';
import { publicFor } from '../middleware/cacheControl.js';
import { clubSlugParams } from '../validators/common.schemas.js';

const router = Router();
// Clubs change rarely: browsers may reuse a copy for 60 seconds.
router.use(publicFor(60));

router.get('/', clubsController.list);
router.get('/:slug', validate({ params: clubSlugParams }), clubsController.getBySlug);

export default router;
