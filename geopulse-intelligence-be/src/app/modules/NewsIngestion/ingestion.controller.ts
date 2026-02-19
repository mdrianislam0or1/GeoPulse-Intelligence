import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { ingestionService, SourceName } from './ingestion.service';

const VALID_SOURCES: SourceName[] = ['newsapi', 'currentsapi', 'gnews', 'rss2json'];

// POST /api/ingestion/fetch-all
const fetchAll = catchAsync(async (_req: Request, res: Response) => {
  const results = await ingestionService.fetchAllSources('manual');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All sources fetched successfully',
    data: results,
  });
});

// POST /api/ingestion/fetch/:source
const fetchOne = catchAsync(async (req: Request, res: Response) => {
  const source = req.params.source as SourceName;
  if (!VALID_SOURCES.includes(source)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `Invalid source. Valid options: ${VALID_SOURCES.join(', ')}`,
    });
  }
  const result = await ingestionService.fetchFromSource(source, 'manual');
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Fetched from ${source}`,
    data: result,
  });
});

// GET /api/ingestion/sources
const getSources = catchAsync(async (_req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Configured news sources',
    data: VALID_SOURCES,
  });
});

// GET /api/ingestion/status
const getStatus = catchAsync(async (_req: Request, res: Response) => {
  const status = await ingestionService.getPipelineStatus();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pipeline status retrieved',
    data: status,
  });
});

// GET /api/ingestion/api-usage
const getApiUsage = catchAsync(async (_req: Request, res: Response) => {
  const usage = await ingestionService.getApiUsageStatus();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'API usage retrieved',
    data: usage,
  });
});

// POST /api/ingestion/toggle/:source
const toggleSource = catchAsync(async (req: Request, res: Response) => {
  const source = req.params.source as SourceName;
  const { isActive } = req.body;
  if (!VALID_SOURCES.includes(source)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: `Invalid source. Valid: ${VALID_SOURCES.join(', ')}`,
    });
  }
  const result = await ingestionService.toggleSource(source, Boolean(isActive));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Source ${source} ${Boolean(isActive) ? 'enabled' : 'disabled'}`,
    data: result,
  });
});

export const ingestionController = {
  fetchAll,
  fetchOne,
  getSources,
  getStatus,
  getApiUsage,
  toggleSource,
};
