import { Document, Schema, Types, model } from 'mongoose';

export interface IWatchlist extends Document {
  user_id: Types.ObjectId;
  type: 'country' | 'keyword' | 'category';
  value: string; // ISO code, keyword, or category name
  notify_email: boolean;
  notify_socket: boolean;
  createdAt: Date;
}

const watchlistSchema = new Schema<IWatchlist>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['country', 'keyword', 'category'], required: true },
    value: { type: String, required: true },
    notify_email: { type: Boolean, default: false },
    notify_socket: { type: Boolean, default: true },
  },
  { timestamps: true },
);

watchlistSchema.index({ user_id: 1 });
watchlistSchema.index({ type: 1, value: 1 });

export const Watchlist = model<IWatchlist>('Watchlist', watchlistSchema);
