import fastifyPlugin from "fastify-plugin";
import { authRoutes } from "./auth";

export const adminRoutes = fastifyPlugin(async (server, options) => {
    server.register(authRoutes);
});
