import express from 'express';
import { auth } from '../../../middleware/auth';
import { watchlistController } from './watchlist.controller';

const router = express.Router();

// All routes are protected
router.use(auth());

/**
 * @route   POST /api/auth/watchlist
 * @desc    Create a new watchlist item
 */
router.post('/watchlist', watchlistController.createWatchlist);

/**
 * @route   GET /api/auth/watchlist
 * @desc    Get user's watchlist
 */
router.get('/watchlist', watchlistController.getMyWatchlist);

/**
 * @route   DELETE /api/auth/watchlist/:id
 * @desc    Remove a watchlist item
 */
router.delete('/watchlist/:id', watchlistController.removeWatchlist);

/**
 * @route   GET /api/auth/alerts
 * @desc    Get user's alerts
 */
router.get('/alerts', watchlistController.getMyAlerts);

/**
 * @route   PATCH /api/auth/alerts/:id/read
 * @desc    Mark an alert as read
 */
router.patch('/alerts/:id/read', watchlistController.markAlertAsRead);

export const watchlistRoutes = router;
