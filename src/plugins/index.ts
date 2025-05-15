import { FastifyInstance } from "fastify";
import { prismaPlugin } from "./prismaPlugin";
import fastifyCookie from "@fastify/cookie";
import { registerRepositories } from "@/repositories";
import { registerServices } from "@/services";
import { registerControllers } from "@/controllers";
import { swaggerPlugin } from "./swaggerPlugin";
import { allRoutes } from "@/routes";
import { corsPlugin } from "./corsPlugin";
import { socketIOPlugin } from "./socketIOPlugin";
import { redisPlugin } from "./redisPlugin";

export async function registerAllPlugins(server: FastifyInstance): Promise<void> {
    await Promise.all([
        server.register(swaggerPlugin),

        server.register(redisPlugin),

        server.register(prismaPlugin)
            .then(() => server.register(registerRepositories))
            .then(() => server.register(registerServices))
            .then(() => server.register(registerControllers)),

        server.register(fastifyCookie),

        server.register(corsPlugin),
    ]);

    await server.register(socketIOPlugin);

    await server.register(allRoutes);
}
