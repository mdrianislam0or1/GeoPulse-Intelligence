import httpStatus from 'http-status';
import { ApplicationError } from '../../../errors/ApplicationError';
import { generateResponse } from '../../../integrations/openrouter/openrouter.service';
import logger from '../../../utils/logger';
import { CrisisEvent } from '../GeoIntelligence/models/CrisisEvent';
import { ArticleAnalysis } from '../NewsAnalysis/models/ArticleAnalysis';

const ANALYSIS_MODEL = 'mistralai/mistral-7b-instruct';

/**
 * Auto-detect crises from recently analyzed articles.
 * Criteria: category = 'crisis', negative sentiment, high bias.
 */
const autoDetectCrises = async (): Promise<any[]> => {
  const since = new Date(Date.now() - 24 * 3_600_000);

  // Find crisis-category analyses in last 24h
  const crisisAnalyses = await ArticleAnalysis.find({
    'classification.category': 'crisis',
    'sentiment.label': 'negative',
    analyzed_at: { $gte: since },
  })
    .populate('article_id', 'title description entities published_at url')
    .lean();

  const created: any[] = [];

  for (const analysis of crisisAnalyses) {
    const article = analysis.article_id as any;
    if (!article) continue;

    const countriesAffected: string[] = analysis.entities?.countries || [];
    if (!countriesAffected.length) continue;

    // Check if a similar crisis already exists in last 48h
    const existing = await CrisisEvent.findOne({
      title: { $regex: article.title.substring(0, 40), $options: 'i' },
      createdAt: { $gte: new Date(Date.now() - 48 * 3_600_000) },
    });
    if (existing) continue;

    const severity =
      analysis.fake_news_probability < 0.4
        ? analysis.bias_score > 0.7
          ? 'high'
          : 'medium'
        : 'low';

    const crisis = await CrisisEvent.create({
      title: article.title,
      description: analysis.summary_ai || article.description,
      type: 'other',
      severity,
      countries_affected: countriesAffected.map((c: string) => c.toUpperCase()),
      status: 'monitoring',
      started_at: article.published_at || new Date(),
      source_articles: [article._id],
      ai_confidence: analysis.classification?.confidence || 0.5,
    });

    created.push(crisis);
    logger.info('[Crisis] Auto-detected crisis event', { id: crisis._id, title: crisis.title });
  }

  return created;
};

/**
 * Get all active crisis events.
 */
const getActiveEvents = async (status = 'active') => {
  return CrisisEvent.find({ status })
    .sort({ createdAt: -1 })
    .populate('source_articles', 'title url')
    .lean();
};

/**
 * Create a crisis event manually.
 */
const createEvent = async (data: any) => {
  return CrisisEvent.create(data);
};

/**
 * Get single crisis event.
 */
const getEventById = async (id: string) => {
  const event = await CrisisEvent.findById(id)
    .populate('source_articles', 'title url published_at')
    .lean();
  if (!event) throw new ApplicationError(httpStatus.NOT_FOUND, 'Crisis event not found');
  return event;
};

/**
 * Update a crisis event.
 */
const updateEvent = async (id: string, data: any) => {
  const event = await CrisisEvent.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!event) throw new ApplicationError(httpStatus.NOT_FOUND, 'Crisis event not found');
  return event;
};

/**
 * Mark crisis as verified.
 */
const verifyEvent = async (id: string) => {
  const event = await CrisisEvent.findByIdAndUpdate(id, { verified: true }, { new: true });
  if (!event) throw new ApplicationError(httpStatus.NOT_FOUND, 'Crisis event not found');
  return event;
};

/**
 * Generate AI early warnings for pending crisis events.
 */
const generateEarlyWarnings = async () => {
  const monitoringEvents = await CrisisEvent.find({ status: 'monitoring', verified: false })
    .limit(5)
    .lean();

  const warnings: any[] = [];

  for (const event of monitoringEvents) {
    try {
      const prompt = `Based on this crisis event, provide a brief early warning assessment in 2-3 sentences. Include potential escalation risks and recommended monitoring areas.

Event Title: ${event.title}
Type: ${event.type}
Severity: ${event.severity}
Countries: ${event.countries_affected.join(', ')}
Description: ${event.description || 'N/A'}

Return ONLY a plain text 2-3 sentence warning. No JSON.`;

      const response = await generateResponse(
        [{ role: 'user', content: prompt }],
        ANALYSIS_MODEL,
      );
      const warning = response.choices[0]?.message?.content || '';

      await CrisisEvent.findByIdAndUpdate(event._id, { ai_early_warning: warning });
      warnings.push({ eventId: event._id, title: event.title, warning });
    } catch (err: any) {
      logger.error('[Crisis] Early warning generation failed', { error: err.message });
    }
  }

  return warnings;
};

/**
 * Get map-ready crisis data.
 */
const getMapData = async () => {
  return CrisisEvent.find({ status: { $ne: 'resolved' } })
    .select('title type severity countries_affected status ai_confidence createdAt')
    .lean();
};

export const crisisService = {
  autoDetectCrises,
  getActiveEvents,
  createEvent,
  getEventById,
  updateEvent,
  verifyEvent,
  generateEarlyWarnings,
  getMapData,
};
