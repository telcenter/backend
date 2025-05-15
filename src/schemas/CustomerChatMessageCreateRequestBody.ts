import { Static, Type } from '@sinclair/typebox';

export const CustomerChatMessageCreateRequestBody = Type.Object({
    chat_id: Type.Number(),
    text_content: Type.String(),
    ser_emotion: Type.Optional(Type.String()),
});

export type TCustomerChatMessageCreateRequestBody = Static<typeof CustomerChatMessageCreateRequestBody>;
