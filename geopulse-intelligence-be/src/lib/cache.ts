/**
 * Redis caching utility functions
 */

import { createClient } from 'redis';
import config from '../config';
import logger from '../utils/logger';

let redisClient: ReturnType<typeof createClient> | null = null;

/**
 * Initialize Redis client connection
 */

export const initRedisClient = async (): Promise<ReturnType<typeof createClient>> => {
  if (redisClient) return redisClient;

  try {
    const client = createClient({
      url: config.redis?.url || 'redis://localhost:6379',
      password: config.redis?.password,
      database: config.redis?.db,
      socket: {
        reconnectStrategy: (retries) =>
          retries > 10 ? new Error('Redis reconnection failed') : retries * 100,
      },
    });

    client.on('error', (err) => logger.error('Redis Client Error:', err));
    client.on('connect', () => logger.info('✅ Redis client connected'));
    client.on('reconnecting', () => logger.info('🔄 Redis client reconnecting...'));

    await client.connect();
    redisClient = client;
    return client;
  } catch (error) {
    logger.error('Failed to initialize Redis client:', error);
    throw error;
  }
};

/**
 * Get Redis client instance
 */
export const getRedisClient = (): ReturnType<typeof createClient> => {
  if (!redisClient) throw new Error('Redis client not initialized. Call initRedisClient() first.');
  return redisClient;
};

/**
 * Set cache value with optional TTL
 * @param key - Cache key
 * @param value - Value to cache (will be JSON stringified)
 * @param ttl - Time to live in seconds (default: 3600)
 */
export const setCache = async (key: string, value: any, ttl: number = 3600): Promise<void> => {
  try {
    const client = getRedisClient();
    const serializedValue = JSON.stringify(value);
    await client.setEx(key, ttl, serializedValue);
    logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
  } catch (error) {
    logger.error(`Failed to set cache for key ${key}:`, error);
    // Don't throw error, caching failure shouldn't break the app
  }
};

/**
 * Get cache value
 * @param key - Cache key
 * @returns Parsed cache value or null if not found
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const client = getRedisClient();
    const value = await client.get(key);

    if (!value) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return JSON.parse(value) as T;
  } catch (error) {
    logger.error(`Failed to get cache for key ${key}:`, error);
    return null;
  }
};

/**
 * Delete cache value
 * @param key - Cache key or pattern
 */
export const deleteCache = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
    logger.debug(`Cache deleted: ${key}`);
  } catch (error) {
    logger.error(`Failed to delete cache for key ${key}:`, error);
  }
};

/**
 * Delete multiple cache keys by pattern
 * @param pattern - Key pattern (e.g., 'user:*')
 */
export const deleteCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(keys);
      logger.debug(`Cache deleted by pattern: ${pattern} (${keys.length} keys)`);
    }
  } catch (error) {
    logger.error(`Failed to delete cache by pattern ${pattern}:`, error);
  }
};

/**
 * Clear all cache
 */
export const clearCache = async (): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.flushDb();
    logger.info('🗑️  All cache cleared');
  } catch (error) {
    logger.error('Failed to clear cache:', error);
  }
};

/**
 * Check if key exists in cache
 * @param key - Cache key
 * @returns True if key exists
 */
export const cacheExists = async (key: string): Promise<boolean> => {
  try {
    const client = getRedisClient();
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    logger.error(`Failed to check cache existence for key ${key}:`, error);
    return false;
  }
};

/**
 * Get cache TTL
 * @param key - Cache key
 * @returns TTL in seconds or -1 if key doesn't exist
 */
export const getCacheTTL = async (key: string): Promise<number> => {
  try {
    const client = getRedisClient();
    return await client.ttl(key);
  } catch (error) {
    logger.error(`Failed to get TTL for key ${key}:`, error);
    return -1;
  }
};

/**
 * Disconnect Redis client
 */
export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
      logger.info('👋 Redis client disconnected');
    }
  } catch (error) {
    logger.error('Failed to disconnect Redis client:', error);
  }
};
