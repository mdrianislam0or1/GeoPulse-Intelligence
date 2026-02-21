import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import sendResponse from '../../../utils/sendResponse';
import { ingestionService, SourceName } from './ingestion.service';
import { Article } from './models/Article';

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

// GET /api/ingestion/articles
const getArticles = catchAsync(async (req: Request, res: Response) => {
  const {
    q,
    source_api,
    language,
    country,
    from,
    to,
    is_analyzed,
    limit = '20',
    page = '1',
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const filter: Record<string, any> = {};

  if (q) {
    filter.$text = { $search: q };
  }
  if (source_api) filter.source_api = source_api;
  if (language)   filter.language = language;
  if (country)    filter.country = country.toLowerCase();
  if (is_analyzed !== undefined) filter.is_analyzed = is_analyzed === 'true';
  if (from || to) {
    filter.published_at = {};
    if (from) filter.published_at.$gte = new Date(from);
    if (to)   filter.published_at.$lte = new Date(to);
  }

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort(q ? { score: { $meta: 'textScore' } } : { published_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .select('-__v')
      .lean(),
    Article.countDocuments(filter),
  ]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Articles retrieved',
    data: {
      articles,
      pagination: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    },
  });
});

export const ingestionController = {
  fetchAll,
  fetchOne,
  getSources,
  getStatus,
  getApiUsage,
  toggleSource,
  getArticles,
};
