/**
 * In-memory sliding-window rate limiter (no Redis dependency)
 */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from '../utils/logger';
import sendResponse from '../utils/sendResponse';

export interface IRateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

// In-memory store: key → array of timestamps
const hitStore = new Map<string, number[]>();

// Periodic cleanup every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of hitStore.entries()) {
    const recent = timestamps.filter((t) => now - t < 15 * 60 * 1000); // keep max 15 min
    if (recent.length === 0) {
      hitStore.delete(key);
    } else {
      hitStore.set(key, recent);
    }
  }
}, CLEANUP_INTERVAL_MS);

/**
 * Create rate limiter middleware
 */
export const createRateLimiter = (options: IRateLimitOptions) => {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later',
    keyGenerator = (req: Request) => {
      return req.user?.userId || req.ip || 'unknown';
    },
  } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const key = `${keyGenerator(req)}:${req.path}`;
      const now = Date.now();
      const timestamps = hitStore.get(key) ?? [];

      // Remove entries outside the current window
      const recent = timestamps.filter((t) => now - t < windowMs);

      if (recent.length >= max) {
        const oldestInWindow = recent[0];
        const retryAfterMs = windowMs - (now - oldestInWindow);
        const retryAfterSec = Math.ceil(retryAfterMs / 1000);

        logger.warn('Rate limit exceeded', {
          key,
          count: recent.length,
          max,
          path: req.path,
        });

        res.setHeader('X-RateLimit-Limit', max.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', (now + retryAfterMs).toString());
        res.setHeader('Retry-After', retryAfterSec.toString());

        sendResponse(res, {
          statusCode: httpStatus.TOO_MANY_REQUESTS,
          success: false,
          message,
          errorMessage: 'Rate limit exceeded',
        });
        return;
      }

      // Record this request
      recent.push(now);
      hitStore.set(key, recent);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', (max - recent.length).toString());

      next();
    } catch (error) {
      logger.error('Rate limiter error:', error);
      next();
    }
  };
};

/**
 * Preset rate limiters
 */

// Strict rate limit for authentication endpoints
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts, please try again later',
});

// Standard rate limit for API endpoints
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
});

// Relaxed rate limit for public endpoints
export const publicRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 300,
});

// Strict rate limit for file uploads
export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Too many file uploads, please try again later',
});

// AI/expensive operations rate limit
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: 'AI request limit reached, please try again later',
});
