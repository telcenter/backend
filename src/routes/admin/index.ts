import fastifyPlugin from "fastify-plugin";
import { authRoutes } from "./auth";
import { faqRoutes } from "./faq";
import { adminAuth } from "@/middleware/adminAuth";
import { packagesRoutes } from "./packages";
import { packageMetadataInterpretationRoutes } from "./package-metadata-interpretations";
import { accountsRoutes } from "./accounts";
import { customerServiceChatRoutes } from "./customer-service-chats";
import { customerServiceChatMessagesRoutes } from "./customer-service-chat-messages";

export const adminRoutes = fastifyPlugin(async (server, options) => {
    server.register(authRoutes);

    server.register(async s => {
        s.addHook('preHandler', adminAuth);
        s.register(faqRoutes);
        s.register(packagesRoutes);
        s.register(packageMetadataInterpretationRoutes);
        s.register(accountsRoutes);
        s.register(customerServiceChatRoutes);
        s.register(customerServiceChatMessagesRoutes);
        // any other routes
    });
});
