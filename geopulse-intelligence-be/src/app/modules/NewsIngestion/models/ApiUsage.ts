import { Schema, model } from 'mongoose';
import config from '../../../../config';
import logger from '../../../../utils/logger';
import type { IApiUsage } from '../ingestion.interface';

const ApiUsageSchema = new Schema<IApiUsage>(
  {
    api_name: {
      type: String,
      required: true,
      unique: true,
      enum: ['newsapi', 'currentsapi', 'gnews', 'rss2json'],
    },
    daily_limit: {
      type: Number,
      required: true,
    },
    used_today: {
      type: Number,
      default: 0,
    },
    last_reset: {
      type: Date,
      default: Date.now,
    },
    last_used_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export const ApiUsage = model<IApiUsage>('ApiUsage', ApiUsageSchema);

/**
 * Seed default API usage records (safe to run every startup — upsert)
 */
export const seedApiUsage = async (): Promise<void> => {
  const apis = [
    { api_name: 'newsapi', daily_limit: config.newsApis.newsapi.dailyLimit },
    { api_name: 'currentsapi', daily_limit: config.newsApis.currentsapi.dailyLimit },
    { api_name: 'gnews', daily_limit: config.newsApis.gnews.dailyLimit },
    { api_name: 'rss2json', daily_limit: config.newsApis.rss2json.dailyLimit },
  ];

  for (const api of apis) {
    await ApiUsage.findOneAndUpdate(
      { api_name: api.api_name },
      { $setOnInsert: { ...api, used_today: 0, last_reset: new Date() } },
      { upsert: true, new: true },
    );
  }

  logger.info('✅ ApiUsage records seeded/verified');
};

/**
 * Check if an API can be used (hasn't exceeded daily limit)
 * Also auto-resets if a new day has started.
 */
export const canUseApi = async (apiName: string): Promise<boolean> => {
  const record = await ApiUsage.findOne({ api_name: apiName });
  if (!record) return false;

  // Auto-reset if last_reset was before today midnight
  const now = new Date();
  const lastReset = new Date(record.last_reset);
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (lastReset < todayMidnight) {
    record.used_today = 0;
    record.last_reset = now;
    await record.save();
  }

  return record.used_today < record.daily_limit;
};

/**
 * Increment usage counter
 */
export const incrementApiUsage = async (apiName: string): Promise<void> => {
  await ApiUsage.findOneAndUpdate(
    { api_name: apiName },
    {
      $inc: { used_today: 1 },
      $set: { last_used_at: new Date() },
    },
  );
};
