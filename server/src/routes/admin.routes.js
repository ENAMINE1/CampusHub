// URL map for /api/v1/admin. Admins only.
import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import * as clubsController from '../controllers/clubs.controller.js';
import requireAuth from '../middleware/requireAuth.js';
import { noStore } from '../middleware/cacheControl.js';
import requireRole from '../middleware/requireRole.js';

const router = Router();
router.use(noStore, requireAuth, requireRole('admin'));

router.get('/stats', adminController.stats);
// Like GET /clubs, plus each club's admin emails: only admins may see who runs what.
router.get('/clubs', clubsController.listWithAdmins);

export default router;
