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

// POST /api/analysis/classify
const classify = catchAsync(async (req: Request, res: Response) => {
  const { articleId } = req.body;
  const result = await analysisService.classifyArticle(articleId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Article classified', data: result });
});

// POST /api/analysis/sentiment
const sentiment = catchAsync(async (req: Request, res: Response) => {
  const { articleId } = req.body;
  const result = await analysisService.sentimentAnalysis(articleId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Sentiment analysis complete', data: result });
});

// POST /api/analysis/bias-detection
const biasDetection = catchAsync(async (req: Request, res: Response) => {
  const { articleId } = req.body;
  const result = await analysisService.biasDetection(articleId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Bias detection complete', data: result });
});

// POST /api/analysis/fake-news-check
const fakeNewsCheck = catchAsync(async (req: Request, res: Response) => {
  const { articleId } = req.body;
  const result = await analysisService.fakeNewsCheck(articleId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Fake news check complete', data: result });
});

// POST /api/analysis/topic-modeling
const topicModelingHandler = catchAsync(async (req: Request, res: Response) => {
  const { articleId } = req.body;
  const result = await analysisService.topicModeling(articleId);
  sendResponse(res, { statusCode: httpStatus.OK, success: true, message: 'Topic modeling complete', data: result });
});

export const analysisController = {
  analyzeArticle,
  batchAnalyze,
  getArticleAnalysis,
  getTrends,
  classify,
  sentiment,
  biasDetection,
  fakeNewsCheck,
  topicModeling: topicModelingHandler,
};
