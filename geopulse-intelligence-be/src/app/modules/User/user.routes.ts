import express from 'express';
import { auth } from '../../../middleware/auth';
import { userController } from './user.controller';

const router = express.Router();

// All user routes are protected
router.use(auth());

/**
 * Watchlist Endpoints
 */
// GET    /api/users/watchlist       — list user's watchlist
router.get('/watchlist', userController.getWatchlist);
// POST   /api/users/watchlist       — add item to watchlist
router.post('/watchlist', userController.createWatchlist);
// DELETE /api/users/watchlist/:id   — remove item from watchlist
router.delete('/watchlist/:id', userController.deleteWatchlist);

/**
 * Alert Endpoints
 */
// GET    /api/users/alerts          — list user's alerts
router.get('/alerts', userController.getAlerts);
// PATCH  /api/users/alerts/:id/read — mark alert as read
router.patch('/alerts/:id/read', userController.markAlertRead);
// DELETE /api/users/alerts/:id      — delete an alert
router.delete('/alerts/:id', userController.deleteAlert);

/**
 * Preferences Endpoints
 */
// GET    /api/users/preferences     — get user profile / preferences
router.get('/preferences', userController.getPreferences);
// PUT    /api/users/preferences     — update user preferences (name/phone only)
router.put('/preferences', userController.updatePreferences);

export const userRoutes = router;
