import { Static, Type } from '@sinclair/typebox';
import { AccountSchema, convertToAccountSchema } from './AccountSchema';
import { Account, CustomerServiceChat } from '@prisma/client';

export const CustomerServiceChatSchema = Type.Object({
    id: Type.Number(),
    account_id: Type.Number(),
    account: AccountSchema,
    type: Type.String(),
    created_at: Type.String({ format: 'date-time' }),
    summary: Type.String(),
    customer_satisfaction: Type.String(),
});

export type TCustomerServiceChatSchema = Static<typeof CustomerServiceChatSchema>;

export const CustomerServiceChatSchemaList = Type.Array(CustomerServiceChatSchema);

export type TCustomerServiceChatSchemaList = Static<typeof CustomerServiceChatSchemaList>;

export function convertToCustomerServiceChatSchema(chat: CustomerServiceChat, account: Account): TCustomerServiceChatSchema {
    return {
        id: chat.id,
        account_id: chat.account_id,
        account: convertToAccountSchema(account),
        type: chat.type,
        created_at: chat.created_at.toISOString(),
        summary: chat.summary,
        customer_satisfaction: chat.customer_satisfaction,
    };
}

export async function convertToCustomerServiceChatSchemaList(
    chats: CustomerServiceChat[], findAccountByIds: (accountIds: number[]) => Promise<Account[]>,
): Promise<TCustomerServiceChatSchemaList> {
    const accountIds = new Set<number>();
    chats.forEach(chat => accountIds.add(chat.account_id));
    const accountIdsArray = Array.from(accountIds);
    const accounts = await findAccountByIds(accountIdsArray);
    const accountMap = new Map<number, Account>();
    accounts.forEach(account => accountMap.set(account.id, account));

    const results: TCustomerServiceChatSchemaList = [];

    for (const chat of chats) {
        const account = accountMap.get(chat.account_id);
        if (account) {
            results.push(convertToCustomerServiceChatSchema(chat, account));
        }
    }

    return results;
}
