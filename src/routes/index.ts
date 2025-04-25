import { FastifyInstance, FastifyPluginOptions } from "fastify";

export async function allRoutes(server: FastifyInstance, options: FastifyPluginOptions) {
    // server.register(apiRoutes, { prefix: '/api' });
    // server.get('/order-admin', OrderAdminController.index);

    server.get('/', async (request, reply) => {
        return { message: 'Hello, world!' };
    });
}
