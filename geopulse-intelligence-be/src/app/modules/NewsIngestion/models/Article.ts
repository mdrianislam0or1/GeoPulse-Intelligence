import crypto from 'crypto';
import { Schema, model } from 'mongoose';
import type { IArticle } from '../ingestion.interface';

const ArticleSchema = new Schema<IArticle>(
  {
    source_api: {
      type: String,
      required: true,
      enum: ['newsapi', 'currentsapi', 'gnews', 'rss2json', 'manual'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    content: {
      type: String,
      trim: true,
      default: null,
    },
    url: {
      type: String,
      trim: true,
      default: null,
    },
    image_url: {
      type: String,
      default: null,
    },
    published_at: {
      type: Date,
      default: null,
      index: true,
    },
    source_name: {
      type: String,
      trim: true,
      default: null,
    },
    author: {
      type: String,
      trim: true,
      default: null,
    },
    country: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
      index: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    content_hash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    is_analyzed: {
      type: Boolean,
      default: false,
      index: true,
    },
    entities: {
      countries: { type: [String], default: [] },
      people: { type: [String], default: [] },
      organizations: { type: [String], default: [] },
    },
    fetch_batch_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// TTL index — auto-delete raw data after 7 days
ArticleSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7 * 24 * 60 * 60 });

// Text index for keyword search
ArticleSchema.index({ title: 'text', description: 'text' });

// Compound index for analysis queries
ArticleSchema.index({ is_analyzed: 1, createdAt: -1 });

/**
 * Generate content hash from title (used for deduplication)
 */
ArticleSchema.statics.generateHash = (title: string): string => {
  return crypto.createHash('sha256').update(title.toLowerCase().trim()).digest('hex').slice(0, 32);
};

// Auto-generate content_hash from title if not provided
ArticleSchema.pre('validate', function (next) {
  if (!this.content_hash && this.title) {
    this.content_hash = crypto
      .createHash('sha256')
      .update(this.title.toLowerCase().trim())
      .digest('hex')
      .slice(0, 32);
  }
  next();
});

export const Article = model<IArticle>('Article', ArticleSchema);
