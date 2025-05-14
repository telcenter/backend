import { Static, Type } from '@sinclair/typebox';

export const AdminSchema = Type.Object({
    id: Type.Number(),
    email: Type.String(),
});

export type TAdminSchema = Static<typeof AdminSchema>;
