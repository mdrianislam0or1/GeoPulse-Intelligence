/**
 * Request logger middleware
 */

import { NextFunction, Request, Response } from 'express';
import logger from '../utils/logger';

/**
 * Log incoming HTTP requests
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log request
  logger.info('📥 Incoming request', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.userId,
  });

  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';

    logger[logLevel]('📤 Response sent', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.userId,
    });
  });

  next();
};

/**
 * Log errors
 */
export const errorLogger = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  logger.error('❌ Error occurred', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    path: req.path,
    userId: req.user?.userId,
  });

  next(error);
};
