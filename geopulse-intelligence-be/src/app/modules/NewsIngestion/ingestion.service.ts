import logger from '../../../utils/logger';
import { watchlistService } from '../Auth/watchlist.service';
import { fetchAllCurrentsAPI } from './clients/currentsapi.client';
import { fetchAllGNews } from './clients/gnews.client';
import { fetchAllNewsAPI } from './clients/newsapi.client';
import { fetchAllRSS2JSON } from './clients/rss2json.client';
import { ApiUsage } from './models/ApiUsage';
import { Article } from './models/Article';
import { IngestionLog } from './models/IngestionLog';

export type SourceName = 'newsapi' | 'currentsapi' | 'gnews' | 'rss2json';

interface FetchResult {
  source: SourceName;
  fetched: number;
  saved: number;
  duplicates: number;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
  duration_ms: number;
}

/**
 * Save normalized articles to MongoDB.
 * Skips duplicates via content_hash uniqueness constraint.
 */
const saveArticles = async (articles: any[]): Promise<{ saved: number; duplicates: number; newArticleIds: string[] }> => {
  let saved = 0;
  let duplicates = 0;
  const newArticleIds: string[] = [];

  for (const articleData of articles) {
    try {
      if (!articleData.title || !articleData.content_hash) {
        continue;
      }

      const result = await Article.findOneAndUpdate(
        { content_hash: articleData.content_hash },
        { $setOnInsert: articleData },
        { upsert: true, new: false }, // Returns null if inserted
      );

      if (result) {
        duplicates++;
      } else {
        const newDoc = await Article.findOne({ content_hash: articleData.content_hash });
        if (newDoc) {
          saved++;
          newArticleIds.push(newDoc._id.toString() as string);
        }
      }
    } catch (err: any) {
      if (err.code === 11000) {
        duplicates++;
      } else {
        logger.error('[Ingestion] Error saving article', { error: err.message, title: articleData.title });
      }
    }
  }

  return { saved, duplicates, newArticleIds };
};

/**
 * Fetch from a single source and save results.
 */
const fetchFromSource = async (
  source: SourceName,
  triggeredBy: 'cron' | 'manual' = 'cron',
): Promise<FetchResult> => {
  const startTime = Date.now();
  let articles: any[] = [];
  let status: FetchResult['status'] = 'success';
  let errorMsg: string | undefined;

  try {
    switch (source) {
      case 'newsapi':
        articles = await fetchAllNewsAPI();
        break;
      case 'currentsapi':
        articles = await fetchAllCurrentsAPI();
        if (articles.length === 0) status = 'skipped'; // rate limited
        break;
      case 'gnews':
        articles = await fetchAllGNews();
        break;
      case 'rss2json':
        articles = await fetchAllRSS2JSON();
        break;
    }
  } catch (err: any) {
    status = 'failed';
    errorMsg = err.message;
    logger.error(`[Ingestion] fetchFromSource(${source}) crashed`, { error: err.message });
  }

  const { saved, duplicates, newArticleIds } = status !== 'skipped' && status !== 'failed'
    ? await saveArticles(articles)
    : { saved: 0, duplicates: 0, newArticleIds: [] as string[] };

  // Trigger alert processing for each new article
  if (newArticleIds.length > 0) {
    // We process alerts asynchronously to not block the ingestion response
    Promise.all(newArticleIds.map(id => watchlistService.processArticleAlerts(id)))
      .catch(err => logger.error('[Ingestion] Error triggering article alerts', { error: err.message }));
  }

  const duration_ms = Date.now() - startTime;

  // Log to DB
  await IngestionLog.create({
    source_api: source,
    status,
    articles_fetched: articles.length,
    articles_saved: saved,
    articles_duplicate: duplicates,
    error_message: errorMsg,
    duration_ms,
    triggered_by: triggeredBy,
  });

  logger.info(`[Ingestion] ${source}: fetched=${articles.length}, saved=${saved}, dupes=${duplicates}, ${duration_ms}ms`);

  return {
    source,
    fetched: articles.length,
    saved,
    duplicates,
    status,
    error: errorMsg,
    duration_ms,
  };
};

/**
 * Fetch from all 4 sources.
 */
const fetchAllSources = async (triggeredBy: 'cron' | 'manual' = 'cron'): Promise<FetchResult[]> => {
  const sources: SourceName[] = ['newsapi', 'currentsapi', 'gnews', 'rss2json'];
  const results: FetchResult[] = [];

  for (const source of sources) {
    const result = await fetchFromSource(source, triggeredBy);
    results.push(result);
  }

  return results;
};

/**
 * Get current API usage status for all sources.
 */
const getApiUsageStatus = async () => {
  return ApiUsage.find({}).lean();
};

/**
 * Get ingestion pipeline status (recent logs).
 */
const getPipelineStatus = async () => {
  const logs = await IngestionLog.find({})
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const totalArticles = await Article.countDocuments();
  const unanalyzed = await Article.countDocuments({ is_analyzed: false });

  return {
    recentLogs: logs,
    totalArticles,
    unanalyzedArticles: unanalyzed,
  };
};

/**
 * Toggle a source on/off.
 */
const toggleSource = async (source: SourceName, isActive: boolean) => {
  const usage = await ApiUsage.findOneAndUpdate(
    { api_name: source },
    { is_active: isActive },
    { new: true },
  );
  return usage;
};

export const ingestionService = {
  fetchFromSource,
  fetchAllSources,
  getApiUsageStatus,
  getPipelineStatus,
  toggleSource,
};
