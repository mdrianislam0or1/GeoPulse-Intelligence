import express from 'express';
import { auth } from '../../../middleware/auth';
import validateRequest from '../../../middleware/validation.middleware';
import { geoController } from './geo.controller';
import { getCountriesValidation, getCrisesValidation, getCrisisByIdValidation } from './geo.validation';

const router = express.Router();

/**
 * @route   GET /api/geo/crises
 * @desc    Get all crisis events
 * @access  Private
 */
router.get('/crises', auth(), validateRequest(getCrisesValidation), geoController.getCrises);

/**
 * @route   GET /api/geo/crises/:id
 * @desc    Get single crisis by ID
 * @access  Private
 */
router.get('/crises/:id', auth(), validateRequest(getCrisisByIdValidation), geoController.getCrisisById);

/**
 * @route   GET /api/geo/countries
 * @desc    Get country list
 * @access  Private
 */
router.get('/countries', auth(), validateRequest(getCountriesValidation), geoController.getCountries);

export const geoRoutes = router;
