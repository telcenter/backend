import { Static, Type } from '@sinclair/typebox';

export const FaqCreateRequestBody = Type.Object({
    question: Type.String(),
    answer: Type.String(),
});

export type TFaqCreateRequestBody = Static<typeof FaqCreateRequestBody>;
