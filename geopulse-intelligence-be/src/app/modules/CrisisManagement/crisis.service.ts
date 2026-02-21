/* eslint-disable @typescript-eslint/no-explicit-any */
import { getIO } from '../../../config/socket';
import { SOCKET_EVENTS } from '../../../socket/events';
import logger from '../../../utils/logger';
import { Watchlist } from '../Auth/watchlist.model';
import { CrisisEvent } from '../GeoIntelligence/models/CrisisEvent';
import { ArticleAnalysis } from '../NewsAnalysis/models/ArticleAnalysis';

const CRISIS_CATEGORIES = ['crisis', 'military', 'natural_disaster', 'health', 'political'];
const SEVERITY_THRESHOLD = {
  critical: 80,
  high: 60,
  medium: 40,
  low: 0,
};

const getSeverity = (riskScore: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (riskScore >= SEVERITY_THRESHOLD.critical) return 'critical';
  if (riskScore >= SEVERITY_THRESHOLD.high) return 'high';
  if (riskScore >= SEVERITY_THRESHOLD.medium) return 'medium';
  return 'low';
};

/**
 * Auto-detect crises from recent negative, crisis-category analyses
 */
const autoDetectCrises = async (): Promise<any[]> => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  // Find recent analyses with crisis indicators
  const analyses = await ArticleAnalysis.find({
    analyzed_at: { $gte: oneDayAgo },
    'classification.category': { $in: CRISIS_CATEGORIES },
    'sentiment.label': 'negative',
    'sentiment.polarity': { $lte: -0.5 },
  })
    .populate('article_id', 'title description country')
    .lean();

  const createdCrises: any[] = [];

  for (const analysis of analyses) {
    const article = analysis.article_id as any;
    if (!article?.title) continue;

    // Check if crisis already exists for this article
    const existing = await CrisisEvent.findOne({
      source_articles: analysis.article_id,
    });
    if (existing) continue;

    const countriesAffected = (analysis.entities?.countries || []).map((c: string) =>
      c.toUpperCase(),
    );

    // Derive type from category
    let crisisType: string = 'other';
    const cat = analysis.classification.category;
    if (cat === 'crisis' || cat === 'natural_disaster') crisisType = 'natural_disaster';
    else if (cat === 'military') crisisType = 'military';
    else if (cat === 'health') crisisType = 'health';
    else if (cat === 'political') crisisType = 'political';

    const riskScore = analysis.risk_score || Math.abs(analysis.sentiment.polarity) * 100;
    const severity = getSeverity(riskScore);

    const crisis = await CrisisEvent.create({
      title: article.title,
      type: crisisType,
      severity,
      countries_affected: countriesAffected,
      status: 'active',
      source_articles: [analysis.article_id],
      risk_score: riskScore,
      description: analysis.summary_ai || '',
      started_at: new Date(),
    });

    createdCrises.push(crisis);

    // Emit socket event
    try {
      const io = getIO();
      io.emit(SOCKET_EVENTS.CRISIS_ALERT, {
        crisis: {
          id: crisis._id,
          title: crisis.title,
          severity: crisis.severity,
          type: crisis.type,
          countries: crisis.countries_affected,
        },
        timestamp: new Date().toISOString(),
      });
    } catch {
      logger.debug('[Crisis] Socket not available');
    }

    logger.info(`🚨 Crisis detected: "${crisis.title}" [${crisis.severity}]`);
  }

  return createdCrises;
};

/**
 * Notify users subscribed to affected countries
 */
const notifySubscribedUsers = async (crisisId: string): Promise<void> => {
  const crisis = await CrisisEvent.findById(crisisId);
  if (!crisis) return;

  // Find watchlist entries matching affected countries
  const watchlistItems = await Watchlist.find({
    type: 'country',
    value: { $in: crisis.countries_affected },
    is_active: true,
  }).lean();

  const io = getIO();

  for (const item of watchlistItems) {
    const userId = item.user_id.toString();

    // Emit to user's personal room
    if (item.notify_socket) {
      io.to(userId).emit(SOCKET_EVENTS.CRISIS_ALERT, {
        crisis: {
          id: crisis._id,
          title: crisis.title,
          severity: crisis.severity,
          countries: crisis.countries_affected,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  logger.info(`[Crisis] Notified ${watchlistItems.length} users for crisis "${crisis.title}"`);
};

/**
 * Get crisis statistics
 */
const getCrisisStats = async () => {
  const [total, active, critical] = await Promise.all([
    CrisisEvent.countDocuments(),
    CrisisEvent.countDocuments({ status: 'active' }),
    CrisisEvent.countDocuments({ severity: 'critical', status: 'active' }),
  ]);

  return { total, active, critical };
};

export const crisisService = {
  autoDetectCrises,
  notifySubscribedUsers,
  getCrisisStats,
};
