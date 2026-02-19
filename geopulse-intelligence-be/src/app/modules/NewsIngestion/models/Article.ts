import { Document, Schema, model } from 'mongoose';

export interface IArticle extends Document {
  source_api: 'newsapi' | 'currentsapi' | 'gnews' | 'rss2json' | 'manual';
  source_name?: string;
  source_id?: string;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  author?: string;
  image_url?: string;
  published_at?: Date;
  ingested_at: Date;
  language: string;
  country?: string;
  content_hash?: string;
  keywords: string[];
  entities: {
    countries: string[];
    people: string[];
    organizations: string[];
  };
  is_analyzed: boolean;
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

const articleSchema = new Schema<IArticle>(
  {
    source_api: {
      type: String,
      enum: ['newsapi', 'currentsapi', 'gnews', 'rss2json', 'manual'],
      required: true,
    },
    source_name: String,
    source_id: String,
    title: { type: String, required: true },
    description: String,
    content: String,
    url: String,
    author: String,
    image_url: String,
    published_at: Date,
    ingested_at: { type: Date, default: Date.now },
    language: { type: String, default: 'en' },
    country: String,
    content_hash: String, // MD5(title+url) for deduplication
    keywords: [String],
    entities: {
      countries: [String],
      people: [String],
      organizations: [String],
    },
    is_analyzed: { type: Boolean, default: false },
    categories: [String],
  },
  { timestamps: true },
);

articleSchema.index({ title: 'text', content: 'text' });
articleSchema.index({ content_hash: 1 }, { unique: true, sparse: true });
articleSchema.index({ ingested_at: -1 });
articleSchema.index({ published_at: -1 });
articleSchema.index({ source_api: 1 });
articleSchema.index({ is_analyzed: 1 });
articleSchema.index({ 'entities.countries': 1 });
articleSchema.index({ url: 1 }, { sparse: true });

export const Article = model<IArticle>('Article', articleSchema);
