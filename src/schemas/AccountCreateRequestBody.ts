import { Static, Type } from '@sinclair/typebox';

export const AccountCreateRequestBody = Type.Object({
    full_name: Type.String(),
    phone_number: Type.String(),
    status: Type.String(),
});

export type TAccountCreateRequestBody = Static<typeof AccountCreateRequestBody>;
