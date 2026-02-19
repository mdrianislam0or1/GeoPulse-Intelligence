import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import config from '../';
import logger from '../../utils/logger';

let io: Server;

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

        // Allow authenticated users to join their personal room for targeted alerts
        socket.on('join', (userId: string) => {
            if (userId) {
                socket.join(userId);
                logger.info(`📌 User ${userId} joined room via socket ${socket.id}`);
            }
        });

        socket.on('disconnect', () => {
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
