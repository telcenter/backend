import { Static, Type } from '@sinclair/typebox';

export const AdminCreateRequestBody = Type.Object({
    email: Type.String({ minLength: 1 }),
    password: Type.String({ minLength: 1 }),
    secret_key: Type.String({ minLength: 1 }),
});

export type TAdminCreateRequestBody = Static<typeof AdminCreateRequestBody>;
