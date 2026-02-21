import { Document, Schema, Types, model } from 'mongoose';

export interface IWatchlist extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  type: 'country' | 'keyword' | 'source' | 'topic';
  value: string;
  notify_socket: boolean;
  notify_email: boolean;
  is_active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WatchlistSchema = new Schema<IWatchlist>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['country', 'keyword', 'source', 'topic'],
      required: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    notify_socket: {
      type: Boolean,
      default: true,
    },
    notify_email: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound unique index: same user can't watch same type+value twice
WatchlistSchema.index({ user_id: 1, type: 1, value: 1 }, { unique: true });

export const Watchlist = model<IWatchlist>('Watchlist', WatchlistSchema);
