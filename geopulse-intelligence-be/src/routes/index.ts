import express from 'express';
import { adminRoutes } from '../app/modules/Admin/admin.routes';
import { authRoutes } from '../app/modules/Auth/auth.routes';
import { crisisRoutes } from '../app/modules/CrisisManagement/crisis.routes';
import { cronRoutes } from '../app/modules/Cron/cron.routes';
import { dashboardRoutes } from '../app/modules/Dashboard/dashboard.routes';
import { geoRoutes } from '../app/modules/GeoIntelligence/geo.routes';
import { analysisRoutes } from '../app/modules/NewsAnalysis/analysis.routes';
import { ingestionRoutes } from '../app/modules/NewsIngestion/ingestion.routes';
import { queueRoutes } from '../app/modules/Queue/queue.routes';

const router = express.Router();

const moduleRoutes = [
  // ─── Auth ───────────────────────────────────────────────────
  { path: '/auth', route: authRoutes },

  // ─── News Ingestion ─────────────────────────────────────────
  { path: '/news', route: ingestionRoutes },

  // ─── News Analysis ──────────────────────────────────────────
  { path: '/analysis', route: analysisRoutes },

  // ─── Geo Intelligence ───────────────────────────────────────
  { path: '/geo', route: geoRoutes },

  // ─── Crisis Management ──────────────────────────────────────
  { path: '/crisis', route: crisisRoutes },

  // ─── Dashboard ──────────────────────────────────────────────
  { path: '/dashboard', route: dashboardRoutes },

  // ─── Queue ──────────────────────────────────────────────────
  { path: '/queue', route: queueRoutes },

  // ─── Admin ──────────────────────────────────────────────────
  { path: '/admin', route: adminRoutes },

  // ─── Vercel Cron Jobs ───────────────────────────────────────
  { path: '/cron', route: cronRoutes },
];

moduleRoutes.forEach(route => {
  router.use(route.path, route.route);
});

export default router;
