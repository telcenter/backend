import { AccountBalanceUpdateRequestBody, TAccountBalanceUpdateRequestBody } from "@/schemas/AccountBalanceUpdateRequestBody";
import { AccountCreateRequestBody, TAccountCreateRequestBody } from "@/schemas/AccountCreateRequestBody";
import { AccountSchema, AccountSchemaList, TAccountSchema, TAccountSchemaList } from "@/schemas/AccountSchema";
import fastifyPlugin from "fastify-plugin";

export const accountsRoutes = fastifyPlugin(async (server, options) => {
    server.get<{
        Reply: TAccountSchemaList,
    }>("/admin/accounts",
        { schema: { response: { 200: AccountSchemaList } } },
        req => server.controllers.adminController.getAccounts()
    );

    server.post<{
        Body: TAccountCreateRequestBody,
        Reply: TAccountSchema,
    }>("/admin/accounts",
        { schema: { body: AccountCreateRequestBody, response: { 200: AccountSchema } } },
        req => server.controllers.adminController.createAccount(req.admin.id, req.body)
    );

    server.patch<{
        Params: { id: number },
        Body: TAccountBalanceUpdateRequestBody,
        Reply: TAccountSchema,
    }>("/admin/accounts/:id/balance",
        {
            schema: {
                body: AccountBalanceUpdateRequestBody, response: { 200: AccountSchema },
                params: {
                    type: "object",
                    properties: { id: { type: "number" } },
                    required: ["id"],
                },
            },
        },
        req => server.controllers.adminController.updateAccountBalance(req.params.id, req.body)
    )

    server.delete<{
        Params: { id: number },
    }>(
        "/admin/accounts/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: { id: { type: "number" } },
                    required: ["id"],
                },
            },
        },
        req => server.controllers.adminController.deleteAccount(req.params.id)
    );
});
