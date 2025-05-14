import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { AdminAuthService } from "./AdminAuthService";
import { PrismaTransactionService } from "./PrismaTransactionService";

export const registerServices = fastifyPlugin((server: FastifyInstance, options: FastifyPluginOptions) => {
    const prismaTransactionService = new PrismaTransactionService(server.prisma);

    const services = {
        adminAuthService: new AdminAuthService(server.repositories.adminRepository, prismaTransactionService),
        prismaTransactionService,
    };

    server.decorate('services', services);
});
