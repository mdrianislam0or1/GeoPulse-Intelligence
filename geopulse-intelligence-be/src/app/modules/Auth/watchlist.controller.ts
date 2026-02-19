import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { watchlistService } from './watchlist.service';

const createWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await watchlistService.createWatchlist(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Watchlist item created successfully',
    data: result,
  });
});

const getMyWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await watchlistService.getMyWatchlist(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Watchlist retrieved successfully',
    data: result,
  });
});

const removeWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const { id } = req.params;
  const result = await watchlistService.removeWatchlist(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Watchlist item removed successfully',
    data: result,
  });
});

const getMyAlerts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const { is_read, limit } = req.query;

  const result = await watchlistService.getMyAlerts(userId, {
    is_read: is_read === 'true' ? true : is_read === 'false' ? false : undefined,
    limit: limit ? parseInt(limit as string) : undefined
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Alerts retrieved successfully',
    data: result,
  });
});

const markAlertAsRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const { id } = req.params;
  const result = await watchlistService.markAlertAsRead(userId, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Alert marked as read',
    data: result,
  });
});

export const watchlistController = {
  createWatchlist,
  getMyWatchlist,
  removeWatchlist,
  getMyAlerts,
  markAlertAsRead
};
