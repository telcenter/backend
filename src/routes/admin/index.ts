import fastifyPlugin from "fastify-plugin";
import { authRoutes } from "./auth";
import { faqRoutes } from "./faq";
import { adminAuth } from "@/middleware/adminAuth";

export const adminRoutes = fastifyPlugin(async (server, options) => {
    server.register(authRoutes);

    server.register(async s => {
        s.addHook('preHandler', adminAuth);
        s.register(faqRoutes);
    });

    // any other routes
    // remember to include auth
});
