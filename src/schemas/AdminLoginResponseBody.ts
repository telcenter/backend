import { Static, Type } from '@sinclair/typebox';
import { AdminSchema } from './AdminSchema';

export const AdminLoginResponseBody = Type.Object({
    access_token: Type.String(),
    admin: AdminSchema,
});

export type TAdminLoginResponseBody = Static<typeof AdminLoginResponseBody>;
