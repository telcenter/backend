import { FaqCreateRequestBody, TFaqCreateRequestBody } from "@/schemas/FaqCreateRequestBody";
import { FaqCreateResponseBody } from "@/schemas/FaqCreateResponseBody";
import { FaqSchemaList, TFaqSchemaList } from "@/schemas/FaqSchema";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";

export const faqRoutes = fastifyPlugin(async (server: FastifyInstance, options: FastifyPluginOptions) => {
    server.get<{
        Reply: TFaqSchemaList,
    }>("/admin/faqs",
        { schema: { response: { 200: FaqSchemaList } } },
        req => server.controllers.adminController.getFaqs()
    )

    server.post<{
        Body: TFaqCreateRequestBody,
        Reply: TFaqCreateRequestBody,
    }>("/admin/faqs",
        { schema: { body: FaqCreateRequestBody, response: { 200: FaqCreateResponseBody } } },
        req => server.controllers.adminController.createFaq(req.admin.id, req.body)
    )

    server.delete<{
        Params: { id: number },
    }>(
        "/admin/faqs/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: { id: { type: "number" } },
                    required: ["id"],
                },
            },
        },
        req => server.controllers.adminController.deleteFaq(req.params.id)
    )
});

export const autoPrefix = '/auth';
