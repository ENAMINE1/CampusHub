// URL map for /api/v1/auth.
import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import validate from '../middleware/validate.js';
import { loginBody, registerBody } from '../validators/auth.schemas.js';

const router = Router();

router.post('/register', validate({ body: registerBody }), authController.register);
router.post('/login', validate({ body: loginBody }), authController.login);

export default router;
