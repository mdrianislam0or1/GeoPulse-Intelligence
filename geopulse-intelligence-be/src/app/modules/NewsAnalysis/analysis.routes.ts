import express from 'express';
import { auth } from '../../../middleware/auth';
import { analysisController } from './analysis.controller';

const router = express.Router();

// Full AI analysis for single article
router.post('/analyze/:articleId', auth('admin'), analysisController.analyzeArticle);

// Batch analyze unprocessed articles
router.post('/batch-analyze', auth('admin'), analysisController.batchAnalyze);

// Individual analysis endpoints
router.post('/classify', auth('admin'), analysisController.classify);
router.post('/sentiment', auth('admin'), analysisController.sentiment);
router.post('/bias-detection', auth('admin'), analysisController.biasDetection);
router.post('/fake-news-check', auth('admin'), analysisController.fakeNewsCheck);
router.post('/topic-modeling', auth('admin'), analysisController.topicModeling);

// Get analysis result for specific article
router.get('/article/:id', auth(), analysisController.getArticleAnalysis);

// Trending topics and sentiment
router.get('/trends/:timeframe', auth(), analysisController.getTrends);

export const analysisRoutes = router;
