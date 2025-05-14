import fastifyPlugin from "fastify-plugin";
import { authRoutes } from "./auth";
import { faqRoutes } from "./faq";
import { adminAuth } from "@/middleware/adminAuth";
import { packagesRoutes } from "./packages";
import { packageMetadataInterpretationRoutes } from "./package_metadata_interpretations";

export const adminRoutes = fastifyPlugin(async (server, options) => {
    server.register(authRoutes);

    server.register(async s => {
        s.addHook('preHandler', adminAuth);
        s.register(faqRoutes);
        s.register(packagesRoutes);
        s.register(packageMetadataInterpretationRoutes);
        // any other routes
    });
});
