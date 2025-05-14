// import { PackageCreateRequestBody, TPackageCreateRequestBody } from "@/schemas/PackageCreateRequestBody";
// import { PackageSchema, PackageSchemaList, TPackageSchemaList } from "@/schemas/PackageSchema";
import { PackageMetadataInterpretationCreateRequestBody, TPackageMetadataInterpretationCreateRequestBody } from "@/schemas/PackageMetadataInterpretationCreateRequestBody";
import { PackageMetadataInterpretationSchema, PackageMetadataInterpretationSchemaList, TPackageMetadataInterpretationSchema, TPackageMetadataInterpretationSchemaList } from "@/schemas/PackageMetadataInterpretationSchema";
import fastifyPlugin from "fastify-plugin";

export const packageMetadataInterpretationRoutes = fastifyPlugin(async (server, options) => {
    server.get<{
        Reply: TPackageMetadataInterpretationSchemaList,
    }>("/admin/package-metadata-interpretations",
        { schema: { response: { 200: PackageMetadataInterpretationSchemaList } } },
        req => server.controllers.adminController.getPackageMetadataInterpretations()
    );

    server.post<{
        Body: TPackageMetadataInterpretationCreateRequestBody,
        Reply: TPackageMetadataInterpretationSchema,
    }>(
        "/admin/package-metadata-interpretations",
        { schema: { body: PackageMetadataInterpretationCreateRequestBody, response: { 200: PackageMetadataInterpretationSchema } } },
        req => server.controllers.adminController.createPackageMetadataInterpretation(req.admin.id, req.body)
    );

    server.delete<{
        Params: { id: number },
    }>(
        "/admin/package-metadata-interpretations/:id",
        {
            schema: {
                params: {
                    type: "object",
                    properties: { id: { type: "number" } },
                    required: ["id"],
                },
            },
        },
        req => server.controllers.adminController.deletePackageMetadataInterpretation(req.params.id)
    );
});
