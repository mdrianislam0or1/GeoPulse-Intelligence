import { Document, Schema, Types, model } from 'mongoose';

export interface ICrisisEvent extends Document {
  title: string;
  description?: string;
  type: 'political' | 'military' | 'economic' | 'natural' | 'health' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  countries_affected: string[];
  status: 'active' | 'resolved' | 'monitoring';
  started_at?: Date;
  resolved_at?: Date;
  source_articles: Types.ObjectId[];
  verified: boolean;
  ai_confidence: number;
  ai_early_warning?: string;
  createdAt: Date;
  updatedAt: Date;
}

const crisisSchema = new Schema<ICrisisEvent>(
  {
    title: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: ['political', 'military', 'economic', 'natural', 'health', 'other'],
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
    },
    countries_affected: [{ type: String, uppercase: true }],
    status: {
      type: String,
      enum: ['active', 'resolved', 'monitoring'],
      default: 'active',
    },
    started_at: Date,
    resolved_at: Date,
    source_articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    verified: { type: Boolean, default: false },
    ai_confidence: { type: Number, default: 0, min: 0, max: 1 },
    ai_early_warning: String,
  },
  { timestamps: true },
);

crisisSchema.index({ status: 1 });
crisisSchema.index({ severity: 1 });
crisisSchema.index({ countries_affected: 1 });
crisisSchema.index({ createdAt: -1 });

export const CrisisEvent = model<ICrisisEvent>('CrisisEvent', crisisSchema);
