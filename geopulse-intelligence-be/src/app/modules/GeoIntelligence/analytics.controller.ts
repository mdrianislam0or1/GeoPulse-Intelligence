import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { analyticsService } from './analytics.service';
import { geoService } from './geo.service';
import { Country } from './models/Country';
import { CrisisEvent } from './models/CrisisEvent';
import { StabilityMetrics } from './models/StabilityMetrics';

// GET /api/analytics/trends/:timeframe
const getTrends = catchAsync(async (req: Request, res: Response) => {
  const timeframe = req.params.timeframe as string;
  const daysMap: Record<string, number> = { daily: 1, weekly: 7, monthly: 30, yearly: 365 };
  const days = daysMap[timeframe] || 30;

  const data = await analyticsService.getStabilityTrends({ days });
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: `Trends for ${timeframe}`, data });
});

// GET /api/analytics/country-condition/:code
const getCountryCondition = catchAsync(async (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase();
  const country = await Country.findOne({ iso_code: code }).lean();
  if (!country) {
    return sendResponse(res, { statusCode: httpStatus.NOT_FOUND, success: false, message: 'Country not found' });
  }

  const stabilityScore = await geoService.computeStabilityScore(code);
  const trends = await analyticsService.getStabilityTrends({ country_code: code, days: 30 });
  const crises = await CrisisEvent.find({
    countries_affected: code,
    status: { $ne: 'resolved' },
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Country condition report',
    data: { country, stabilityScore, trends, activeCrises: crises },
  });
});

// GET /api/analytics/predictions
const getPredictions = catchAsync(async (_req: Request, res: Response) => {
  // AI-based prediction: countries likely to see instability
  const atRisk = await Country.find({ stability_score: { $lt: 35 } })
    .sort({ stability_score: 1 })
    .limit(10)
    .lean();

  const recentMetrics = await StabilityMetrics.aggregate([
    {
      $match: {
        date: { $gte: new Date(Date.now() - 7 * 24 * 3_600_000) },
      },
    },
    {
      $group: {
        _id: '$country_code',
        avgScore: { $avg: '$composite_score' },
        minScore: { $min: '$composite_score' },
        crisisTotal: { $sum: '$crisis_events' },
      },
    },
    { $match: { avgScore: { $lt: 40 } } },
    { $sort: { avgScore: 1 } },
    { $limit: 10 },
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI predictions',
    data: { atRiskCountries: atRisk, weeklyTrends: recentMetrics },
  });
});

// GET /api/analytics/anomalies
const getAnomalies = catchAsync(async (_req: Request, res: Response) => {
  const anomalies = await analyticsService.detectAnomalies();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Anomalies detected',
    data: anomalies,
  });
});

// POST /api/analytics/generate-report
const generateReport = catchAsync(async (req: Request, res: Response) => {
  const { country_code, region, title } = req.body;
  const reportTitle = title || `Report for ${country_code || region || 'Global'}`;

  // Gather data for the report
  const stabilityScore = country_code
    ? await geoService.computeStabilityScore(country_code)
    : null;

  const crises = await CrisisEvent.find(
    country_code
      ? { countries_affected: country_code.toUpperCase(), status: { $ne: 'resolved' } }
      : { status: { $ne: 'resolved' } },
  )
    .limit(10)
    .lean();

  const totalArticles = country_code
    ? (await StabilityMetrics.findOne({ country_code: country_code.toUpperCase() }).sort({ date: -1 }).lean())
        ?.article_count || 0
    : 0;

  analyticsService.generatePDFReport(res, {
    totalArticles,
    stabilityScore,
    crisisCount: crises.length,
    crises,
  }, reportTitle);
});

// GET /api/analytics/reports — list recent PDF metadata (since PDFs are streamed, this returns generation history)
const getReports = catchAsync(async (_req: Request, res: Response) => {
  // Since PDFs are streamed and not stored, we list recent stability metrics as "report data"
  const recentReportData = await StabilityMetrics.aggregate([
    { $sort: { date: -1 } },
    { $limit: 50 },
    {
      $group: {
        _id: '$country_code',
        latestDate: { $first: '$date' },
        latestScore: { $first: '$composite_score' },
        articleCount: { $first: '$article_count' },
      },
    },
    { $sort: { latestDate: -1 } },
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Available report data',
    data: recentReportData,
  });
});

// GET /api/analytics/historical-comparison
const getHistoricalComparison = catchAsync(async (req: Request, res: Response) => {
  const { country_code, days } = req.query;
  const daysNum = Number(days) || 90;

  const comparison = await analyticsService.getStabilityTrends({
    country_code: country_code as string,
    days: daysNum,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Historical comparison',
    data: comparison,
  });
});

export const analyticsController = {
  getTrends,
  getCountryCondition,
  getPredictions,
  getAnomalies,
  generateReport,
  getReports,
  getHistoricalComparison,
};
