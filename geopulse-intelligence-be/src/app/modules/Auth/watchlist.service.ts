/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { getIO } from '../../../config/socket';
import { ApplicationError } from '../../../errors/ApplicationError';
import { SOCKET_EVENTS } from '../../../socket/events';
import logger from '../../../utils/logger';
import { Article } from '../NewsIngestion/models/Article';
import { UserAlert } from './userAlert.model';
import { IWatchlist, Watchlist } from './watchlist.model';

/**
 * Create a watchlist entry
 */
const createWatchlist = async (
  userId: string,
  data: { type: string; value: string; notify_socket?: boolean; notify_email?: boolean },
): Promise<IWatchlist> => {
  // Check for duplicate
  const existing = await Watchlist.findOne({
    user_id: new Types.ObjectId(userId),
    type: data.type,
    value: data.value,
  });

  if (existing) {
    throw new ApplicationError(httpStatus.CONFLICT, 'Watchlist item already exists');
  }

  const entry = await Watchlist.create({
    user_id: new Types.ObjectId(userId),
    type: data.type,
    value: data.value,
    notify_socket: data.notify_socket ?? true,
    notify_email: data.notify_email ?? false,
  });

  return entry;
};

/**
 * Get all watchlist entries for a user
 */
const getWatchlists = async (userId: string) => {
  return Watchlist.find({ user_id: new Types.ObjectId(userId), is_active: true }).lean();
};

/**
 * Delete a watchlist entry
 */
const deleteWatchlist = async (userId: string, watchlistId: string): Promise<void> => {
  const result = await Watchlist.findOneAndDelete({
    _id: new Types.ObjectId(watchlistId),
    user_id: new Types.ObjectId(userId),
  });

  if (!result) {
    throw new ApplicationError(httpStatus.NOT_FOUND, 'Watchlist item not found');
  }
};

/**
 * Get user alerts (notification history)
 */
const getUserAlerts = async (userId: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [alerts, total] = await Promise.all([
    UserAlert.find({ user_id: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('article_id', 'title url')
      .lean(),
    UserAlert.countDocuments({ user_id: new Types.ObjectId(userId) }),
  ]);

  return {
    alerts,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Mark alert as read
 */
const markAlertRead = async (userId: string, alertId: string) => {
  return UserAlert.findOneAndUpdate(
    { _id: new Types.ObjectId(alertId), user_id: new Types.ObjectId(userId) },
    { is_read: true },
    { new: true },
  );
};

/**
 * Process article alerts — called after each article is saved
 * Matches article against all active watchlists and triggers notifications.
 */
const processArticleAlerts = async (articleId: string): Promise<void> => {
  const article = await Article.findById(articleId).lean();
  if (!article) return;

  const titleLower = (article.title || '').toLowerCase();
  const contentLower = `${article.title || ''} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  const articleCountry = (article.country || '').toUpperCase();

  // Fetch all active watchlists
  const watchlists = await Watchlist.find({ is_active: true }).lean();

  for (const wl of watchlists) {
    let matched = false;

    switch (wl.type) {
      case 'keyword':
        matched = contentLower.includes(wl.value.toLowerCase());
        break;
      case 'country':
        matched = articleCountry === wl.value.toUpperCase() ||
          (article.entities?.countries || []).some(
            (c: string) => c.toUpperCase() === wl.value.toUpperCase(),
          );
        break;
      case 'source':
        matched = (article.source_name || '').toLowerCase().includes(wl.value.toLowerCase());
        break;
      case 'topic':
        matched = contentLower.includes(wl.value.toLowerCase());
        break;
    }

    if (!matched) continue;

    // Create UserAlert
    await UserAlert.create({
      user_id: wl.user_id,
      type: wl.type,
      article_id: article._id,
      value: wl.value,
      message: `New ${wl.type} match: "${article.title?.slice(0, 80)}"`,
    });

    // Socket notification
    if (wl.notify_socket) {
      try {
        const io = getIO();
        io.to(wl.user_id.toString()).emit(SOCKET_EVENTS.WATCHLIST_ALERT, {
          type: wl.type,
          value: wl.value,
          article: {
            id: article._id,
            title: article.title,
            url: article.url,
          },
          timestamp: new Date().toISOString(),
        });
      } catch {
        logger.debug('[Watchlist] Socket not available');
      }
    }

    logger.info(`[Watchlist] Alert triggered for user ${wl.user_id}: ${wl.type}="${wl.value}"`);
  }
};

export const watchlistService = {
  createWatchlist,
  getWatchlists,
  deleteWatchlist,
  getUserAlerts,
  markAlertRead,
  processArticleAlerts,
};
