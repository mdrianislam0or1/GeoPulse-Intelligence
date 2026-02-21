import { Document, Types } from 'mongoose';

export interface ICrisisEvent extends Document {
  _id: Types.ObjectId;
  title: string;
  type: 'natural_disaster' | 'political' | 'military' | 'economic' | 'health' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  countries_affected: string[];
  status: 'active' | 'monitoring' | 'resolved';
  source_articles: Types.ObjectId[];
  risk_score: number;
  description?: string;
  started_at: Date;
  resolved_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICountry extends Document {
  _id: Types.ObjectId;
  code: string;
  name: string;
  region: string;
  stability_index: number;
  last_updated: Date;
}
