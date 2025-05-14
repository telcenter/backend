import { Faq } from '@prisma/client';
import { Static, Type } from '@sinclair/typebox';

export const FaqSchema = Type.Object({
    id: Type.Number(),
    question: Type.String(),
    answer: Type.String(),
    created_by_admin_id: Type.Number(),
    created_at: Type.String(),
});

export type TFaqSchema = Static<typeof FaqSchema>;

export const FaqSchemaList = Type.Array(FaqSchema);

export type TFaqSchemaList = Static<typeof FaqSchemaList>;

export function convertToFaqSchema(faq: Faq): TFaqSchema {
    return {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        created_by_admin_id: faq.created_by_admin_id,
        created_at: faq.created_at.toISOString(),
    };
}

export function convertToFaqSchemaList(faqs: Faq[]): TFaqSchemaList {
    return faqs.map((faq) => convertToFaqSchema(faq));
}
