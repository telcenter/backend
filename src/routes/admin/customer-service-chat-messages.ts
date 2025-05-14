import { CustomerServiceChatMessageSchemaList, TCustomerServiceChatMessageSchemaList } from "@/schemas/CustomerServiceChatMessageSchema";
import fastifyPlugin from "fastify-plugin";

export const customerServiceChatMessagesRoutes = fastifyPlugin(async (server, options) => {
    server.get<{
        Params: { id: number },
        Reply: TCustomerServiceChatMessageSchemaList,
    }>("/admin/customer-service-chats/:id/messages",
        {
            schema: {
                params: {
                    type: "object",
                    properties: { id: { type: "number" } },
                    required: ["id"],
                },
                response: { 200: CustomerServiceChatMessageSchemaList }
            },
        },
        req => server.controllers.adminController.getCustomerServiceChatMessages(req.params.id)
    );
});
