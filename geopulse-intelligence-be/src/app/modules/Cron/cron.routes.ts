import express from 'express';
import { triggerAnalysis, triggerIngest, triggerRetention } from './cron.controller';

const router = express.Router();

/**
 * Vercel Cron Job endpoints — called by Vercel's external scheduler.
 * No auth middleware here; security is handled inside the controller
 * via the CRON_SECRET header check.
 */

// News ingestion — runs every 6 hours (configured in vercel.json)
router.get('/ingest', triggerIngest);

// AI analysis batch — runs every 30 minutes
router.get('/analysis', triggerAnalysis);

// Data retention cleanup — runs daily at 3 AM
router.get('/retention', triggerRetention);

export const cronRoutes = router;
