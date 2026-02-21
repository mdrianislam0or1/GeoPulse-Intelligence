import cron from 'node-cron';
import logger from '../../../../utils/logger';
import { ingestionService } from '../ingestion.service';

// Default schedule: every 6 hours
const INGESTION_SCHEDULE = process.env.INGESTION_CRON || '0 */6 * * *';

/**
 * Initialize the news ingestion cron job
 */
export const initIngestionCron = (): void => {
  logger.info(`🕐 Ingestion cron scheduled: "${INGESTION_SCHEDULE}"`);

  cron.schedule(INGESTION_SCHEDULE, async () => {
    logger.info('🔄 [Cron] Starting scheduled news ingestion...');

    try {
      const results = await ingestionService.fetchAll();
      const totalFetched = results.reduce((s, r) => s + r.fetched, 0);
      const totalSaved = results.reduce((s, r) => s + r.saved, 0);
      const totalDuplicates = results.reduce((s, r) => s + r.duplicates, 0);

      logger.info(
        `✅ [Cron] Ingestion complete: fetched=${totalFetched} saved=${totalSaved} dups=${totalDuplicates}`,
      );
    } catch (error: any) {
      logger.error(`❌ [Cron] Ingestion failed: ${error.message}`);
    }
  });
};
