import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { geoService } from './geo.service';

// GET /api/geo/countries
const getAllCountries = catchAsync(async (_req: Request, res: Response) => {
  const data = await geoService.getAllCountries();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Countries retrieved',
    data,
  });
});

// GET /api/geo/country/:code
const getCountryDetail = catchAsync(async (req: Request, res: Response) => {
  const data = await geoService.getCountryDetail(req.params.code);
  if (!data) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: `Country '${req.params.code}' not found`,
    });
  }
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Country detail', data });
});

// GET /api/geo/stability-index/:code
const getStabilityIndex = catchAsync(async (req: Request, res: Response) => {
  const score = await geoService.computeStabilityScore(req.params.code);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stability index computed',
    data: { country: req.params.code.toUpperCase(), stability_score: score },
  });
});

// GET /api/geo/conflict-zones
const getConflictZones = catchAsync(async (_req: Request, res: Response) => {
  const data = await geoService.getConflictZones();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Conflict zones retrieved',
    data,
  });
});

// GET /api/geo/regional-analysis/:region
const getRegionalAnalysis = catchAsync(async (req: Request, res: Response) => {
  const data = await geoService.getRegionalAnalysis(req.params.region);
  if (!data) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: `No data found for region '${req.params.region}'`,
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Regional analysis',
    data,
  });
});

// GET /api/geo/heatmap-data
const getHeatmapData = catchAsync(async (_req: Request, res: Response) => {
  const data = await geoService.getHeatmapData();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Heatmap data',
    data,
  });
});

// POST /api/geo/correlate-events
const correlateEvents = catchAsync(async (req: Request, res: Response) => {
  const { countryCodes } = req.body;
  const data = await geoService.correlateEvents(countryCodes);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cross-border event correlations',
    data,
  });
});

export const geoController = {
  getAllCountries,
  getCountryDetail,
  getStabilityIndex,
  getConflictZones,
  getRegionalAnalysis,
  getHeatmapData,
  correlateEvents,
};
