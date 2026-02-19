import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { crisisService } from './crisis.service';

// GET /api/crisis/events
const getEvents = catchAsync(async (req: Request, res: Response) => {
  const status = (req.query.status as string) || 'active';
  const data = await crisisService.getActiveEvents(status);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Crisis events', data });
});

// POST /api/crisis/events
const createEvent = catchAsync(async (req: Request, res: Response) => {
  const data = await crisisService.createEvent(req.body);
  sendResponse(res, { statusCode: httpStatus.CREATED, success: true, message: 'Crisis event created', data });
});

// GET /api/crisis/event/:id
const getEvent = catchAsync(async (req: Request, res: Response) => {
  const data = await crisisService.getEventById(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Crisis event', data });
});

// PUT /api/crisis/event/:id
const updateEvent = catchAsync(async (req: Request, res: Response) => {
  const data = await crisisService.updateEvent(req.params.id, req.body);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Crisis event updated', data });
});

// POST /api/crisis/event/:id/verify
const verifyEvent = catchAsync(async (req: Request, res: Response) => {
  const data = await crisisService.verifyEvent(req.params.id);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Crisis event verified', data });
});

// GET /api/crisis/early-warnings
const getEarlyWarnings = catchAsync(async (_req: Request, res: Response) => {
  const data = await crisisService.generateEarlyWarnings();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Early warnings generated', data });
});

// GET /api/crisis/map
const getMapData = catchAsync(async (_req: Request, res: Response) => {
  const data = await crisisService.getMapData();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Crisis map data', data });
});

// POST /api/crisis/detect
const detectCrises = catchAsync(async (_req: Request, res: Response) => {
  const data = await crisisService.autoDetectCrises();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Auto-detected ${data.length} new crisis events`,
    data,
  });
});

export const crisisController = {
  getEvents,
  createEvent,
  getEvent,
  updateEvent,
  verifyEvent,
  getEarlyWarnings,
  getMapData,
  detectCrises,
};
