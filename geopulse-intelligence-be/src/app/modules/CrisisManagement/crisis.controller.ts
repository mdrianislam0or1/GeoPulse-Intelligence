import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { crisisService } from './crisis.service';

const detectCrises = catchAsync(async (req: Request, res: Response) => {
  const results = await crisisService.autoDetectCrises();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${results.length} crisis event(s) detected`,
    data: results,
  });
});

const getCrisisStats = catchAsync(async (req: Request, res: Response) => {
  const stats = await crisisService.getCrisisStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Crisis statistics retrieved',
    data: stats,
  });
});

export const crisisController = {
  detectCrises,
  getCrisisStats,
};
