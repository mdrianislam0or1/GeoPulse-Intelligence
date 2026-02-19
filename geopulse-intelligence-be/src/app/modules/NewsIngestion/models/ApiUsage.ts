import { Document, Schema, model } from 'mongoose';

export interface IApiUsage extends Document {
  api_name: 'newsapi' | 'currentsapi' | 'gnews' | 'rss2json';
  daily_count: number;
  max_daily_limit: number;
  last_reset: Date;
  is_active: boolean;
  last_fetch_at?: Date;
  total_lifetime_calls: number;
  createdAt: Date;
  updatedAt: Date;
}

const apiUsageSchema = new Schema<IApiUsage>(
  {
    api_name: {
      type: String,
      required: true,
      unique: true,
      enum: ['newsapi', 'currentsapi', 'gnews', 'rss2json'],
    },
    daily_count: { type: Number, default: 0 },
    max_daily_limit: { type: Number, required: true },
    last_reset: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    last_fetch_at: Date,
    total_lifetime_calls: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ApiUsage = model<IApiUsage>('ApiUsage', apiUsageSchema);

/**
 * Seed initial API usage records on app startup.
 * Uses upsert so it's safe to call multiple times.
 */
export const seedApiUsage = async (): Promise<void> => {
  const sources = [
    { api_name: 'newsapi', max_daily_limit: 500 },
    { api_name: 'currentsapi', max_daily_limit: 20 },
    { api_name: 'gnews', max_daily_limit: 100 },
    { api_name: 'rss2json', max_daily_limit: 9999 },
  ];

  for (const src of sources) {
    await ApiUsage.findOneAndUpdate(
      { api_name: src.api_name },
      { $setOnInsert: { ...src, is_active: true, daily_count: 0, total_lifetime_calls: 0 } },
      { upsert: true, new: true },
    );
  }
};

/**
 * Check if an API is within its daily limit.
 * Automatically resets counter after 24 hours.
 * Returns true if the request can proceed.
 */
export const checkAndIncrementUsage = async (
  apiName: IApiUsage['api_name'],
): Promise<boolean> => {
  const usage = await ApiUsage.findOne({ api_name: apiName });
  if (!usage) return false;

  // Reset if 24 hours have passed
  const hoursSinceReset = (Date.now() - usage.last_reset.getTime()) / 3_600_000;
  if (hoursSinceReset >= 24) {
    usage.daily_count = 0;
    usage.last_reset = new Date();
    usage.is_active = true;
  }

  // Check limit
  if (!usage.is_active || usage.daily_count >= usage.max_daily_limit) {
    usage.is_active = false;
    await usage.save();
    return false;
  }

  // Increment usage
  usage.daily_count += 1;
  usage.total_lifetime_calls += 1;
  usage.last_fetch_at = new Date();
  await usage.save();
  return true;
};
