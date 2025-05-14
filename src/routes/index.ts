import { adminRoutes } from "./admin";
import fastifyPlugin from "fastify-plugin";

export const allRoutes = fastifyPlugin((server, options) => {
    server.get('/', async (request, reply) => {
        return { message: 'Hello, world!' };
    });

    server.register(adminRoutes);
});
