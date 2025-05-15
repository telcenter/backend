import { REDIS_URL } from '@/env';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import Redis from 'ioredis';

/**
 * This plugin can be registered at any time before the server is listening.
 */
export const redisPlugin: FastifyPluginAsync = fp(async (server: FastifyInstance) => {
    try {
        const redis = new Redis(REDIS_URL);

        server.decorate('redis', redis);
    } catch (error) {
        server.log.error('Failed to initialize Redis plugin:', error);
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
