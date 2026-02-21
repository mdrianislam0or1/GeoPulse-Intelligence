import express from 'express';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation.middleware';
import { watchlistController } from './watchlist.controller';
import {
    createWatchlistValidation,
    deleteWatchlistValidation,
    markAlertReadValidation,
} from './watchlist.validation';

const router = express.Router();

/**
 * @route   POST /api/auth/watchlist
 * @desc    Create watchlist item
 * @access  Private
 */
router.post(
  '/watchlist',
  auth(),
  validateRequest(createWatchlistValidation),
  watchlistController.createWatchlist,
);

/**
 * @route   GET /api/auth/watchlist
 * @desc    Get user's watchlist
 * @access  Private
 */
router.get('/watchlist', auth(), watchlistController.getWatchlists);

/**
 * @route   DELETE /api/auth/watchlist/:id
 * @desc    Delete watchlist item
 * @access  Private
 */
router.delete(
  '/watchlist/:id',
  auth(),
  validateRequest(deleteWatchlistValidation),
  watchlistController.deleteWatchlist,
);

/**
 * @route   GET /api/auth/alerts
 * @desc    Get user's alerts
 * @access  Private
 */
router.get('/alerts', auth(), watchlistController.getUserAlerts);

/**
 * @route   PATCH /api/auth/alerts/:id/read
 * @desc    Mark alert as read
 * @access  Private
 */
router.patch(
  '/alerts/:id/read',
  auth(),
  validateRequest(markAlertReadValidation),
  watchlistController.markAlertRead,
);

export const watchlistRoutes = router;
