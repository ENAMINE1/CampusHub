// URL map for /api/v1/events. Each line: method, path, validation, then the controller.
import { Router } from 'express';
import * as eventsController from '../controllers/events.controller.js';
import validate from '../middleware/validate.js';
import {
  createEventSchema,
  eventIdParams,
  listEventsQuery,
  updateEventSchema,
} from '../validators/event.schemas.js';

const router = Router();

router.get('/', validate({ query: listEventsQuery }), eventsController.list);
router.get('/:id', validate({ params: eventIdParams }), eventsController.getById);
router.post('/', validate({ body: createEventSchema }), eventsController.create);
router.patch(
  '/:id',
  validate({ params: eventIdParams, body: updateEventSchema }),
  eventsController.update,
);
router.delete('/:id', validate({ params: eventIdParams }), eventsController.remove);

export default router;
