/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from 'crypto';
import logger from '../../../utils/logger';
import { IQueueTask, QueueTask } from './queue.model';

const WORKER_ID = `worker-${crypto.randomBytes(4).toString('hex')}`;
const LOCK_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Enqueue a new task
 */
const enqueue = async (
  taskType: IQueueTask['taskType'],
  payload: Record<string, any> = {},
  maxRetries = 3,
): Promise<IQueueTask> => {
  const taskId = `${taskType}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

  const task = await QueueTask.create({
    taskId,
    taskType,
    status: 'pending',
    payload,
    maxRetries,
  });

  logger.info(`[Queue] Task enqueued: ${taskId} (${taskType})`);
  return task;
};

/**
 * Dequeue next pending task with atomic lock
 */
const dequeue = async (): Promise<IQueueTask | null> => {
  const now = new Date();
  const lockCutoff = new Date(now.getTime() - LOCK_TIMEOUT_MS);

  // Find and atomically lock a pending task, or reclaim a stale lock
  const task = await QueueTask.findOneAndUpdate(
    {
      $or: [
        { status: 'pending' },
        { status: 'processing', lockedAt: { $lt: lockCutoff } }, // stale lock
      ],
    },
    {
      $set: {
        status: 'processing',
        lockedBy: WORKER_ID,
        lockedAt: now,
      },
    },
    {
      sort: { createdAt: 1 },
      new: true,
    },
  );

  return task;
};

/**
 * Mark task as completed
 */
const complete = async (taskId: string, result?: Record<string, any>): Promise<void> => {
  await QueueTask.findOneAndUpdate(
    { taskId },
    {
      status: 'completed',
      result: result || {},
      processedAt: new Date(),
      lockedBy: null,
      lockedAt: null,
    },
  );
  logger.info(`[Queue] Task completed: ${taskId}`);
};

/**
 * Mark task as failed (with optional retry)
 */
const fail = async (taskId: string, error: string): Promise<void> => {
  const task = await QueueTask.findOne({ taskId });
  if (!task) return;

  if (task.retryCount < task.maxRetries) {
    // Retry: reset to pending with incremented count
    await QueueTask.findOneAndUpdate(
      { taskId },
      {
        status: 'pending',
        retryCount: task.retryCount + 1,
        error,
        lockedBy: null,
        lockedAt: null,
      },
    );
    logger.warn(`[Queue] Task will retry: ${taskId} (attempt ${task.retryCount + 1}/${task.maxRetries})`);
  } else {
    // Max retries exceeded
    await QueueTask.findOneAndUpdate(
      { taskId },
      {
        status: 'failed',
        error,
        processedAt: new Date(),
        lockedBy: null,
        lockedAt: null,
      },
    );
    logger.error(`[Queue] Task failed permanently: ${taskId}`);
  }
};

/**
 * Get queue statistics
 */
const getStats = async () => {
  const [pending, processing, completed, failed] = await Promise.all([
    QueueTask.countDocuments({ status: 'pending' }),
    QueueTask.countDocuments({ status: 'processing' }),
    QueueTask.countDocuments({ status: 'completed' }),
    QueueTask.countDocuments({ status: 'failed' }),
  ]);

  return { pending, processing, completed, failed, total: pending + processing + completed + failed };
};

/**
 * Get recent tasks (for admin dashboard)
 */
const getRecentTasks = async (limit = 20) => {
  return QueueTask.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const queueService = {
  enqueue,
  dequeue,
  complete,
  fail,
  getStats,
  getRecentTasks,
};
