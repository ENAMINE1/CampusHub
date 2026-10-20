// URL map for /api/v1/auth.
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import { loginLimiter } from '../middleware/rateLimits.js';
import { noStore } from '../middleware/cacheControl.js';
import { loginBody, registerBody } from '../validators/auth.schemas.js';

const router = Router();
router.use(noStore); // tokens and user data must never be cached

router.post('/register', validate({ body: registerBody }), authController.register);
router.post('/login', loginLimiter, validate({ body: loginBody }), authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

export default router;
