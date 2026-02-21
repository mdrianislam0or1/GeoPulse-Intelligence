import express from 'express';
import { auth } from '../../../middleware/auth';
import { queueController } from './queue.controller';

const router = express.Router();

/**
 * @route   GET /api/queue/stats
 * @desc    Get queue statistics
 * @access  Admin
 */
router.get('/stats', auth('admin'), queueController.getQueueStats);

/**
 * @route   GET /api/queue/tasks
 * @desc    Get recent tasks
 * @access  Admin
 */
router.get('/tasks', auth('admin'), queueController.getRecentTasks);

export const queueRoutes = router;
