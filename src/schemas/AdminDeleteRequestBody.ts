import { Static, Type } from '@sinclair/typebox';

export const AdminDeleteRequestBody = Type.Object({
    email: Type.String({ minLength: 1 }),
    password: Type.String({ minLength: 1 }),
});

export type TAdminDeleteRequestBody = Static<typeof AdminDeleteRequestBody>;
