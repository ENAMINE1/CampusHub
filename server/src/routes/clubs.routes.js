// URL map for /api/v1/clubs. Reading clubs is public.
import { Router } from 'express';
import * as clubsController from '../controllers/clubs.controller.js';
import validate from '../middleware/validate.js';
import { clubSlugParams } from '../validators/common.schemas.js';

const router = Router();

router.get('/', clubsController.list);
router.get('/:slug', validate({ params: clubSlugParams }), clubsController.getBySlug);

export default router;
