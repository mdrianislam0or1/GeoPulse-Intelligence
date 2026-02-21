import { Schema, model } from 'mongoose';
import type { ICrisisEvent } from '../geo.interface';

const CrisisEventSchema = new Schema<ICrisisEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['natural_disaster', 'political', 'military', 'economic', 'health', 'other'],
      default: 'other',
      index: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true,
    },
    countries_affected: {
      type: [String],
      default: [],
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'monitoring', 'resolved'],
      default: 'active',
      index: true,
    },
    source_articles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Article',
      },
    ],
    risk_score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      default: '',
    },
    started_at: {
      type: Date,
      default: Date.now,
    },
    resolved_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CrisisEventSchema.index({ status: 1, severity: 1, started_at: -1 });

export const CrisisEvent = model<ICrisisEvent>('CrisisEvent', CrisisEventSchema);
