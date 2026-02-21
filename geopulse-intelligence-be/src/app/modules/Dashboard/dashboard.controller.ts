import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { dashboardService } from './dashboard.service';

const getDateRange = (req: Request) => ({
  from: req.query.from_date as string,
  to: req.query.to_date as string,
});

const getOverview = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getDashboardOverview(getDateRange(req));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Dashboard overview', data: result });
});

const getCategoryDistribution = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getCategoryDistribution(getDateRange(req));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Category distribution', data: result });
});

const getSentimentDistribution = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getSentimentDistribution(getDateRange(req));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Sentiment distribution', data: result });
});

const getDailyVolume = catchAsync(async (req: Request, res: Response) => {
  const days = Number(req.query.days) || 30;
  const result = await dashboardService.getDailyNewsVolume(days);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Daily volume', data: result });
});

const getCountryDistribution = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getCountryDistribution(getDateRange(req));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Country distribution', data: result });
});

const getSourceDistribution = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getSourceDistribution(getDateRange(req));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Source distribution', data: result });
});

const getCrisisIndex = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getCrisisIndex();
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Crisis index', data: result });
});

const getFakeNewsTrend = catchAsync(async (req: Request, res: Response) => {
  const days = Number(req.query.days) || 30;
  const result = await dashboardService.getFakeNewsTrend(days);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Fake news trend', data: result });
});

const getBiasTrends = catchAsync(async (req: Request, res: Response) => {
  const days = Number(req.query.days) || 30;
  const result = await dashboardService.getBiasTrends(days);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Bias trends', data: result });
});

const getTopicHeatmap = catchAsync(async (req: Request, res: Response) => {
  const result = await dashboardService.getTopicHeatmap(getDateRange(req));
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Topic heatmap', data: result });
});

export const dashboardController = {
  getOverview,
  getCategoryDistribution,
  getSentimentDistribution,
  getDailyVolume,
  getCountryDistribution,
  getSourceDistribution,
  getCrisisIndex,
  getFakeNewsTrend,
  getBiasTrends,
  getTopicHeatmap,
};
