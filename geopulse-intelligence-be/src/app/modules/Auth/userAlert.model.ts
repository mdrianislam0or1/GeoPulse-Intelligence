import { Document, Schema, Types, model } from 'mongoose';

export interface IUserAlert extends Document {
  user_id: Types.ObjectId;
  article_id: Types.ObjectId;
  watchlist_id: Types.ObjectId;
  type: 'country' | 'keyword' | 'category' | 'crisis';
  is_read: boolean;
  createdAt: Date;
}

const userAlertSchema = new Schema<IUserAlert>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    article_id: { type: Schema.Types.ObjectId, ref: 'Article', required: true },
    watchlist_id: { type: Schema.Types.ObjectId, ref: 'Watchlist', required: true },
    type: { type: String, enum: ['country', 'keyword', 'category', 'crisis'], required: true },
    is_read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userAlertSchema.index({ user_id: 1, is_read: 1 });
userAlertSchema.index({ createdAt: -1 });

export const UserAlert = model<IUserAlert>('UserAlert', userAlertSchema);
