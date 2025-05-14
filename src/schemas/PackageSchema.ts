import { Package } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const PackageSchema = Type.Object({
    id: Type.Number(),
    created_by_admin_id: Type.Number(),
    created_at: Type.String({ format: 'date-time' }),
    name: Type.String(),
    metadata: Type.String(),
});

export type TPackageSchema = Static<typeof PackageSchema>;

export const PackageSchemaList = Type.Array(PackageSchema);

export type TPackageSchemaList = Static<typeof PackageSchemaList>;

export function convertToPackageSchema(pkg: Package): TPackageSchema {
    return {
        id: pkg.id,
        created_by_admin_id: pkg.created_by_admin_id,
        created_at: pkg.created_at.toISOString(),
        name: pkg.name,
        metadata: pkg.metadata,
    };
}

export function convertToPackageSchemaList(pkgs: Package[]): TPackageSchemaList {
    return pkgs.map((pkg) => convertToPackageSchema(pkg));
}
