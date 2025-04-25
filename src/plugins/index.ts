import { FastifyInstance } from "fastify";
import { prismaPlugin } from "./prismaPlugin";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import { CORS_ALLOW_ORIGIN } from "@/env";

export async function registerAllPlugins(server: FastifyInstance): Promise<void> {
    await Promise.all([
        server.register(prismaPlugin),
        
        server.register(fastifyCookie),

        useCors(server),
    ]);
}

async function useCors(server: FastifyInstance) {
    return await server.register(fastifyCors, {
        // Why not just use CORS in frontendRoutes ?
        // Because when the frontend encounters responses
        // such as 404 or 429, it should be able to
        // inspect the error (so that the error message
        // could be properly displayed to the end user).
        // In able to do that, CORS headers should be
        // sent on such responses, too.
        origin: CORS_ALLOW_ORIGIN.split(","),
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
        allowedHeaders: [
            'Cookie',
            'Content-Type',
            'Content-Encoding',
            'Content-Language',
            'Content-Length',
            'Cache-Control',
            'Accept',
            'Accept-Language',
        ],
        credentials: true,
    });
}
