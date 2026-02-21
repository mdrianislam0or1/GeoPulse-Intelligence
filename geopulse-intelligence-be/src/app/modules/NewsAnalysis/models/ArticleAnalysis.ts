import { Schema, model } from 'mongoose';
import type { IArticleAnalysis } from '../analysis.interface';

const ArticleAnalysisSchema = new Schema<IArticleAnalysis>(
  {
    article_id: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
      unique: true,
      index: true,
    },
    classification: {
      category: { type: String, default: 'uncategorized', index: true },
      sub_categories: { type: [String], default: [] },
      confidence: { type: Number, default: 0, min: 0, max: 1 },
    },
    sentiment: {
      label: {
        type: String,
        enum: ['positive', 'negative', 'neutral', 'mixed'],
        default: 'neutral',
        index: true,
      },
      polarity: { type: Number, default: 0, min: -1, max: 1 },
    },
    bias_score: { type: Number, default: 0, min: 0, max: 1 },
    fake_news_probability: { type: Number, default: 0, min: 0, max: 1 },
    topics: [
      {
        name: { type: String },
        score: { type: Number, min: 0, max: 1 },
        _id: false,
      },
    ],
    summary_ai: { type: String, default: '' },
    entities: {
      countries: { type: [String], default: [] },
      people: { type: [String], default: [] },
      organizations: { type: [String], default: [] },
    },
    risk_score: { type: Number, default: 0, min: 0, max: 100 },
    analyzed_at: { type: Date, default: Date.now, index: true },
    ai_model: { type: String, default: 'unknown' },
    token_usage: {
      prompt_tokens: { type: Number, default: 0 },
      completion_tokens: { type: Number, default: 0 },
      total_tokens: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound indexes for dashboard queries
ArticleAnalysisSchema.index({ 'classification.category': 1, analyzed_at: -1 });
ArticleAnalysisSchema.index({ 'sentiment.label': 1, analyzed_at: -1 });

export const ArticleAnalysis = model<IArticleAnalysis>('ArticleAnalysis', ArticleAnalysisSchema);
