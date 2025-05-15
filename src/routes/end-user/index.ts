import fastifyPlugin from "fastify-plugin";
import { chatsRoutes } from "./chats";
import { accountsRoutes } from "./accounts";

export const endUserRoutes = fastifyPlugin(async (server, options) => {
    server.register(chatsRoutes);

    server.register(accountsRoutes);
});
