import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";
import { AdminAuthService } from "./AdminAuthService";
import { PrismaTransactionService } from "./PrismaTransactionService";
import { ChatService } from "./ChatService";
import { NotifyRAGServerService } from "./NotifyRAGServerService";

export const registerServices = fastifyPlugin((server: FastifyInstance, options: FastifyPluginOptions) => {
    const prismaTransactionService = new PrismaTransactionService(server.prisma);

    const notifyRAGServerService = new NotifyRAGServerService(server.redis);

    const services = {
        adminAuthService: new AdminAuthService(server.repositories.adminRepository, prismaTransactionService),
        chatService: new ChatService(
            server.repositories.customerServiceChatRepository,
            server.repositories.customerServiceChatMessageRepository,
            server.repositories.accountRepository,
        ),
        prismaTransactionService,
        notifyRAGServerService,
    };

    server.decorate('services', services);
});
