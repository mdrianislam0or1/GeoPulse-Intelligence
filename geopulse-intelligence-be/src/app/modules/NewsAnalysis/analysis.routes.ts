import express from 'express';
import { auth } from '../../../middleware/auth';
import { analysisController } from './analysis.controller';

const router = express.Router();

/**
 * @route  POST /api/analysis/analyze/:articleId
 * @desc   Trigger AI analysis for a single article
 * @access Admin
 */
router.post('/analyze/:articleId', auth('admin'), analysisController.analyzeArticle);

/**
 * @route  POST /api/analysis/batch-analyze
 * @desc   Batch analyze all unprocessed articles (up to 5 per call)
 * @access Admin
 */
router.post('/batch-analyze', auth('admin'), analysisController.batchAnalyze);

/**
 * @route  GET /api/analysis/article/:id
 * @desc   Get AI analysis result for a specific article
 * @access Private
 */
router.get('/article/:id', auth(), analysisController.getArticleAnalysis);

/**
 * @route  GET /api/analysis/trends/:timeframe
 * @desc   Get trending topics and sentiment (daily|weekly|monthly)
 * @access Private
 */
router.get('/trends/:timeframe', auth(), analysisController.getTrends);

export const analysisRoutes = router;
