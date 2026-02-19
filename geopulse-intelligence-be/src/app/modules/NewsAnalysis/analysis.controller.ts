import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { analysisService } from './analysis.service';

// POST /api/analysis/analyze/:articleId
const analyzeArticle = catchAsync(async (req: Request, res: Response) => {
  const { articleId } = req.params;
  const result = await analysisService.analyzeArticle(articleId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article analyzed successfully',
    data: result,
  });
});

// POST /api/analysis/batch-analyze
const batchAnalyze = catchAsync(async (_req: Request, res: Response) => {
  const result = await analysisService.batchAnalyzeUnprocessed();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Batch analysis complete',
    data: result,
  });
});

// GET /api/analysis/article/:id
const getArticleAnalysis = catchAsync(async (req: Request, res: Response) => {
  const analysis = await analysisService.getArticleAnalysis(req.params.id);
  if (!analysis) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Analysis not found for this article',
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analysis retrieved',
    data: analysis,
  });
});

// GET /api/analysis/trends/:timeframe
const getTrends = catchAsync(async (req: Request, res: Response) => {
  const timeframe = req.params.timeframe as 'daily' | 'weekly' | 'monthly';
  if (!['daily', 'weekly', 'monthly'].includes(timeframe)) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Invalid timeframe. Use: daily|weekly|monthly',
    });
  }
  const [topics, sentiment] = await Promise.all([
    analysisService.getTrendingTopics(timeframe),
    analysisService.getSentimentSummary(timeframe),
  ]);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Trends for ${timeframe}`,
    data: { topics, sentiment },
  });
});

export const analysisController = {
  analyzeArticle,
  batchAnalyze,
  getArticleAnalysis,
  getTrends,
};
