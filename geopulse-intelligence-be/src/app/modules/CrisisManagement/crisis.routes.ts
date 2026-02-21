import express from 'express';
import { auth } from '../../../middleware/auth';
import { crisisController } from './crisis.controller';

const router = express.Router();

/**
 * @route   POST /api/crisis/detect
 * @desc    Trigger crisis detection (admin only)
 * @access  Admin
 */
router.post('/detect', auth('admin'), crisisController.detectCrises);

/**
 * @route   GET /api/crisis/stats
 * @desc    Get crisis statistics
 * @access  Private
 */
router.get('/stats', auth(), crisisController.getCrisisStats);

export const crisisRoutes = router;
