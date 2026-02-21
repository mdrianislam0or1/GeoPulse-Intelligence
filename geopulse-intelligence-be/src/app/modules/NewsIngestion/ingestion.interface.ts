import { Document, Types } from 'mongoose';

// ─── Article Interface ────────────────────────────────────────────────────────

export interface IArticle extends Document {
  _id: Types.ObjectId;
  source_api: 'newsapi' | 'currentsapi' | 'gnews' | 'rss2json' | 'manual';
  title: string;
  description?: string;
  content?: string;
  url?: string;
  image_url?: string;
  published_at?: Date;
  source_name?: string;
  author?: string;
  country?: string;
  language?: string;
  content_hash: string;
  is_analyzed: boolean;
  entities: {
    countries: string[];
    people: string[];
    organizations: string[];
  };
  fetch_batch_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── ApiUsage Interface ───────────────────────────────────────────────────────

export interface IApiUsage extends Document {
  _id: Types.ObjectId;
  api_name: string;
  daily_limit: number;
  used_today: number;
  last_reset: Date;
  last_used_at?: Date;
}

// ─── Ingestion Result ─────────────────────────────────────────────────────────

export interface IIngestionResult {
  source: string;
  fetched: number;
  saved: number;
  duplicates: number;
  errors: number;
  timestamp: Date;
}

// ─── Raw article from any API ─────────────────────────────────────────────────

export interface IRawArticle {
  source_api: string;
  title: string;
  description?: string;
  content?: string;
  url?: string;
  image_url?: string;
  published_at?: string | Date;
  source_name?: string;
  author?: string;
  country?: string;
  language?: string;
  content_hash: string;
}
