/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { ApplicationError } from '../../../errors/ApplicationError';
import logger from '../../../utils/logger';
import { User } from '../Auth/auth.model';
import { CrisisEvent } from '../GeoIntelligence/models/CrisisEvent';
import { ApiUsage } from '../NewsIngestion/models/ApiUsage';
import { Article } from '../NewsIngestion/models/Article';
import { QueueTask } from '../Queue/queue.model';

/**
 * List all users (admin only)
 */
const listUsers = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);

  return {
    users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

/**
 * Toggle user active status
 */
const toggleUserActive = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');

  user.isActive = !user.isActive;
  await user.save();

  logger.info(`[Admin] User ${userId} active status toggled to ${user.isActive}`);
  return user;
};

/**
 * Change user role
 */
const changeUserRole = async (userId: string, role: 'admin' | 'user') => {
  const user = await User.findById(userId);
  if (!user) throw new ApplicationError(httpStatus.NOT_FOUND, 'User not found');

  user.role = role;
  await user.save();

  logger.info(`[Admin] User ${userId} role changed to ${role}`);
  return user;
};

/**
 * Get system statistics
 */
const getSystemStats = async () => {
  const [
    totalUsers,
    activeUsers,
    totalArticles,
    analyzedArticles,
    totalCrises,
    activeCrises,
    pendingTasks,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Article.countDocuments(),
    Article.countDocuments({ is_analyzed: true }),
    CrisisEvent.countDocuments(),
    CrisisEvent.countDocuments({ status: 'active' }),
    QueueTask.countDocuments({ status: 'pending' }),
  ]);

  return {
    users: { total: totalUsers, active: activeUsers },
    articles: { total: totalArticles, analyzed: analyzedArticles, pendingAnalysis: totalArticles - analyzedArticles },
    crises: { total: totalCrises, active: activeCrises },
    queue: { pending: pendingTasks },
  };
};

/**
 * Get API usage overview
 */
const getApiUsageOverview = async () => {
  return ApiUsage.find().lean();
};

export const adminService = {
  listUsers,
  toggleUserActive,
  changeUserRole,
  getSystemStats,
  getApiUsageOverview,
};
