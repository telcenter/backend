import { Static } from '@sinclair/typebox';
import { FaqSchema } from './FaqSchema';

export const FaqCreateResponseBody = FaqSchema;

export type TFaqCreateResponseBody = Static<typeof FaqCreateResponseBody>;
