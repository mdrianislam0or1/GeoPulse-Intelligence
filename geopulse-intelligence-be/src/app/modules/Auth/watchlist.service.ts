import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { getIO } from '../../../config/socket';
import { ApplicationError } from '../../../errors/ApplicationError';
import { SOCKET_EVENTS } from '../../../socket/events';
import logger from '../../../utils/logger';
import { Article } from '../NewsIngestion/models/Article';
import { UserAlert } from './userAlert.model';
import { Watchlist } from './watchlist.model';

// Create a new watchlist item
const createWatchlist = async (userId: string, data: { type: string; value: string; notify_email?: boolean; notify_socket?: boolean }) => {
  const existing = await Watchlist.findOne({ user_id: userId, type: data.type, value: data.value });
  if (existing) {
    throw new ApplicationError(httpStatus.CONFLICT, 'Watchlist item already exists');
  }

  const watchlist = await Watchlist.create({
    user_id: new Types.ObjectId(userId),
    ...data
  });

  return watchlist;
};

// Get all watchlist items for a user
const getMyWatchlist = async (userId: string) => {
  return await Watchlist.find({ user_id: userId }).sort({ createdAt: -1 });
};

// Remove a watchlist item
const removeWatchlist = async (userId: string, watchlistId: string) => {
  const result = await Watchlist.findOneAndDelete({ _id: watchlistId, user_id: userId });
  if (!result) {
    throw new ApplicationError(httpStatus.NOT_FOUND, 'Watchlist item not found');
  }
  return result;
};

// Process new article against all watchlists
// This should be called after a new article is saved or analyzed
const processArticleAlerts = async (articleId: string) => {
  const article = await Article.findById(articleId);
  if (!article) return;

  logger.info(`[Alerts] Processing alerts for article: ${article.title}`);

  // 1. Find country matches
  const countryWatchlists = await Watchlist.find({ type: 'country', value: article.country });

  // 2. Find keyword matches
  // Using simple regex for keyword matching in title/description
  const allKeywordWatchlists = await Watchlist.find({ type: 'keyword' });
  const keywordMatches = allKeywordWatchlists.filter(w =>
    article.title.toLowerCase().includes(w.value.toLowerCase()) ||
    (article.description && article.description.toLowerCase().includes(w.value.toLowerCase()))
  );

  // Combine matches
  const matches = [...countryWatchlists, ...keywordMatches];

  // Dedup by user
  const userMatches = new Map();
  matches.forEach(m => {
    userMatches.set(m.user_id.toString(), m);
  });

  const io = getIO();

  for (const [userId, watchlist] of userMatches.entries()) {
    // Create alert record
    const alert = await UserAlert.create({
      user_id: new Types.ObjectId(userId),
      article_id: article._id,
      watchlist_id: watchlist._id,
      type: watchlist.type,
      is_read: false
    });

    // Emit socket event if enabled
    if (watchlist.notify_socket && io) {
      io.to(userId).emit(SOCKET_EVENTS.WATCHLIST_ALERT, {
        alertId: alert._id,
        articleTitle: article.title,
        type: watchlist.type,
        value: watchlist.value
      });
    }

    // Email notification if enabled
    if (watchlist.notify_email) {
      try {
        const { sendAlertEmail } = await import('../../../utils/emailService');
        await sendAlertEmail(
          userId,
          `📰 Watchlist Alert: ${watchlist.type} match — ${watchlist.value}`,
          `A new article matched your ${watchlist.type} watchlist for "${watchlist.value}".\n\nTitle: ${article.title}\nSource: ${article.source_name || 'Unknown'}\nURL: ${article.url || 'N/A'}`,
        );
      } catch (err: any) {
        logger.error(`[Alerts] Email notification failed for user ${userId}:`, err.message);
      }
    }
  }

  logger.info(`[Alerts] Created ${userMatches.size} alerts for article ${articleId}`);
};

// Get user alerts
const getMyAlerts = async (userId: string, query: { is_read?: boolean; limit?: number }) => {
  const filter: any = { user_id: userId };
  if (query.is_read !== undefined) filter.is_read = query.is_read;

  return await UserAlert.find(filter)
    .populate('article_id', 'title source_name url published_at')
    .sort({ createdAt: -1 })
    .limit(query.limit || 50);
};

// Mark alert as read
const markAlertAsRead = async (userId: string, alertId: string) => {
  const alert = await UserAlert.findOneAndUpdate(
    { _id: alertId, user_id: userId },
    { is_read: true },
    { new: true }
  );
  if (!alert) {
    throw new ApplicationError(httpStatus.NOT_FOUND, 'Alert not found');
  }
  return alert;
};

export const watchlistService = {
  createWatchlist,
  getMyWatchlist,
  removeWatchlist,
  processArticleAlerts,
  getMyAlerts,
  markAlertAsRead
};
