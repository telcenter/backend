import { Static, Type } from "@sinclair/typebox";

export const AccountBalanceUpdateRequestBody = Type.Object({
    balance: Type.Number(),
});

export type TAccountBalanceUpdateRequestBody = Static<typeof AccountBalanceUpdateRequestBody>;
