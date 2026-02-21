/* eslint-disable @typescript-eslint/no-unused-vars */
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import httpStatus from 'http-status';
import morgan from 'morgan';
import config from './config';
import { globalErrorHandler } from './errors/errorHandler';
import router from './routes';
import logger from './utils/logger';

const app: Application = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [config.frontend_url, 'http://localhost:3000', 'http://localhost:5173', '*'],
    credentials: true,
  }),
);

// Handle preflight requests
app.options('*', cors());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression
app.use(compression());

// HTTP request logger (only in development)
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(
    morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }),
  );
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  logger.info('Root API accessed');
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Welcome to GeoPulse Intelligence API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

// API routes
app.use('/api', router);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.warn(`404 Not Found: ${req.originalUrl}`);
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API endpoint not found',
    error: {
      path: req.originalUrl,
      message: 'The requested resource does not exist',
    },
  });
});

// Global error handler
app.use(globalErrorHandler);

export default app;
