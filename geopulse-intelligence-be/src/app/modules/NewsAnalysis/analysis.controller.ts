import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { analysisService } from './analysis.service';

const getAnalyses = catchAsync(async (req: Request, res: Response) => {
  const result = await analysisService.getAnalyses({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    category: req.query.category as string,
    sentiment: req.query.sentiment as string,
    from_date: req.query.from_date as string,
    to_date: req.query.to_date as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analyses retrieved',
    meta: result.meta,
    data: result.analyses,
  });
});

const getAnalysisByArticleId = catchAsync(async (req: Request, res: Response) => {
  const analysis = await analysisService.getAnalysisByArticleId(req.params.articleId);
  if (!analysis) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Analysis not found for this article',
    });
    return;
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analysis retrieved',
    data: analysis,
  });
});

const triggerAnalysis = catchAsync(async (req: Request, res: Response) => {
  const { articleId, batchSize } = req.body;

  if (articleId) {
    const result = await analysisService.analyzeArticle(articleId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: result ? 'Article analyzed' : 'Analysis failed or article not found',
      data: result,
    });
  } else {
    const count = await analysisService.analyzeBatch(batchSize || 5);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Batch analysis complete: ${count} articles analyzed`,
      data: { analyzed: count },
    });
  }
});

export const analysisController = {
  getAnalyses,
  getAnalysisByArticleId,
  triggerAnalysis,
};
