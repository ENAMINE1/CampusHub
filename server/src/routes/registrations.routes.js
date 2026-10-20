// Routes nested under /api/v1/events/:id/registrations.
// mergeParams: true lets this router read :id from the parent path.
import { Router } from 'express';
import * as registrationsController from '../controllers/registrations.controller.js';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import requireEventOwner from '../middleware/requireEventOwner.js';
import { eventIdParams } from '../validators/event.schemas.js';

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
// Students register themselves; who they are comes from their access token.
router.post(
  '/',
  requireAuth,
  requireRole('student'),
  validate({ params: eventIdParams }),
  registrationsController.create,
);

// Cancel your own registration. '/me' means 'the logged-in user', so nobody can cancel for others.
router.delete(
  '/me',
  requireAuth,
  validate({ params: eventIdParams }),
  registrationsController.cancel,
);

export default router;
