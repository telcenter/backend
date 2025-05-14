import { PackageMetadataInterpretation } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

export const PackageMetadataInterpretationCreateRequestBody = Type.Object({
    // field_name: Type.Optional(Type.String()),
    // field_local_name: Type.Optional(Type.String()),
    // field_interpretation: Type.Optional(Type.String()),
    field_name: Type.String(),
    field_local_name: Type.String(),
    field_interpretation: Type.String(),
});

export type TPackageMetadataInterpretationCreateRequestBody = Static<typeof PackageMetadataInterpretationCreateRequestBody>;

export function convertToPackageMetadataInterpretationSchema(
    pkgMetadataInterpretation: PackageMetadataInterpretation
): TPackageMetadataInterpretationCreateRequestBody {
    return {
        field_name: pkgMetadataInterpretation.field_name,
        field_local_name: pkgMetadataInterpretation.field_local_name,
        field_interpretation: pkgMetadataInterpretation.field_interpretation,
    };
}
