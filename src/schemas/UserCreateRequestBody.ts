import { Static, Type } from '@sinclair/typebox';

export const UserCreateRequestBody = Type.Object({
    full_name: Type.String(),
    national_id: Type.String(),
    birth_date: Type.String(),
});

export type TUserCreateRequestBody = Static<typeof UserCreateRequestBody>;
