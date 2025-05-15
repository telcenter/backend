import { accountAuth } from "@/middleware/accountAuth";
import { CustomerChatMessageCreateRequestBody } from "@/schemas/CustomerChatMessageCreateRequestBody";
import { CustomerChatCreateRequestBody, TCustomerChatCreateRequestBody } from "@/schemas/CustomerServiceChatCreateRequestBody";
import { CustomerServiceChatMessageSchemaList, TCustomerServiceChatMessageSchemaList } from "@/schemas/CustomerServiceChatMessageSchema";
import { CustomerServiceChatSchema, CustomerServiceChatSchemaList, TCustomerServiceChatSchema, TCustomerServiceChatSchemaList } from "@/schemas/CustomerServiceChatSchema";
import { FrontendSocketIOHelpers } from "@/utils/frontendSocketIOHelpers";
import fastifyPlugin from "fastify-plugin";

export const chatsRoutes = fastifyPlugin(async (server, options) => {
    server.register(async server => {
        server.addHook('preHandler', accountAuth);

        server.get<{
            Reply: TCustomerServiceChatSchemaList,
        }>('/end-user/chats',
            { schema: { response: { 200: CustomerServiceChatSchemaList } } },
            req => server.controllers.chatController.getChats(req.account.id)
        );

        server.get<{
            Params: { id: number },
            Reply: TCustomerServiceChatSchema,
        }>('/end-user/chats/:id',
            {
                schema: {
                    params: {
                        type: "object",
                        properties: { id: { type: "number" } },
                        required: ["id"],
                    },
                    response: { 200: CustomerServiceChatSchema },
                },
            },
            req => server.controllers.chatController.getChatById(req.account.id, req.params.id)
        );

        server.get<{
            Params: { id: number },
            Reply: TCustomerServiceChatMessageSchemaList,
        }>("/end-user/chats/:id/messages",
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

        server.post<{
            Body: TCustomerChatCreateRequestBody,
            Reply: TCustomerServiceChatSchema,
        }>('/end-user/text-chats',
            {
                schema: {
                    body: CustomerChatCreateRequestBody,
                    response: { 200: CustomerServiceChatSchema },
                },
            },
            req => server.controllers.chatController.createTextChat(req.body)
        );

        server.post<{
            Body: TCustomerChatCreateRequestBody,
            Reply: TCustomerServiceChatSchema,
        }>('/end-user/audio-calls',
            {
                schema: {
                    body: CustomerChatCreateRequestBody,
                    response: { 200: CustomerServiceChatSchema },
                },
            },
            req => server.controllers.chatController.createAudioCall(req.body)
        );
    });

    server.socketIO.on('connection', async socketFromFrontend => {
        FrontendSocketIOHelpers.addUserMessageEventListener({
            socketFromFrontend,
            onUserMessage: async payload => {
                server.controllers.chatController.customerSendsMessage(
                    socketFromFrontend,
                    payload,
                )
            },
            validationSchema: CustomerChatMessageCreateRequestBody,
        });
    });
});
