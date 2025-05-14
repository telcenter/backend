import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { AdminController } from "./AdminController";
import fastifyPlugin from "fastify-plugin";

export const registerControllers = fastifyPlugin(async (server: FastifyInstance, options: FastifyPluginOptions) => {
    const controllers = {
        adminController: new AdminController(
            server.repositories.adminRepository,
            server.repositories.accountRepository,
            server.repositories.customerServiceChatRepository,
            server.repositories.customerServiceChatMessageRepository,
            server.repositories.packageMetadataInterpretationRepository,
            server.repositories.packageRepository,
            server.services.adminAuthService,
            server.repositories.faqRepository,
        ),
    };

    server.decorate('controllers', controllers);
});
