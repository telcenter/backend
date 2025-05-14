import { Static, Type } from '@sinclair/typebox';

export const PackageCreateRequestBody = Type.Object({
    name: Type.String(),
    metadata: Type.String(),
});

export type TPackageCreateRequestBody = Static<typeof PackageCreateRequestBody>;
