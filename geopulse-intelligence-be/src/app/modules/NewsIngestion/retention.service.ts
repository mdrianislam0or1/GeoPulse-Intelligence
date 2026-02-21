/* eslint-disable @typescript-eslint/no-explicit-any */
import cron from 'node-cron';
import logger from '../../../utils/logger';
import { ArticleAnalysis } from '../NewsAnalysis/models/ArticleAnalysis';
import { Article } from './models/Article';

/**
 * Remove raw content from articles older than 24 hours (keep metadata + summary)
 */
const summarizeOldArticles = async (): Promise<number> => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await Article.updateMany(
    {
      createdAt: { $lt: oneDayAgo },
      is_analyzed: true,
      content: { $ne: null, $exists: true },
    },
    {
      $set: { content: null }, // Remove raw content to save space
    },
  );

  if (result.modifiedCount > 0) {
    logger.info(`[Retention] Summarized ${result.modifiedCount} articles (removed raw content)`);
  }

  return result.modifiedCount;
};

/**
 * Clean up old articles without analysis (orphaned raw data)
 */
const cleanupOrphanedArticles = async (): Promise<number> => {
  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const result = await Article.deleteMany({
    createdAt: { $lt: threeDaysAgo },
    is_analyzed: false,
  });

  if (result.deletedCount > 0) {
    logger.info(`[Retention] Deleted ${result.deletedCount} orphaned articles`);
  }

  return result.deletedCount;
};

/**
 * Archive monthly aggregated stats
 */
const archiveMonthlyStats = async (): Promise<any> => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const stats = await ArticleAnalysis.aggregate([
    { $match: { analyzed_at: { $lt: thirtyDaysAgo } } },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: '%Y-%m', date: '$analyzed_at' } },
          category: '$classification.category',
        },
        count: { $sum: 1 },
        avgSentiment: { $avg: '$sentiment.polarity' },
        avgBias: { $avg: '$bias_score' },
        avgFakeProb: { $avg: '$fake_news_probability' },
      },
    },
  ]);

  logger.info(`[Retention] Monthly archive: ${stats.length} category/month groups`);
  return stats;
};

/**
 * Run all retention tasks (called by cron daily at 3 AM)
 */
const runRetention = async (): Promise<void> => {
  logger.info('🧹 [Retention] Starting data retention cleanup...');

  const summarized = await summarizeOldArticles();
  const orphaned = await cleanupOrphanedArticles();
  await archiveMonthlyStats();

  logger.info(`✅ [Retention] Complete: summarized=${summarized} orphaned=${orphaned}`);
};

/**
 * Initialize retention cron (daily at 3:00 AM)
 */
export const initRetentionCron = (): void => {
  const schedule = process.env.RETENTION_CRON || '0 3 * * *';
  logger.info(`🕐 Retention cron scheduled: "${schedule}"`);

  cron.schedule(schedule, async () => {
    try {
      await runRetention();
    } catch (error: any) {
      logger.error(`❌ [Retention] Failed: ${error.message}`);
    }
  });
};

export const retentionService = {
  summarizeOldArticles,
  cleanupOrphanedArticles,
  archiveMonthlyStats,
  runRetention,
};
