import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { ingestionService } from './ingestion.service';

const getArticles = catchAsync(async (req: Request, res: Response) => {
  const result = await ingestionService.getArticles({
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 20,
    source_api: req.query.source_api as string,
    country: req.query.country as string,
    is_analyzed: req.query.is_analyzed === 'true' ? true : req.query.is_analyzed === 'false' ? false : undefined,
    search: req.query.search as string,
    from_date: req.query.from_date as string,
    to_date: req.query.to_date as string,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Articles retrieved',
    meta: result.meta,
    data: result.articles,
  });
});

const getArticleById = catchAsync(async (req: Request, res: Response) => {
  const article = await ingestionService.getArticleById(req.params.id);
  if (!article) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Article not found',
    });
    return;
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Article retrieved',
    data: article,
  });
});

const triggerIngestion = catchAsync(async (req: Request, res: Response) => {
  const source = req.body.source || 'all';

  if (source === 'all') {
    const results = await ingestionService.fetchAll();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Ingestion triggered for all sources',
      data: results,
    });
  } else {
    const result = await ingestionService.fetchFromSource(source);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Ingestion triggered for ${source}`,
      data: result,
    });
  }
});

export const ingestionController = {
  getArticles,
  getArticleById,
  triggerIngestion,
};
