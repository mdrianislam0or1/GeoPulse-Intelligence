import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { User } from '../Auth/auth.model';
import { watchlistService } from '../Auth/watchlist.service';

// GET /api/users/watchlist
const getWatchlist = catchAsync(async (req: Request, res: Response) => {
  const data = await watchlistService.getMyWatchlist(req.user!.userId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Watchlist retrieved', data });
});

// POST /api/users/watchlist
const createWatchlist = catchAsync(async (req: Request, res: Response) => {
  const data = await watchlistService.createWatchlist(req.user!.userId, req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Watchlist item added', data });
});

// DELETE /api/users/watchlist/:id
const deleteWatchlist = catchAsync(async (req: Request, res: Response) => {
  await watchlistService.removeWatchlist(req.user!.userId, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Watchlist item removed' });
});

// GET /api/users/alerts
const getAlerts = catchAsync(async (req: Request, res: Response) => {
  const { is_read, limit } = req.query as Record<string, string>;
  const query: { is_read?: boolean; limit?: number } = {};
  if (is_read !== undefined) query.is_read = is_read === 'true';
  if (limit) query.limit = Math.min(100, parseInt(limit, 10) || 50);
  const data = await watchlistService.getMyAlerts(req.user!.userId, query);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Alerts retrieved', data });
});

// PATCH /api/users/alerts/:id/read
const markAlertRead = catchAsync(async (req: Request, res: Response) => {
  const data = await watchlistService.markAlertAsRead(req.user!.userId, req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Alert marked as read', data });
});

// DELETE /api/users/alerts/:id
const deleteAlert = catchAsync(async (req: Request, res: Response) => {
  const { UserAlert } = await import('../Auth/userAlert.model');
  const result = await UserAlert.findOneAndDelete({ _id: req.params.id, user_id: req.user!.userId });
  if (!result) {
    return sendResponse(res, { statusCode: httpStatus.NOT_FOUND, success: false, message: 'Alert not found' });
  }
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Alert deleted' });
});

// GET /api/users/preferences
const getPreferences = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId)
    .select('-password -refreshToken -emailVerificationToken -passwordResetToken -twoFactorSecret')
    .lean();
  if (!user) {
    return sendResponse(res, { statusCode: httpStatus.NOT_FOUND, success: false, message: 'User not found' });
  }
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'User preferences retrieved', data: user });
});

// PUT /api/users/preferences
const updatePreferences = catchAsync(async (req: Request, res: Response) => {
  // Only allow safe fields — never allow role/password/token changes here
  const { name, phone } = req.body as { name?: string; phone?: string };
  const updates: Record<string, any> = {};
  if (name && typeof name === 'string') updates.name = name.trim().substring(0, 100);
  if (phone && typeof phone === 'string') updates.phone = phone.trim().substring(0, 20);

  const user = await User.findByIdAndUpdate(
    req.user!.userId,
    { $set: updates },
    { new: true },
  )
    .select('-password -refreshToken -emailVerificationToken -passwordResetToken -twoFactorSecret')
    .lean();

  if (!user) {
    return sendResponse(res, { statusCode: httpStatus.NOT_FOUND, success: false, message: 'User not found' });
  }
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Preferences updated', data: user });
});

export const userController = {
  getWatchlist,
  createWatchlist,
  deleteWatchlist,
  getAlerts,
  markAlertRead,
  deleteAlert,
  getPreferences,
  updatePreferences,
};
