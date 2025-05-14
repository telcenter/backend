import { CustomerServiceChatMessage } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const CustomerServiceChatMessageSchema = Type.Object({
    id: Type.Number(),
    chat_id: Type.Number(),
    text_content: Type.String(),
    emotion: Type.String(),
    created_at: Type.String({ format: 'date-time' }),
    sender: Type.String(),
});

export type TCustomerServiceChatMessageSchema = Static<typeof CustomerServiceChatMessageSchema>;

export const CustomerServiceChatMessageSchemaList = Type.Array(CustomerServiceChatMessageSchema);

export type TCustomerServiceChatMessageSchemaList = Static<typeof CustomerServiceChatMessageSchemaList>;

export function convertToCustomerServiceChatMessageSchema(message: CustomerServiceChatMessage): TCustomerServiceChatMessageSchema {
    return {
        id: message.id,
        chat_id: message.chat_id,
        text_content: message.text_content,
        emotion: message.emotion,
        created_at: message.created_at.toISOString(),
        sender: message.sender,
    };
}

export function convertToCustomerServiceChatMessageSchemaList(messages: CustomerServiceChatMessage[]): TCustomerServiceChatMessageSchemaList {
    return messages.map((message) => convertToCustomerServiceChatMessageSchema(message));
}
