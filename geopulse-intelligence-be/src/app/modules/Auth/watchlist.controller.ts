import type { Request, Response } from 'express';
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
    message: 'Watchlist item created',
    data: result,
  });
});

const getWatchlists = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await watchlistService.getWatchlists(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Watchlist items retrieved',
    data: result,
  });
});

const deleteWatchlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  await watchlistService.deleteWatchlist(userId, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Watchlist item deleted',
    data: null,
  });
});

const getUserAlerts = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await watchlistService.getUserAlerts(
    userId,
    Number(req.query.page) || 1,
    Number(req.query.limit) || 20,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Alerts retrieved',
    meta: result.meta,
    data: result.alerts,
  });
});

const markAlertRead = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId as string;
  const result = await watchlistService.markAlertRead(userId, req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Alert marked as read',
    data: result,
  });
});

export const watchlistController = {
  createWatchlist,
  getWatchlists,
  deleteWatchlist,
  getUserAlerts,
  markAlertRead,
};
