// Routes nested under /api/v1/events/:id/registrations.
// mergeParams: true lets this router read :id from the parent path.
import { Router } from 'express';
import * as registrationsController from '../controllers/registrations.controller.js';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import requireEventOwner from '../middleware/requireEventOwner.js';
import { eventIdParams } from '../validators/event.schemas.js';
import { registrationBody } from '../validators/registration.schemas.js';

const router = Router({ mergeParams: true });

// Registrant names and emails are personal data: only the event's owners may see them.
router.get(
  '/',
  requireAuth,
  requireRole('clubAdmin', 'admin'),
  validate({ params: eventIdParams }),
  requireEventOwner,
  registrationsController.list,
);
router.post(
  '/',
  validate({ params: eventIdParams, body: registrationBody }),
  registrationsController.create,
);

export default router;
