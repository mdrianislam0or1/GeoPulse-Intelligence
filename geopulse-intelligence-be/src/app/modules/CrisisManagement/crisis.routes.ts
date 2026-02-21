import express from 'express';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation.middleware';
import { crisisController } from './crisis.controller';
import {
    createCrisisSchema,
    notifyAlertsSchema,
    updateCrisisSchema,
} from './crisis.validation';

const router = express.Router();

router.get('/events', auth(), crisisController.getEvents);
router.post('/events', auth('admin'), validateRequest(createCrisisSchema), crisisController.createEvent);
router.get('/event/:id', auth(), crisisController.getEvent);
router.put('/event/:id', auth('admin'), validateRequest(updateCrisisSchema), crisisController.updateEvent);
router.post('/event/:id/verify', auth('admin'), crisisController.verifyEvent);
router.get('/early-warnings', auth(), crisisController.getEarlyWarnings);
router.get('/map', crisisController.getMapData); // public — for frontend map
router.post('/detect', auth('admin'), crisisController.detectCrises);
router.post('/alerts/notify', auth('admin'), validateRequest(notifyAlertsSchema), crisisController.notifyAlerts);

export const crisisRoutes = router;
