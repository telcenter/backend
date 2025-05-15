import { CORS_ALLOW_ORIGINS, REDIS_URL } from '@/env';
import { createAdapter } from '@socket.io/redis-adapter';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { Server as SocketIOServer } from 'socket.io';
import Redis from 'ioredis';
import { corsOptions } from './corsPlugin';

/**
 * This plugin can be registered at any time before the server is listening.
 */
export const socketIOPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance) => {
    try {
        const pubClient = new Redis(REDIS_URL);
        const subClient = pubClient.duplicate();

        const socketIO = new SocketIOServer(server.server, {
            cors: corsOptions,
            adapter: createAdapter(pubClient, subClient),
        });

        server.decorate('socketIO', socketIO);

        server.addHook('onClose', async _server => {
            await Promise.all([
                pubClient.quit(),
                subClient.quit(),
            ]);
        });
    } catch (error) {
        server.log.error('Failed to initialize Socket.IO plugin:', error);
        if (error instanceof Error) {
            if (error.message.includes('ECONNREFUSED')) {
                server.log.error('Redis connection refused. Please check if Redis is running and the REDIS_URL is correct.');
            } else {
                // server.log.error('Unexpected error:', error.message);
            }
        } else {
            // server.log.error("" + error);
        }
        throw error;
    }
});
