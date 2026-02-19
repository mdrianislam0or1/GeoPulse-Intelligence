import express from 'express';
import { auth } from '../../../middleware/auth';
import { ingestionController } from './ingestion.controller';

const router = express.Router();

/**
 * @route  POST /api/ingestion/fetch-all
 * @desc   Manually trigger fetch from all news sources
 * @access Admin
 */
router.post('/fetch-all', auth('admin'), ingestionController.fetchAll);

/**
 * @route  POST /api/ingestion/fetch/:source
 * @desc   Fetch from one specific source (newsapi|currentsapi|gnews|rss2json)
 * @access Admin
 */
router.post('/fetch/:source', auth('admin'), ingestionController.fetchOne);

/**
 * @route  GET /api/ingestion/sources
 * @desc   List all configured news sources
 * @access Private
 */
router.get('/sources', auth(), ingestionController.getSources);

/**
 * @route  GET /api/ingestion/status
 * @desc   Get pipeline status and recent ingestion logs
 * @access Private
 */
router.get('/status', auth(), ingestionController.getStatus);

/**
 * @route  GET /api/ingestion/api-usage
 * @desc   Get daily API usage counts per source
 * @access Private
 */
router.get('/api-usage', auth(), ingestionController.getApiUsage);

/**
 * @route  POST /api/ingestion/toggle/:source
 * @desc   Enable or disable a source { isActive: boolean }
 * @access Admin
 */
router.post('/toggle/:source', auth('admin'), ingestionController.toggleSource);

export const ingestionRoutes = router;
