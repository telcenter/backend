import { PrismaClient/*, User*/ } from "@prisma/client";

// https://github.com/fastify/fastify/issues/1417#issuecomment-458601746

declare module 'fastify' {
    export interface FastifyInstance<
        HttpServer = Server,
        HttpRequest = IncomingMessage,
        HttpResponse = ServerResponse,
    > {
        prisma: PrismaClient;
    }

    export interface FastifyRequest {
        // user: User,
    }
}
