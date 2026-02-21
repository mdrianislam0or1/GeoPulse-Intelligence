import { Types } from 'mongoose';

export interface ICrisisDetectionResult {
  title: string;
  type: string;
  severity: string;
  countries_affected: string[];
  risk_score: number;
  source_articles: Types.ObjectId[];
}
