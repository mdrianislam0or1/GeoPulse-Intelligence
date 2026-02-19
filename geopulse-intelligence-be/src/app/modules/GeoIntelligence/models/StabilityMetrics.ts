import { Document, Schema, model } from 'mongoose';

export interface IStabilityMetrics extends Document {
  country_code: string;
  date: Date;
  political_score: number;
  economic_score: number;
  social_score: number;
  security_score: number;
  composite_score: number;
  article_count: number;
  sentiment_avg: number;
  crisis_events: number;
  createdAt: Date;
  updatedAt: Date;
}

const stabilitySchema = new Schema<IStabilityMetrics>(
  {
    country_code: { type: String, required: true, uppercase: true },
    date: { type: Date, required: true },
    political_score: { type: Number, default: 50 },
    economic_score: { type: Number, default: 50 },
    social_score: { type: Number, default: 50 },
    security_score: { type: Number, default: 50 },
    composite_score: { type: Number, default: 50 },
    article_count: { type: Number, default: 0 },
    sentiment_avg: { type: Number, default: 0 },
    crisis_events: { type: Number, default: 0 },
  },
  { timestamps: true },
);

stabilitySchema.index({ country_code: 1, date: -1 });
stabilitySchema.index({ composite_score: 1 });

export const StabilityMetrics = model<IStabilityMetrics>('StabilityMetrics', stabilitySchema);
