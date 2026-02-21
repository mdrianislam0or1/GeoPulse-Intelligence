import express from 'express';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation.middleware';
import { ingestionController } from './ingestion.controller';
import {
    getArticleByIdValidation,
    getArticlesValidation,
    triggerIngestionValidation,
} from './ingestion.validation';

const router = express.Router();

/**
 * @route   GET /api/news
 * @desc    Get paginated articles with filters
 * @access  Private
 */
router.get('/', auth(), validateRequest(getArticlesValidation), ingestionController.getArticles);

/**
 * @route   GET /api/news/:id
 * @desc    Get single article by ID
 * @access  Private
 */
router.get('/:id', auth(), validateRequest(getArticleByIdValidation), ingestionController.getArticleById);

/**
 * @route   POST /api/news/ingest
 * @desc    Manually trigger ingestion (admin only)
 * @access  Admin
 */
router.post(
  '/ingest',
  auth('admin'),
  validateRequest(triggerIngestionValidation),
  ingestionController.triggerIngestion,
);

export const ingestionRoutes = router;
