import { Server } from 'http';
import app from './app';
import { seedCountries } from './app/modules/GeoIntelligence/seeders/countries.seeder';
import { initAnalysisCron } from './app/modules/NewsAnalysis/analysis.service';
import { initIngestionCron } from './app/modules/NewsIngestion/cron/dailyFetch.cron';
import { seedApiUsage } from './app/modules/NewsIngestion/models/ApiUsage';
import { initRetentionCron } from './app/modules/NewsIngestion/retention.service';
import config from './config';
import { initSocket } from './config/socket';
import { connectDB } from './db';
import logger from './utils/logger';

let server: Server;

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Connect to database and start server
async function bootstrap() {
  try {
    // Connect to MongoDB
    await connectDB();

    // ✅ Start server first so initSocket gets a valid server instance
    server = app.listen(config.port, () => {
      logger.info(`🚀 Server is running on port ${config.port}`);
      logger.info(`🌍 Environment: ${config.env}`);
      logger.info(`📍 URL: ${config.backend_url}`);
      logger.info(`🏥 Health: ${config.backend_url}/health`);
    });

    // ✅ SOCKET.IO INITIALIZATION
    initSocket(server);
    logger.info('✅ Socket.io initialized');

    // ✅ SEED API USAGE RECORDS (safe to run every startup — upsert)
    await seedApiUsage();
    logger.info('✅ ApiUsage records seeded');

    // ✅ SEED COUNTRY DATA (safe to run every startup — upsert)
    await seedCountries();
    logger.info('✅ Countries seeded');

    // ✅ INITIALIZE CRON JOBS (only in non-serverless envs)
    // On Vercel, crons are triggered via HTTP by vercel.json cron entries.
    // Locally, node-cron handles the scheduling.
    const isVercel = !!process.env.VERCEL;
    if (!isVercel) {
      initIngestionCron();
      initAnalysisCron();
      initRetentionCron();
      logger.info('✅ Cron jobs initialized (local mode)');
    } else {
      logger.info('☁️  Vercel detected — crons managed by vercel.json (HTTP endpoints)');
    }

  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (error: Error) => {
  logger.error('❌ Unhandled Rejection:', error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('👋 SIGTERM received');
  if (server) {
    server.close(() => {
      logger.info('💤 Process terminated');
    });
  }
});

process.on('SIGINT', () => {
  logger.info('👋 SIGINT received');
  if (server) {
    server.close(() => {
      logger.info('💤 Process terminated');
    });
  }
});

// Bootstrap the application
bootstrap();
