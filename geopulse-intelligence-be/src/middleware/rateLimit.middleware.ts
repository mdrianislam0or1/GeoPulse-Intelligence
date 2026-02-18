/**
 * Rate limiting middleware using Redis
 */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { getRedisClient } from '../lib/cache';
import logger from '../utils/logger';
import sendResponse from '../utils/sendResponse';

export interface IRateLimitOptions {
  windowMs: number; // Time window in milliseconds
  max: number; // Maximum number of requests per window
  message?: string; // Custom error message
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  keyGenerator?: (req: Request) => string; // Custom key generator
}

/**
 * Create rate limiter middleware
 * @param options - Rate limit configuration
 * @returns Express middleware function
 */
export const createRateLimiter = (options: IRateLimitOptions) => {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    keyGenerator = (req: Request) => {
      // Default: use IP address or user ID if authenticated
      return req.user?.userId || req.ip || 'unknown';
    },
  } = options;

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const redis = getRedisClient();
      const key = `ratelimit:${keyGenerator(req)}:${req.path}`;
      const windowSeconds = Math.ceil(windowMs / 1000);

      // Get current count
      const current = await redis.get(key);
      const count = current ? parseInt(current, 10) : 0;

      // Check if limit exceeded
      if (count >= max) {
        const ttl = await redis.ttl(key);
        const retryAfter = ttl > 0 ? ttl : windowSeconds;

        logger.warn('Rate limit exceeded', {
          key,
          count,
          max,
          path: req.path,
        });

        res.setHeader('X-RateLimit-Limit', max.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
        res.setHeader('X-RateLimit-Reset', (Date.now() + retryAfter * 1000).toString());
        res.setHeader('Retry-After', retryAfter.toString());

        return sendResponse(res, {
          statusCode: httpStatus.TOO_MANY_REQUESTS,
          success: false,
          message,
          errorMessage: 'Rate limit exceeded',
        });
      }

      // Increment counter
      if (count === 0) {
        // First request in window, set with expiry
        await redis.setEx(key, windowSeconds, '1');
      } else {
        // Increment existing counter
        await redis.incr(key);
      }

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', max.toString());
      res.setHeader('X-RateLimit-Remaining', (max - count - 1).toString());

      // Handle response tracking
      if (skipSuccessfulRequests || skipFailedRequests) {
        const originalSend = res.send;
        res.send = function (data) {
          const shouldSkip =
            (skipSuccessfulRequests && res.statusCode < 400) ||
            (skipFailedRequests && res.statusCode >= 400);

          if (shouldSkip) {
            // Decrement counter if we should skip this request
            redis.decr(key).catch((err) => {
              logger.error('Failed to decrement rate limit counter:', err);
            });
          }

          return originalSend.call(this, data);
        };
      }

      next();
    } catch (error) {
      logger.error('Rate limiter error:', error);
      // Don't block request if rate limiter fails
      next();
    }
  };
};

/**
 * Preset rate limiters for common use cases
 */

// Strict rate limit for authentication endpoints
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: 'Too many authentication attempts, please try again later',
});

// Standard rate limit for API endpoints
export const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
});

// Relaxed rate limit for public endpoints
export const publicRateLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 300, // 300 requests per minute
});

// Strict rate limit for file uploads
export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Too many file uploads, please try again later',
});

// AI/expensive operations rate limit
export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests per hour
  message: 'AI request limit reached, please try again later',
});
