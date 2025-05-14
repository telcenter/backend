import { Static, Type } from '@sinclair/typebox';

export const AdminLoginRequestBody = Type.Object({
    email: Type.String({ minLength: 1 }),
    password: Type.String({ minLength: 1 }),
});

export type TAdminLoginRequestBody = Static<typeof AdminLoginRequestBody>;
