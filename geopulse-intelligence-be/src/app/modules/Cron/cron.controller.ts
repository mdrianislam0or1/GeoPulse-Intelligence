import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../utils/catchAsync';
import logger from '../../../utils/logger';
import sendResponse from '../../../utils/sendResponse';
import { analysisService } from '../NewsAnalysis/analysis.service';
import { ingestionService } from '../NewsIngestion/ingestion.service';
import { retentionService } from '../NewsIngestion/retention.service';

/**
 * Verify the CRON_SECRET header to prevent unauthorized cron triggers.
 * Vercel sends the request with an Authorization: Bearer <CRON_SECRET> header.
 * In local dev (no secret set), all requests are allowed through.
 */
const verifyCronSecret = (req: Request, res: Response): boolean => {
  const cronSecret = process.env.CRON_SECRET;

  // No secret configured → allow in local dev
  if (!cronSecret || process.env.NODE_ENV === 'development') {
    return true;
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token !== cronSecret) {
    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message: 'Unauthorized cron trigger — invalid CRON_SECRET',
    });
    return false;
  }

  return true;
};

/**
 * Trigger news ingestion from all sources (called by Vercel Cron every 6h)
 * GET /api/cron/ingest
 */
export const triggerIngest = catchAsync(async (req: Request, res: Response) => {
  if (!verifyCronSecret(req, res)) return;

  logger.info('[Cron/Vercel] → triggerIngest starting...');
  const result = await ingestionService.fetchAll();
  logger.info(`[Cron/Vercel] Ingestion complete: ${JSON.stringify(result)}`);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'News ingestion complete',
    data: result,
  });
});

/**
 * Trigger AI analysis batch (called by Vercel Cron every 30min)
 * GET /api/cron/analysis
 */
export const triggerAnalysis = catchAsync(async (req: Request, res: Response) => {
  if (!verifyCronSecret(req, res)) return;

  logger.info('[Cron/Vercel] → triggerAnalysis starting...');
  const analyzed = await analysisService.analyzeBatch(10);
  logger.info(`[Cron/Vercel] Analysis complete: ${analyzed} articles analyzed`);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Analysis batch complete',
    data: { analyzed },
  });
});

/**
 * Trigger data retention cleanup (called by Vercel Cron daily at 3 AM)
 * GET /api/cron/retention
 */
export const triggerRetention = catchAsync(async (req: Request, res: Response) => {
  if (!verifyCronSecret(req, res)) return;

  logger.info('[Cron/Vercel] → triggerRetention starting...');
  const summarized = await retentionService.summarizeOldArticles();
  const orphaned = await retentionService.cleanupOrphanedArticles();
  await retentionService.archiveMonthlyStats();
  logger.info(`[Cron/Vercel] Retention complete: summarized=${summarized} orphaned=${orphaned}`);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Retention cleanup complete',
    data: { summarized, orphaned },
  });
});
