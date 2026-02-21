import logger from '../../../../utils/logger';
import { Country } from '../models/Country';

const COUNTRIES = [
  // Bangladesh (primary)
  { code: 'BD', name: 'Bangladesh', region: 'South Asia', stability_index: 55 },
  // South Asian neighbors
  { code: 'IN', name: 'India', region: 'South Asia', stability_index: 60 },
  { code: 'PK', name: 'Pakistan', region: 'South Asia', stability_index: 40 },
  { code: 'LK', name: 'Sri Lanka', region: 'South Asia', stability_index: 50 },
  { code: 'NP', name: 'Nepal', region: 'South Asia', stability_index: 55 },
  { code: 'MM', name: 'Myanmar', region: 'Southeast Asia', stability_index: 30 },
  // Middle East
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East', stability_index: 65 },
  { code: 'AE', name: 'United Arab Emirates', region: 'Middle East', stability_index: 80 },
  { code: 'IR', name: 'Iran', region: 'Middle East', stability_index: 35 },
  // Global powers / hotspots
  { code: 'US', name: 'United States', region: 'North America', stability_index: 75 },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', stability_index: 80 },
  { code: 'CN', name: 'China', region: 'East Asia', stability_index: 70 },
  { code: 'RU', name: 'Russia', region: 'Europe', stability_index: 40 },
  { code: 'UA', name: 'Ukraine', region: 'Europe', stability_index: 20 },
  { code: 'IL', name: 'Israel', region: 'Middle East', stability_index: 35 },
  { code: 'PS', name: 'Palestine', region: 'Middle East', stability_index: 15 },
  { code: 'JP', name: 'Japan', region: 'East Asia', stability_index: 85 },
  { code: 'DE', name: 'Germany', region: 'Europe', stability_index: 85 },
  { code: 'FR', name: 'France', region: 'Europe', stability_index: 75 },
  { code: 'AU', name: 'Australia', region: 'Oceania', stability_index: 85 },
];

/**
 * Seed country data (safe to run every startup — upsert)
 */
export const seedCountries = async (): Promise<void> => {
  for (const c of COUNTRIES) {
    await Country.findOneAndUpdate(
      { code: c.code },
      { $setOnInsert: { ...c, last_updated: new Date() } },
      { upsert: true, new: true },
    );
  }
  logger.info(`✅ ${COUNTRIES.length} countries seeded/verified`);
};
