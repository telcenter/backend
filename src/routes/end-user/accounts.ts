import { AccountSchema, TAccountSchema } from "@/schemas/AccountSchema";
import fastifyPlugin from "fastify-plugin";

export const accountsRoutes = fastifyPlugin(async (server, options) => {
    server.get<{
        Params: { phoneNumber: string },
        Reply: TAccountSchema,
    }>("/end-user/accounts-by-phone-number/:phoneNumber",
        {
            schema: {
                params: {
                    type: "object",
                    properties: { phoneNumber: { type: "string" } },
                    required: ["phoneNumber"],
                },
                response: {
                    200: AccountSchema,
                },
            },
        },
        req => server.controllers.chatController.getAccountByPhoneNumber(req.params.phoneNumber),
    );
});
