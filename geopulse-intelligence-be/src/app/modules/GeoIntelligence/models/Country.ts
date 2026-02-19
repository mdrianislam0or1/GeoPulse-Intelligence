import { Document, Schema, model } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  iso_code: string;
  region: string;
  sub_region?: string;
  capital?: string;
  population?: number;
  stability_score: number;
  last_updated?: Date;
  coordinates: { lat: number; lng: number };
  createdAt: Date;
  updatedAt: Date;
}

const countrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true },
    iso_code: { type: String, required: true, unique: true, uppercase: true },
    region: { type: String, required: true },
    sub_region: String,
    capital: String,
    population: Number,
    stability_score: { type: Number, default: 50, min: 0, max: 100 },
    last_updated: Date,
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

countrySchema.index({ iso_code: 1 });
countrySchema.index({ region: 1 });
countrySchema.index({ stability_score: 1 });

export const Country = model<ICountry>('Country', countrySchema);
