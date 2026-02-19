import { Document, Schema, model } from 'mongoose';

export interface IIngestionLog extends Document {
  source_api: string;
  status: 'success' | 'failed' | 'skipped';
  articles_fetched: number;
  articles_saved: number;
  articles_duplicate: number;
  error_message?: string;
  duration_ms: number;
  triggered_by: 'cron' | 'manual';
  createdAt: Date;
  updatedAt: Date;
}

const ingestionLogSchema = new Schema<IIngestionLog>(
  {
    source_api: { type: String, required: true },
    status: {
      type: String,
      enum: ['success', 'failed', 'skipped'],
      required: true,
    },
    articles_fetched: { type: Number, default: 0 },
    articles_saved: { type: Number, default: 0 },
    articles_duplicate: { type: Number, default: 0 },
    error_message: String,
    duration_ms: { type: Number, default: 0 },
    triggered_by: {
      type: String,
      enum: ['cron', 'manual'],
      default: 'cron',
    },
  },
  { timestamps: true },
);

ingestionLogSchema.index({ source_api: 1, createdAt: -1 });
ingestionLogSchema.index({ status: 1 });

export const IngestionLog = model<IIngestionLog>('IngestionLog', ingestionLogSchema);
