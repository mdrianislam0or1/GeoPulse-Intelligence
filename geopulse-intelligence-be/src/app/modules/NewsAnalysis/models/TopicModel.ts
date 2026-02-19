import { Document, Schema, Types, model } from 'mongoose';

export interface ITopicModel extends Document {
  name: string;
  score: number;
  date: Date;
  article_count: number;
  related_articles: Types.ObjectId[];
  category: string;
  trend_direction: 'rising' | 'falling' | 'stable';
  createdAt: Date;
  updatedAt: Date;
}

const topicModelSchema = new Schema<ITopicModel>(
  {
    name: { type: String, required: true },
    score: { type: Number, default: 0, min: 0, max: 1 },
    date: { type: Date, required: true },
    article_count: { type: Number, default: 0 },
    related_articles: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    category: String,
    trend_direction: {
      type: String,
      enum: ['rising', 'falling', 'stable'],
      default: 'stable',
    },
  },
  { timestamps: true },
);

topicModelSchema.index({ name: 1, date: -1 });
topicModelSchema.index({ score: -1 });
topicModelSchema.index({ date: -1 });
topicModelSchema.index({ category: 1 });

export const TopicModel = model<ITopicModel>('TopicModel', topicModelSchema);
