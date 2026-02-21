import { Document, Schema, Types, model } from 'mongoose';

export interface IUserAlert extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  type: string;
  article_id?: Types.ObjectId;
  value: string;
  message: string;
  is_read: boolean;
  createdAt: Date;
}

const UserAlertSchema = new Schema<IUserAlert>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
    },
    article_id: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      default: null,
    },
    value: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      default: '',
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// TTL — auto-delete alerts after 30 days
UserAlertSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

export const UserAlert = model<IUserAlert>('UserAlert', UserAlertSchema);
