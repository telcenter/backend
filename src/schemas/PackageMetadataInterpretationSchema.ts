import { PackageMetadataInterpretation } from "@prisma/client";
import { Static, Type } from "@sinclair/typebox";

// {
//     id: number;
//     created_at: Date;
//     created_by_admin_id: number;
//     field_name: string;
//     field_local_name: string;
//     field_interpretation: string;
// }

export const PackageMetadataInterpretationSchema = Type.Object({
    id: Type.Number(),
    created_at: Type.String({ format: "date-time" }),
    created_by_admin_id: Type.Number(),
    field_name: Type.String(),
    field_local_name: Type.String(),
    field_interpretation: Type.String(),
});

export type TPackageMetadataInterpretationSchema = Static<typeof PackageMetadataInterpretationSchema>;

export const PackageMetadataInterpretationSchemaList = Type.Array(PackageMetadataInterpretationSchema);

export type TPackageMetadataInterpretationSchemaList = Static<typeof PackageMetadataInterpretationSchemaList>;

export function convertToPackageMetadataInterpretationSchema(
    pkgMetadataInterpretation: PackageMetadataInterpretation
): TPackageMetadataInterpretationSchema {
    return {
        id: pkgMetadataInterpretation.id,
        created_at: pkgMetadataInterpretation.created_at.toISOString(),
        created_by_admin_id: pkgMetadataInterpretation.created_by_admin_id,
        field_name: pkgMetadataInterpretation.field_name,
        field_local_name: pkgMetadataInterpretation.field_local_name,
        field_interpretation: pkgMetadataInterpretation.field_interpretation,
    };
}

export function convertToPackageMetadataInterpretationSchemaList(
    pkgMetadataInterpretations: PackageMetadataInterpretation[]
): TPackageMetadataInterpretationSchemaList {
    return pkgMetadataInterpretations.map((pkgMetadataInterpretation) =>
        convertToPackageMetadataInterpretationSchema(pkgMetadataInterpretation)
    );
}

