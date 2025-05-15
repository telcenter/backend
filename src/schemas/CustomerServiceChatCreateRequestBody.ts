import { Static, Type } from '@sinclair/typebox';

export const CustomerChatCreateRequestBody = Type.Object({
    phone_number: Type.String(),
});

export type TCustomerChatCreateRequestBody = Static<typeof CustomerChatCreateRequestBody>;
