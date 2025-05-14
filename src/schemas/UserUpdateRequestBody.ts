import { Static, Type } from '@sinclair/typebox';

export const UserUpdateRequestBody = Type.Object({
    full_name: Type.String(),
    national_id: Type.String(),
    birth_date: Type.String(),
});

export type TUserUpdateRequestBody = Static<typeof UserUpdateRequestBody>;
