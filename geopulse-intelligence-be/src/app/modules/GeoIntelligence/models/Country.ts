import { Schema, model } from 'mongoose';
import type { ICountry } from '../geo.interface';

const CountrySchema = new Schema<ICountry>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      required: true,
      trim: true,
    },
    stability_index: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Country = model<ICountry>('Country', CountrySchema);
