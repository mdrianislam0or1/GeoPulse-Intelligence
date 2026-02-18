import { Server } from 'http';
import app from './app';
import { initializeAdminSocket } from './app/modules/Admin/admin.module';
import { initializeAISocket } from './app/modules/AI/ai.module';
import { initializeNotificationSocket } from './app/modules/Notification/notification.module';
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


    // ✅ SOCKET.IO INITIALIZATION
    const io = initSocket(server);

    // ✅ MODULE SOCKET REGISTRATION
    initializeAdminSocket(io);
    initializeNotificationSocket(io);
    initializeAISocket(io);


    // Start server
    server = app.listen(config.port, () => {
      logger.info(`🚀 Server is running on port ${config.port}`);
      logger.info(`🌍 Environment: ${config.env}`);
      logger.info(`📍 URL: ${config.backend_url}`);
      logger.info(`🏥 Health Check: ${config.backend_url}/health`);
      logger.info(`📚 API Docs: ${config.backend_url}/api-docs`);
    });
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
