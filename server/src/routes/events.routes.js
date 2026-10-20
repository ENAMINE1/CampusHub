// URL map for /api/v1/events. Each line: method, path, who may call it, validation, then the controller.
import { Router } from 'express';
import * as eventsController from '../controllers/events.controller.js';
import validate from '../middleware/validate.js';
import requireAuth from '../middleware/requireAuth.js';
import requireRole from '../middleware/requireRole.js';
import requireEventOwner from '../middleware/requireEventOwner.js';
import uploadPoster from '../middleware/uploadPoster.js';
import registrationsRouter from './registrations.routes.js';
import {
  createEventSchema,
  eventIdParams,
  listEventsQuery,
  updateEventSchema,
} from '../validators/event.schemas.js';

const router = Router();

// Anyone can read events.
router.get('/', validate({ query: listEventsQuery }), eventsController.list);
router.get('/:id', validate({ params: eventIdParams }), eventsController.getById);

// Only staff may change them, and only for their own clubs.
// The order matters: who are you (401), are you staff (403), is the input valid (422), is it your club (403).
const staffOnly = [requireAuth, requireRole('clubAdmin', 'admin')];

router.post(
  '/',
  staffOnly,
  validate({ body: createEventSchema }),
  requireEventOwner,
  eventsController.create,
);
router.patch(
  '/:id',
  staffOnly,
  validate({ params: eventIdParams, body: updateEventSchema }),
  requireEventOwner,
  eventsController.update,
);
router.delete(
  '/:id',
  staffOnly,
  validate({ params: eventIdParams }),
  requireEventOwner,
  eventsController.remove,
);

// Poster upload: check who you are and that the event is yours BEFORE reading the file.
router.post(
  '/:id/poster',
  staffOnly,
  validate({ params: eventIdParams }),
  requireEventOwner,
  uploadPoster,
  eventsController.uploadPoster,
);

// Nested resource: /api/v1/events/:id/registrations
router.use('/:id/registrations', registrationsRouter);

export default router;
