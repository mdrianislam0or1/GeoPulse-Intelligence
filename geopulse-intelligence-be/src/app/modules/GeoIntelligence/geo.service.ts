/* eslint-disable @typescript-eslint/no-explicit-any */
import { Country } from './models/Country';
import { CrisisEvent } from './models/CrisisEvent';

/**
 * Get crisis events with filtering
 */
const getCrises = async (query: {
  page?: number;
  limit?: number;
  status?: string;
  severity?: string;
  type?: string;
  country?: string;
}) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query.status) filter.status = query.status;
  if (query.severity) filter.severity = query.severity;
  if (query.type) filter.type = query.type;
  if (query.country) filter.countries_affected = query.country.toUpperCase();

  const [crises, total] = await Promise.all([
    CrisisEvent.find(filter)
      .sort({ started_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    CrisisEvent.countDocuments(filter),
  ]);

  return {
    crises,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const getCrisisById = async (id: string) => {
  return CrisisEvent.findById(id).populate('source_articles', 'title url source_api').lean();
};

/**
 * Get countries with optional region filter
 */
const getCountries = async (region?: string) => {
  const filter: any = {};
  if (region) filter.region = new RegExp(region, 'i');
  return Country.find(filter).sort({ name: 1 }).lean();
};

/**
 * Update country stability index
 */
const updateStabilityIndex = async (code: string, stabilityIndex: number) => {
  return Country.findOneAndUpdate(
    { code: code.toUpperCase() },
    { stability_index: stabilityIndex, last_updated: new Date() },
    { new: true },
  ).lean();
};

export const geoService = {
  getCrises,
  getCrisisById,
  getCountries,
  updateStabilityIndex,
};
