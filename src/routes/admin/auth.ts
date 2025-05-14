import { AdminCreateRequestBody, TAdminCreateRequestBody } from "@/schemas/AdminCreateRequestBody";
import { AdminLoginRequestBody, TAdminLoginRequestBody } from "@/schemas/AdminLoginRequestBody";
import { AdminLoginResponseBody, TAdminLoginResponseBody } from "@/schemas/AdminLoginResponseBody";
import { AdminSchema, TAdminSchema } from "@/schemas/AdminSchema";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import fastifyPlugin from "fastify-plugin";

export const authRoutes = fastifyPlugin(async (server: FastifyInstance, options: FastifyPluginOptions) => {
    server.post<{
        Body: TAdminLoginRequestBody,
        Reply: TAdminLoginResponseBody,
    }>("/admin/auth/login",
        { schema: { body: AdminLoginRequestBody, response: { 200: AdminLoginResponseBody } } },
        req => server.controllers.adminController.login(req.body)
    );

    server.post<{
        Body: TAdminCreateRequestBody,
        Reply: TAdminSchema,
    }>("/admin/auth/register",
        { schema: { body: AdminCreateRequestBody, response: { 200: AdminSchema } } },
        req => server.controllers.adminController.createAdmin(req.body)
    );
});

export const autoPrefix = '/auth';
