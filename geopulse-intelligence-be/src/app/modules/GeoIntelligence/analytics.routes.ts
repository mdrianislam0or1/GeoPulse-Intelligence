import express from 'express';
import { auth } from '../../../middleware/auth';
import { analyticsController } from './analytics.controller';

const router = express.Router();

// GET /api/analytics/trends/:timeframe — daily/weekly/monthly/yearly
router.get('/trends/:timeframe', auth(), analyticsController.getTrends);

// GET /api/analytics/country-condition/:code — country condition report
router.get('/country-condition/:code', auth(), analyticsController.getCountryCondition);

// GET /api/analytics/predictions — AI-based predictions
router.get('/predictions', auth(), analyticsController.getPredictions);

// GET /api/analytics/anomalies — anomaly detection
router.get('/anomalies', auth(), analyticsController.getAnomalies);

// POST /api/analytics/generate-report — generate PDF report
router.post('/generate-report', auth('admin'), analyticsController.generateReport);

// GET /api/analytics/reports — list generated reports
router.get('/reports', auth(), analyticsController.getReports);

// GET /api/analytics/historical-comparison — historical comparison
router.get('/historical-comparison', auth(), analyticsController.getHistoricalComparison);

export const analyticsRoutes = router;
