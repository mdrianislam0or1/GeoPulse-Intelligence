import express from 'express';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation.middleware';
import { dashboardController } from './dashboard.controller';
import { dashboardDateRangeValidation } from './dashboard.validation';

const router = express.Router();

const v = validateRequest(dashboardDateRangeValidation);

router.get('/overview', auth(), v, dashboardController.getOverview);
router.get('/categories', auth(), v, dashboardController.getCategoryDistribution);
router.get('/sentiment', auth(), v, dashboardController.getSentimentDistribution);
router.get('/volume', auth(), v, dashboardController.getDailyVolume);
router.get('/countries', auth(), v, dashboardController.getCountryDistribution);
router.get('/sources', auth(), v, dashboardController.getSourceDistribution);
router.get('/crisis-index', auth(), v, dashboardController.getCrisisIndex);
router.get('/fake-news', auth(), v, dashboardController.getFakeNewsTrend);
router.get('/bias', auth(), v, dashboardController.getBiasTrends);
router.get('/topics', auth(), v, dashboardController.getTopicHeatmap);

export const dashboardRoutes = router;
