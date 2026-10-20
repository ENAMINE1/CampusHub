// URL map for /api/v1/events. Each line pairs a method and path with a controller function.
import { Router } from 'express';
import * as eventsController from '../controllers/events.controller.js';

const router = Router();

router.get('/', eventsController.list);
router.get('/:id', eventsController.getById);
router.post('/', eventsController.create);
router.patch('/:id', eventsController.update);
router.delete('/:id', eventsController.remove);

export default router;
