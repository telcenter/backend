import { CustomerServiceChatSchemaList, TCustomerServiceChatSchemaList } from "@/schemas/CustomerServiceChatSchema";
import fastifyPlugin from "fastify-plugin";

export const customerServiceChatRoutes = fastifyPlugin(async (server, options) => {
    server.get<{
        Reply: TCustomerServiceChatSchemaList,
    }>("/admin/customer-service-chats",
        { schema: { response: { 200: CustomerServiceChatSchemaList } } },
        req => server.controllers.adminController.getCustomerServiceChats()
    );
});
