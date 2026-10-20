// URL map for /api/v1/admin. Admins only.
import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import { noStore } from '../middleware/cacheControl.js';
import requireRole from '../middleware/requireRole.js';

const router = Router();
router.use(noStore, requireAuth, requireRole('admin'));

router.get('/stats', adminController.stats);

export default router;
