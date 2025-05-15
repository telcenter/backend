import { Static, Type } from "@sinclair/typebox";

export const RAGInputSchema = Type.Object({
    chat_summary: Type.String(),
    customer_message: Type.String(),
    customer_emotion: Type.String(),
});

export type TRAGInputSchema = Static<typeof RAGInputSchema>;
