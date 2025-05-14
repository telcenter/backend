import { PackageCreateRequestBody, TPackageCreateRequestBody } from "@/schemas/PackageCreateRequestBody";
import { PackageSchema, PackageSchemaList, TPackageSchemaList } from "@/schemas/PackageSchema";
import fastifyPlugin from "fastify-plugin";

export const packagesRoutes = fastifyPlugin(async (server, options) => {
    server.get<{
        Reply: TPackageSchemaList,
    }>("/admin/packages",
        { schema: { response: { 200: PackageSchemaList } } },
        req => server.controllers.adminController.getPackages()
    );

    server.post<{
        Body: { name: string; metadata: string },
        Reply: TPackageCreateRequestBody,
    }>("/admin/packages",
        { schema: { body: PackageCreateRequestBody, response: { 200: PackageSchema } } },
        req => server.controllers.adminController.createPackage(req.admin.id, req.body)
    );

    server.delete<{
        Params: { id: number },
    }>(
        "/admin/packages/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: { id: { type: "number" } },
                    required: ["id"],
                },
            },
        },
        req => server.controllers.adminController.deletePackage(req.params.id)
    );
});
