import cron from 'node-cron';
import logger from '../../../../utils/logger';
import { ingestionService } from '../ingestion.service';

let initialized = false;

export const initIngestionCron = () => {
  if (initialized) return;
  initialized = true;

  // ── Every 6 hours: NewsAPI + GNews ───────────────────────
  cron.schedule('0 */6 * * *', async () => {
    logger.info('[CRON] Starting NewsAPI + GNews fetch...');
    try {
      await ingestionService.fetchFromSource('newsapi', 'cron');
      await ingestionService.fetchFromSource('gnews', 'cron');
      logger.info('[CRON] NewsAPI + GNews fetch complete');
    } catch (err: any) {
      logger.error('[CRON] NewsAPI + GNews fetch failed', { error: err.message });
    }
  });

  // ── Every 2 hours: CurrentsAPI (self-manages 20/day via ApiUsage) ────
  cron.schedule('0 */2 * * *', async () => {
    logger.info('[CRON] Starting CurrentsAPI fetch...');
    try {
      await ingestionService.fetchFromSource('currentsapi', 'cron');
      logger.info('[CRON] CurrentsAPI fetch complete');
    } catch (err: any) {
      logger.error('[CRON] CurrentsAPI fetch failed', { error: err.message });
    }
  });

  // ── Every 8 hours: RSS Bangladesh feeds ──────────────────
  cron.schedule('0 */8 * * *', async () => {
    logger.info('[CRON] Starting RSS BD feeds fetch...');
    try {
      await ingestionService.fetchFromSource('rss2json', 'cron');
      logger.info('[CRON] RSS BD fetch complete');
    } catch (err: any) {
      logger.error('[CRON] RSS BD fetch failed', { error: err.message });
    }
  });

  logger.info('✅ [CRON] News ingestion scheduler initialized');
};
