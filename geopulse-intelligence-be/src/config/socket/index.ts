import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import config from '../';
import logger from '../../utils/logger';

let io: Server;

// Sliding-window rate limiter: max 10 emits per socket per second
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 1000;
const socketRateLimitMap = new Map<string, number[]>();

function isRateLimited(socketId: string): boolean {
  const now = Date.now();
  const timestamps = socketRateLimitMap.get(socketId) ?? [];
  // Evict old timestamps outside the window
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  socketRateLimitMap.set(socketId, recent);
  return recent.length > RATE_LIMIT;
}

// Loose MongoDB ObjectId check (24 hex chars)
const OBJECT_ID_RE = /^[a-f\d]{24}$/i;

function isValidUserId(userId: unknown): userId is string {
  return typeof userId === 'string' && OBJECT_ID_RE.test(userId);
}

function applyRateLimiter(socket: Socket): void {
  const original = socket.emit.bind(socket);
  // Intercept all emits from this socket (client-to-server events are handled via .on)
  // For server-to-client we don't rate-limit; we rate-limit client messages via onAny.
  socket.onAny((_event: string, ..._args: unknown[]) => {
    if (isRateLimited(socket.id)) {
      logger.warn(`[Socket] Rate limit exceeded for ${socket.id} — disconnecting`);
      socket.emit('error', { code: 4429, message: 'Too many events. Slow down.' });
      socket.disconnect(true);
    }
  });
  // suppress unused variable warning — bind is kept for type safety
  void original;
}

export function initSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: [
        config.frontend_url,
        'http://localhost:3000',
        'http://localhost:5173',
      ],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    // Apply flood protection to every new socket
    applyRateLimiter(socket);

    // Allow authenticated users to join their personal room for targeted alerts
    socket.on('join', (userId: unknown) => {
      if (!isValidUserId(userId)) {
        socket.emit('error', { code: 4000, message: 'Invalid userId — must be a 24-char hex string' });
        logger.warn(`[Socket] Invalid userId join attempt from ${socket.id}:`, userId);
        return;
      }
      socket.join(userId);
      logger.info(`📌 User ${userId} joined room via socket ${socket.id}`);
    });

    // Allow admin users to join admin-specific room
    socket.on('join:admin', (userId: unknown) => {
      if (!isValidUserId(userId)) {
        socket.emit('error', { code: 4000, message: 'Invalid userId' });
        return;
      }
      socket.join('admin');
      logger.info(`👑 Admin ${userId} joined admin room via socket ${socket.id}`);
    });

    socket.on('disconnect', () => {
      socketRateLimitMap.delete(socket.id);
      logger.info(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}
