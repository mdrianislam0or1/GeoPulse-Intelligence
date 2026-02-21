/* eslint-disable @typescript-eslint/no-explicit-any */
import { getIO } from '../../../config/socket';
import { SOCKET_EVENTS } from '../../../socket/events';
import logger from '../../../utils/logger';
import { fetchAllCurrentsAPI } from './clients/currentsapi.client';
import { fetchAllGNews } from './clients/gnews.client';
import { fetchAllNewsAPI } from './clients/newsapi.client';
import { fetchAllRSS2JSON } from './clients/rss2json.client';
import type { IIngestionResult, IRawArticle } from './ingestion.interface';
import { Article } from './models/Article';

type SourceName = 'newsapi' | 'currentsapi' | 'gnews' | 'rss2json';

const SOURCE_FETCHERS: Record<SourceName, () => Promise<IRawArticle[]>> = {
  newsapi: fetchAllNewsAPI,
  currentsapi: fetchAllCurrentsAPI,
  gnews: fetchAllGNews,
  rss2json: fetchAllRSS2JSON,
};

/**
 * Save raw articles with deduplication (pre-check + unique index fallback)
 */
const saveArticles = async (
  rawArticles: IRawArticle[],
): Promise<{ saved: number; duplicates: number }> => {
  let saved = 0;
  let duplicates = 0;

  for (const raw of rawArticles) {
    // Skip articles with missing title or hash
    if (!raw.title?.trim() || !raw.content_hash?.trim()) {
      continue;
    }

    try {
      // Pre-check: does this content_hash already exist?
      const existing = await Article.findOne({ content_hash: raw.content_hash }).select('_id').lean();
      if (existing) {
        duplicates++;
        continue;
      }

      await Article.create({
        source_api: raw.source_api,
        title: raw.title,
        description: raw.description,
        content: raw.content,
        url: raw.url,
        image_url: raw.image_url,
        published_at: raw.published_at ? new Date(raw.published_at) : undefined,
        source_name: raw.source_name,
        author: raw.author,
        country: raw.country,
        language: raw.language,
        content_hash: raw.content_hash,
      });
      saved++;
    } catch (error: any) {
      // Fallback: catch E11000 duplicate key from concurrent inserts
      const isDuplicate =
        error?.code === 11000 ||
        error?.message?.includes('duplicate key') ||
        error?.message?.includes('E11000');
      if (isDuplicate) {
        duplicates++;
      } else {
        logger.error(`[Ingestion] Save error: ${error.message}`);
      }
    }
  }

  return { saved, duplicates };
};

/**
 * Fetch articles from a specific source
 */
const fetchFromSource = async (source: SourceName): Promise<IIngestionResult> => {
  const fetcher = SOURCE_FETCHERS[source];
  if (!fetcher) {
    logger.warn(`[Ingestion] Unknown source: ${source}`);
    return { source, fetched: 0, saved: 0, duplicates: 0, errors: 0, timestamp: new Date() };
  }

  try {
    const rawArticles = await fetcher();
    const { saved, duplicates } = await saveArticles(rawArticles);

    const result: IIngestionResult = {
      source,
      fetched: rawArticles.length,
      saved,
      duplicates,
      errors: rawArticles.length - saved - duplicates,
      timestamp: new Date(),
    };

    logger.info(`[Ingestion] ${source}: fetched=${result.fetched} saved=${result.saved} dups=${result.duplicates}`);
    return result;
  } catch (error: any) {
    logger.error(`[Ingestion] ${source} error: ${error.message}`);
    return { source, fetched: 0, saved: 0, duplicates: 0, errors: 1, timestamp: new Date() };
  }
};

/**
 * Fetch from all sources
 */
const fetchAll = async (): Promise<IIngestionResult[]> => {
  const sources: SourceName[] = ['newsapi', 'currentsapi', 'gnews', 'rss2json'];
  const results: IIngestionResult[] = [];

  for (const source of sources) {
    const result = await fetchFromSource(source);
    results.push(result);
  }

  // Emit socket event
  try {
    const io = getIO();
    const totalSaved = results.reduce((sum, r) => sum + r.saved, 0);
    io.emit(SOCKET_EVENTS.NEWS_INGESTED, {
      totalSaved,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch {
    logger.debug('[Ingestion] Socket not available for emit');
  }

  return results;
};

/**
 * Get recent articles with filtering
 */
const getArticles = async (query: {
  page?: number;
  limit?: number;
  source_api?: string;
  country?: string;
  is_analyzed?: boolean;
  search?: string;
  from_date?: string;
  to_date?: string;
}) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const filter: any = {};

  if (query.source_api) filter.source_api = query.source_api;
  if (query.country) filter.country = query.country.toUpperCase();
  if (query.is_analyzed !== undefined) filter.is_analyzed = query.is_analyzed;
  if (query.search) {
    filter.$text = { $search: query.search };
  }
  if (query.from_date || query.to_date) {
    filter.createdAt = {};
    if (query.from_date) filter.createdAt.$gte = new Date(query.from_date);
    if (query.to_date) filter.createdAt.$lte = new Date(query.to_date);
  }

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter),
  ]);

  return {
    articles,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get a single article by ID
 */
const getArticleById = async (articleId: string) => {
  return Article.findById(articleId).lean();
};

export const ingestionService = {
  fetchFromSource,
  fetchAll,
  getArticles,
  getArticleById,
  saveArticles,
};
