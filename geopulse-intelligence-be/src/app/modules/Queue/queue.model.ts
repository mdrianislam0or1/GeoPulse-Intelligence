import { Document, Schema, Types, model } from 'mongoose';

export interface IQueueTask extends Document {
  _id: Types.ObjectId;
  taskId: string;
  taskType: 'news_fetch' | 'analysis' | 'crisis_detect' | 'retention_cleanup';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  retryCount: number;
  maxRetries: number;
  payload: Record<string, any>;
  result?: Record<string, any>;
  error?: string;
  lockedBy?: string;
  lockedAt?: Date;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QueueTaskSchema = new Schema<IQueueTask>(
  {
    taskId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    taskType: {
      type: String,
      enum: ['news_fetch', 'analysis', 'crisis_detect', 'retention_cleanup'],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
      index: true,
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    maxRetries: {
      type: Number,
      default: 3,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
    result: {
      type: Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    lockedBy: {
      type: String,
      default: null,
    },
    lockedAt: {
      type: Date,
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for dequeue queries
QueueTaskSchema.index({ status: 1, createdAt: 1 });

// TTL — auto-delete completed/failed tasks after 7 days
QueueTaskSchema.index(
  { processedAt: 1 },
  { expireAfterSeconds: 7 * 24 * 60 * 60, partialFilterExpression: { status: { $in: ['completed', 'failed'] } } },
);

export const QueueTask = model<IQueueTask>('QueueTask', QueueTaskSchema);
