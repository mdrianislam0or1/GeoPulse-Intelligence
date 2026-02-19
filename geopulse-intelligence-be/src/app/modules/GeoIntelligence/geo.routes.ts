import express from 'express';
import { auth } from '../../../middleware/auth';
import { geoController } from './geo.controller';

const router = express.Router();

router.get('/countries', auth(), geoController.getAllCountries);
router.get('/country/:code', auth(), geoController.getCountryDetail);
router.get('/stability-index/:code', auth(), geoController.getStabilityIndex);
router.get('/conflict-zones', auth(), geoController.getConflictZones);
router.get('/regional-analysis/:region', auth(), geoController.getRegionalAnalysis);
router.get('/heatmap-data', auth(), geoController.getHeatmapData);
router.post('/correlate-events', auth(), geoController.correlateEvents);

export const geoRoutes = router;
