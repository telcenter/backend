import { adminRoutes } from "./admin";
import fastifyPlugin from "fastify-plugin";
import { endUserRoutes } from "./end-user";

export const allRoutes = fastifyPlugin((server, options) => {
    server.get('/', async (request, reply) => {
        return { message: 'Hello, world!' };
    });

    server.register(adminRoutes);

    server.register(endUserRoutes);
});
