import express from 'express';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation.middleware';
import { analysisController } from './analysis.controller';
import {
    getAnalysesValidation,
    getAnalysisByArticleIdValidation,
    triggerAnalysisValidation,
} from './analysis.validation';

const router = express.Router();

/**
 * @route   GET /api/analysis
 * @desc    Get paginated analyses
 * @access  Private
 */
router.get('/', auth(), validateRequest(getAnalysesValidation), analysisController.getAnalyses);

/**
 * @route   GET /api/analysis/article/:articleId
 * @desc    Get analysis for specific article
 * @access  Private
 */
router.get(
  '/article/:articleId',
  auth(),
  validateRequest(getAnalysisByArticleIdValidation),
  analysisController.getAnalysisByArticleId,
);

/**
 * @route   POST /api/analysis/trigger
 * @desc    Manually trigger analysis (admin only)
 * @access  Admin
 */
router.post(
  '/trigger',
  auth('admin'),
  validateRequest(triggerAnalysisValidation),
  analysisController.triggerAnalysis,
);

export const analysisRoutes = router;
