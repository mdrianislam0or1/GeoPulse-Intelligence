/* eslint-disable @typescript-eslint/no-explicit-any */
import { CrisisEvent } from '../GeoIntelligence/models/CrisisEvent';
import { ArticleAnalysis } from '../NewsAnalysis/models/ArticleAnalysis';
import { Article } from '../NewsIngestion/models/Article';

interface DateRange {
  from?: string;
  to?: string;
}

const getDateFilter = (range: DateRange, field = 'analyzed_at') => {
  const filter: any = {};
  if (range.from || range.to) {
    filter[field] = {};
    if (range.from) filter[field].$gte = new Date(range.from);
    if (range.to) filter[field].$lte = new Date(range.to);
  }
  return filter;
};

/**
 * Category distribution
 */
const getCategoryDistribution = async (range: DateRange = {}) => {
  const matchStage = getDateFilter(range);
  return ArticleAnalysis.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$classification.category',
        count: { $sum: 1 },
        avgConfidence: { $avg: '$classification.confidence' },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

/**
 * Sentiment distribution
 */
const getSentimentDistribution = async (range: DateRange = {}) => {
  const matchStage = getDateFilter(range);
  return ArticleAnalysis.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$sentiment.label',
        count: { $sum: 1 },
        avgPolarity: { $avg: '$sentiment.polarity' },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

/**
 * Daily news volume (last 30 days)
 */
const getDailyNewsVolume = async (days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return Article.aggregate([
    { $match: { createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

/**
 * Country distribution
 */
const getCountryDistribution = async (range: DateRange = {}) => {
  const matchStage = getDateFilter(range, 'createdAt');
  return Article.aggregate([
    { $match: { country: { $ne: null }, ...matchStage } },
    {
      $group: {
        _id: '$country',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);
};

/**
 * Source distribution
 */
const getSourceDistribution = async (range: DateRange = {}) => {
  const matchStage = getDateFilter(range, 'createdAt');
  return Article.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$source_api',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

/**
 * Crisis index — active crises by severity
 */
const getCrisisIndex = async () => {
  return CrisisEvent.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: '$severity',
        count: { $sum: 1 },
        avgRisk: { $avg: '$risk_score' },
      },
    },
    { $sort: { avgRisk: -1 } },
  ]);
};

/**
 * Fake news probability trend
 */
const getFakeNewsTrend = async (days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return ArticleAnalysis.aggregate([
    { $match: { analyzed_at: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$analyzed_at' } },
        avgProbability: { $avg: '$fake_news_probability' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

/**
 * Bias trends over time
 */
const getBiasTrends = async (days = 30) => {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return ArticleAnalysis.aggregate([
    { $match: { analyzed_at: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$analyzed_at' } },
        avgBias: { $avg: '$bias_score' },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

/**
 * Topic heatmap — top topics by occurrence across analyses
 */
const getTopicHeatmap = async (range: DateRange = {}) => {
  const matchStage = getDateFilter(range);
  return ArticleAnalysis.aggregate([
    { $match: matchStage },
    { $unwind: '$topics' },
    {
      $group: {
        _id: '$topics.name',
        totalScore: { $sum: '$topics.score' },
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 30 },
  ]);
};

/**
 * Get full dashboard overview
 */
const getDashboardOverview = async (range: DateRange = {}) => {
  const [
    totalArticles,
    totalAnalyzed,
    activeCrises,
    categoryDist,
    sentimentDist,
    dailyVolume,
    crisisIndex,
  ] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ is_analyzed: true }),
    CrisisEvent.countDocuments({ status: 'active' }),
    getCategoryDistribution(range),
    getSentimentDistribution(range),
    getDailyNewsVolume(7),
    getCrisisIndex(),
  ]);

  return {
    summary: {
      totalArticles,
      totalAnalyzed,
      pendingAnalysis: totalArticles - totalAnalyzed,
      activeCrises,
    },
    categoryDistribution: categoryDist,
    sentimentDistribution: sentimentDist,
    dailyVolume,
    crisisIndex,
  };
};

export const dashboardService = {
  getCategoryDistribution,
  getSentimentDistribution,
  getDailyNewsVolume,
  getCountryDistribution,
  getSourceDistribution,
  getCrisisIndex,
  getFakeNewsTrend,
  getBiasTrends,
  getTopicHeatmap,
  getDashboardOverview,
};
