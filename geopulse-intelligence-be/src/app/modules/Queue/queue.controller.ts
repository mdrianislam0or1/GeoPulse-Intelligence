import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { queueService } from './queue.service';

const getQueueStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await queueService.getStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Queue statistics retrieved',
    data: stats,
  });
});

const getRecentTasks = catchAsync(async (req: Request, res: Response) => {
  const limit = Number(req.query.limit) || 20;
  const tasks = await queueService.getRecentTasks(limit);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recent tasks retrieved',
    data: tasks,
  });
});

export const queueController = {
  getQueueStats,
  getRecentTasks,
};
