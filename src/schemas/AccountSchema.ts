import { Account } from "@prisma/client"
import { Static, Type } from "@sinclair/typebox"

export const AccountSchema = Type.Object({
    id: Type.Number(),
    full_name: Type.String(),
    phone_number: Type.String(),
    created_at: Type.String({ format: "date-time" }),
    status: Type.String(),
    balance: Type.Number(),
});

export type TAccountSchema = Static<typeof AccountSchema>;

export const AccountSchemaList = Type.Array(AccountSchema);

export type TAccountSchemaList = Static<typeof AccountSchemaList>;

export function convertToAccountSchema(account: Account): TAccountSchema {
    return {
        id: account.id,
        full_name: account.full_name,
        phone_number: account.phone_number,
        created_at: account.created_at.toISOString(),
        status: account.status,
        balance: account.balance.toNumber(),
    };
}

export function convertToAccountSchemaList(accounts: Account[]): TAccountSchemaList {
    return accounts.map((account) => convertToAccountSchema(account));
}
