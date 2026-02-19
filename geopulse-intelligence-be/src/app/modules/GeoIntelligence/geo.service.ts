import { ArticleAnalysis } from '../NewsAnalysis/models/ArticleAnalysis';
import { Article } from '../NewsIngestion/models/Article';
import { Country } from './models/Country';
import { CrisisEvent } from './models/CrisisEvent';
import { StabilityMetrics } from './models/StabilityMetrics';

/**
 * Get all countries with their current stability scores.
 */
const getAllCountries = async () => {
  return Country.find({}).sort({ stability_score: 1 }).lean();
};

/**
 * Get detailed country info with recent news articles.
 */
const getCountryDetail = async (isoCode: string) => {
  const country = await Country.findOne({ iso_code: isoCode.toUpperCase() }).lean();
  if (!country) return null;

  const recentArticles = await Article.find({
    $or: [
      { country: isoCode.toLowerCase() },
      { 'entities.countries': { $regex: country.name, $options: 'i' } },
    ],
  })
    .sort({ published_at: -1 })
    .limit(10)
    .select('title url published_at source_api sentiment')
    .lean();

  const latestMetrics = await StabilityMetrics.findOne({
    country_code: isoCode.toUpperCase(),
  })
    .sort({ date: -1 })
    .lean();

  return { country, recentArticles, latestMetrics };
};

/**
 * Compute stability score for a country based on recent article sentiments.
 */
const computeStabilityScore = async (isoCode: string): Promise<number> => {
  const country = await Country.findOne({ iso_code: isoCode.toUpperCase() }).lean();
  if (!country) return 50;

  const since = new Date(Date.now() - 7 * 24 * 3_600_000); // last 7 days

  // Find articles mentioning this country
  const articles = await Article.find({
    $or: [
      { country: isoCode.toLowerCase() },
      { 'entities.countries': { $regex: country.name, $options: 'i' } },
    ],
    published_at: { $gte: since },
  })
    .select('_id')
    .lean();

  if (articles.length === 0) return 50;

  const articleIds = articles.map((a) => a._id);

  const sentimentData = await ArticleAnalysis.aggregate([
    { $match: { article_id: { $in: articleIds } } },
    {
      $group: {
        _id: null,
        avgPolarity: { $avg: '$sentiment.polarity' },
        avgBias: { $avg: '$bias_score' },
        crisisCount: {
          $sum: {
            $cond: [{ $eq: ['$classification.category', 'crisis'] }, 1, 0],
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!sentimentData.length) return 50;
  const { avgPolarity, avgBias, crisisCount, count } = sentimentData[0];

  // Base score from sentiment (0–100 range, neutral = 50)
  const sentimentScore = ((avgPolarity + 1) / 2) * 100;
  // Penalty for bias and crisis events
  const biasPenalty = avgBias * 20;
  const crisisPenalty = Math.min(crisisCount * 5, 30);

  const finalScore = Math.max(0, Math.min(100, sentimentScore - biasPenalty - crisisPenalty));

  // Save daily metrics
  await StabilityMetrics.findOneAndUpdate(
    {
      country_code: isoCode.toUpperCase(),
      date: new Date(new Date().setHours(0, 0, 0, 0)),
    },
    {
      $set: {
        composite_score: Math.round(finalScore),
        article_count: articles.length,
        sentiment_avg: avgPolarity,
        crisis_events: crisisCount,
      },
    },
    { upsert: true },
  );

  // Update country stability score
  await Country.findOneAndUpdate(
    { iso_code: isoCode.toUpperCase() },
    { stability_score: Math.round(finalScore), last_updated: new Date() },
  );

  return Math.round(finalScore);
};

/**
 * Get conflict zones (countries with stability < 30).
 */
const getConflictZones = async () => {
  return Country.find({ stability_score: { $lt: 30 } }).sort({ stability_score: 1 }).lean();
};

/**
 * Get regional news overview.
 */
const getRegionalAnalysis = async (region: string) => {
  const countries = await Country.find({
    region: { $regex: region, $options: 'i' },
  }).lean();

  if (!countries.length) return null;

  const isoCodes = countries.map((c) => c.iso_code.toLowerCase());
  const countryNames = countries.map((c) => c.name);

  const recentArticles = await Article.find({
    $or: [
      { country: { $in: isoCodes } },
      { 'entities.countries': { $in: countryNames } },
    ],
  })
    .sort({ published_at: -1 })
    .limit(20)
    .lean();

  const avgStability =
    countries.reduce((sum, c) => sum + c.stability_score, 0) / countries.length;

  return {
    region,
    countryCount: countries.length,
    avgStabilityScore: Math.round(avgStability),
    countries,
    recentArticles,
  };
};

/**
 * Get heatmap data — all countries with stability scores and coordinates.
 */
const getHeatmapData = async () => {
  return Country.find({})
    .select('name iso_code coordinates stability_score region')
    .lean();
};

/**
 * Correlate events across countries — find cross-border crisis patterns.
 */
const correlateEvents = async (countryCodes?: string[]) => {
  const since = new Date(Date.now() - 30 * 24 * 3_600_000); // last 30 days

  const matchQuery: any = { createdAt: { $gte: since } };
  if (countryCodes && countryCodes.length > 0) {
    matchQuery.countries_affected = {
      $in: countryCodes.map((c: string) => c.toUpperCase()),
    };
  }

  // Find crisis events that affect multiple countries
  const multiCountryCrises = await CrisisEvent.find({
    ...matchQuery,
    'countries_affected.1': { $exists: true }, // at least 2 countries
  })
    .populate('source_articles', 'title url published_at')
    .sort({ createdAt: -1 })
    .lean();

  // Find shared crisis types across countries
  const correlations = await CrisisEvent.aggregate([
    { $match: matchQuery },
    { $unwind: '$countries_affected' },
    {
      $group: {
        _id: { type: '$type', country: '$countries_affected' },
        count: { $sum: 1 },
        latestSeverity: { $first: '$severity' },
      },
    },
    {
      $group: {
        _id: '$_id.type',
        countries: {
          $push: {
            country: '$_id.country',
            count: '$count',
            severity: '$latestSeverity',
          },
        },
        totalEvents: { $sum: '$count' },
      },
    },
    { $match: { 'countries.1': { $exists: true } } }, // at least 2 countries share this crisis type
    { $sort: { totalEvents: -1 } },
  ]);

  return {
    multiCountryCrises,
    crossBorderCorrelations: correlations,
  };
};

export const geoService = {
  getAllCountries,
  getCountryDetail,
  computeStabilityScore,
  getConflictZones,
  getRegionalAnalysis,
  getHeatmapData,
  correlateEvents,
};
