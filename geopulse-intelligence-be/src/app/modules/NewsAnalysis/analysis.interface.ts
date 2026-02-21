import { Document, Types } from 'mongoose';

export interface IArticleAnalysis extends Document {
  _id: Types.ObjectId;
  article_id: Types.ObjectId;
  classification: {
    category: string;
    sub_categories: string[];
    confidence: number;
  };
  sentiment: {
    label: 'positive' | 'negative' | 'neutral' | 'mixed';
    polarity: number;
  };
  bias_score: number;
  fake_news_probability: number;
  topics: Array<{ name: string; score: number }>;
  summary_ai: string;
  entities: {
    countries: string[];
    people: string[];
    organizations: string[];
  };
  risk_score: number;
  analyzed_at: Date;
  ai_model: string;
  token_usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
