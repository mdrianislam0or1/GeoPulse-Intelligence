import { Document, Schema, Types, model } from 'mongoose';

export interface IArticleAnalysis extends Document {
  article_id: Types.ObjectId;
  classification: {
    category: string;
    sub_categories: string[];
    confidence: number;
  };
  sentiment: {
    polarity: number;
    subjectivity: number;
    label: 'positive' | 'negative' | 'neutral';
    emotion: {
      joy: number;
      sadness: number;
      anger: number;
      fear: number;
      surprise: number;
    };
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
  analyzed_at: Date;
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<IArticleAnalysis>(
  {
    article_id: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
      unique: true,
    },
    classification: {
      category: String,
      sub_categories: [String],
      confidence: Number,
    },
    sentiment: {
      polarity: Number,
      subjectivity: Number,
      label: { type: String, enum: ['positive', 'negative', 'neutral'] },
      emotion: {
        joy: Number,
        sadness: Number,
        anger: Number,
        fear: Number,
        surprise: Number,
      },
    },
    bias_score: Number,
    fake_news_probability: Number,
    topics: [{ name: String, score: Number }],
    summary_ai: String,
    entities: {
      countries: [String],
      people: [String],
      organizations: [String],
    },
    analyzed_at: { type: Date, default: Date.now },
  },
  { timestamps: true },
);


analysisSchema.index({ 'classification.category': 1 });
analysisSchema.index({ 'sentiment.label': 1 });
analysisSchema.index({ analyzed_at: -1 });
analysisSchema.index({ 'entities.countries': 1 });

export const ArticleAnalysis = model<IArticleAnalysis>('ArticleAnalysis', analysisSchema);
