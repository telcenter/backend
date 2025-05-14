import { Static, Type } from '@sinclair/typebox';

export const AdminUpdatePasswordRequestBody = Type.Object({
    email: Type.String({ minLength: 1 }),
    old_password: Type.String({ minLength: 1 }),
    new_password: Type.String({ minLength: 1 }),
});

export type TAdminUpdatePasswordRequestBody = Static<typeof AdminUpdatePasswordRequestBody>;
