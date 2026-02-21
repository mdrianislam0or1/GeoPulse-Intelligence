import express from 'express';
import { authRoutes } from '../app/modules/Auth/auth.routes';
// GeoPulse Intelligence modules
import { crisisRoutes } from '../app/modules/CrisisManagement/crisis.routes';
import { analyticsRoutes } from '../app/modules/GeoIntelligence/analytics.routes';
import { geoRoutes } from '../app/modules/GeoIntelligence/geo.routes';
import { analysisRoutes } from '../app/modules/NewsAnalysis/analysis.routes';
import { ingestionRoutes } from '../app/modules/NewsIngestion/ingestion.routes';
import { userRoutes } from '../app/modules/User/user.routes';

const router = express.Router();

const moduleRoutes = [
  // ─── Auth ───────────────────────────────────────────────────
  {
    path: '/auth',
    route: authRoutes,
  },
  // ─── User Management ─────────────────────────────────────────
  {
    path: '/users',
    route: userRoutes,
  },
  // ─── GeoPulse Intelligence ──────────────────────────────────
  {
    path: '/ingestion',
    route: ingestionRoutes,
  },
  {
    path: '/analysis',
    route: analysisRoutes,
  },
  {
    path: '/geo',
    route: geoRoutes,
  },
  {
    path: '/crisis',
    route: crisisRoutes,
  },
  {
    path: '/analytics',
    route: analyticsRoutes,
  },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
